package com.tieuluan.laptopstore.auth.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tieuluan.laptopstore.auth.dto.RedisUser;
import com.tieuluan.laptopstore.auth.dto.RegistrationRequest;
import com.tieuluan.laptopstore.auth.dto.RegistrationResponse;
import com.tieuluan.laptopstore.auth.entities.User;
import com.tieuluan.laptopstore.auth.repositories.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerErrorException;

/**
 * RegistrationService chịu trách nhiệm xử lý quá trình đăng ký và xác thực user.
 *
 * - createUser(RegistrationRequest request): 
 *   + Kiểm tra email đã tồn tại chưa.
 *   + Nếu chưa, tạo user mới (encode mật khẩu, gán provider=manual, generate mã xác thực, gán role mặc định).
 *   + Lưu user vào DB, gửi email xác thực và trả về RegistrationResponse.
 *
 * - verifyUser(String userName):
 *   + Xác thực user dựa trên email (userName).
 *   + Nếu tồn tại thì bật trạng thái enabled = true và lưu lại DB.
 */
@Service
public class RegistrationService {

    @Autowired
    private UserDetailRepository userDetailRepository;

    @Autowired
    private AuthorityService authorityService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private ObjectMapper objectMapper;

    public RegistrationResponse createUser(RegistrationRequest request) {
        User existing = userDetailRepository.findByEmail(request.getEmail());

        if (existing != null) {
            return RegistrationResponse.builder()
                    .code(400)
                    .message("Email already exist!")
                    .build();
        }

        try {
            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setEnabled(false);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhoneNumber(request.getPhoneNumber());
            user.setProvider("manual");


            System.out.println(user.getPassword()); // null nếu không set trước đó
            System.out.println(user.getPhoneNumber()); // null nếu không set trước đó

            // Gán role ngay khi tạo user
            user.setAuthorities(authorityService.getUserAuthority());

            //Tạo otp
            String otp = otpService.generateOtp();

            // Tạo RedisUser để lưu Redis
            RedisUser redisUser = new RedisUser();

            redisUser.setEmail(user.getEmail());
            redisUser.setPassword(user.getPassword()); // hashed
            redisUser.setFirstName(user.getFirstName());
            redisUser.setLastName(user.getLastName());
            redisUser.setPhoneNumber(user.getPhoneNumber());
            redisUser.setProvider(user.getProvider());

            // Chuyển user sang JSON để lưu vào Redis
            String userJson = objectMapper.writeValueAsString(redisUser);

            // Lưu OTP + user tạm vào Redis (5 phút)
            otpService.saveOtpAndUser(user.getEmail(), otp, userJson, 5);
            System.out.println("OTP for " + user.getEmail() + ": " + otp);
            
            // Gửi email xác thực
            emailService.sendMail(user, otp);

            return RegistrationResponse.builder()
                    .code(200)
                    .message("User created!")
                    .build();

        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerErrorException("Registration failed", e);
        }
    }

    public boolean verifyUser(String email, String otp) {
        String storedOtp = otpService.getOtp(email);
        System.out.println("🔹 storedOtp = " + storedOtp + " | inputOtp = " + otp);

        if (storedOtp == null) {
            System.out.println("❌ OTP expired or not found in Redis");
            return false;
        }

        if (!storedOtp.trim().equals(otp.trim())) {
            System.out.println("❌ OTP mismatch");
            return false;
        }

        try {
            String userJson = otpService.getTempUser(email);
            if (userJson == null) return false;

            // Chuyển JSON sang RedisUser
            RedisUser redisUser = objectMapper.readValue(userJson, RedisUser.class);

            System.out.println("pass: "+redisUser.getPassword()); // null nếu không set trước đó
            System.out.println("phone: "+redisUser.getPhoneNumber()); // null nếu không set trước đó

            // Lấy user thực từ DB (hoặc tạo mới nếu chưa tồn tại)
            User user = userDetailRepository.findByEmail(email);
            if (user == null) {
                user = new User();
                user.setEmail(redisUser.getEmail());
                user.setFirstName(redisUser.getFirstName());
                user.setLastName(redisUser.getLastName());
                user.setPassword(redisUser.getPassword());
                user.setPhoneNumber(redisUser.getPhoneNumber());
                user.setProvider(redisUser.getProvider());

                // Gán role từ DB, không lấy từ JSON
                user.setAuthorities(authorityService.getUserAuthority());
            }

            user.setEnabled(true);
            userDetailRepository.save(user); // giờ Hibernate sẽ không complain
            otpService.deleteOtpAndUser(email);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
