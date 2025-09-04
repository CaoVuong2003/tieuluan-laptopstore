package com.tieuluan.laptopstore.auth.controller;

import com.tieuluan.laptopstore.auth.services.EmailService;
import com.tieuluan.laptopstore.auth.config.JWTTokenHelper;
import com.tieuluan.laptopstore.auth.dto.CodeResponse;
import com.tieuluan.laptopstore.auth.dto.LoginRequest;
import com.tieuluan.laptopstore.auth.dto.RegistrationRequest;
import com.tieuluan.laptopstore.auth.dto.ForgotPassword.ForgotPasswordRequest;
import com.tieuluan.laptopstore.auth.dto.ForgotPassword.ResendOtp;
import com.tieuluan.laptopstore.auth.dto.ForgotPassword.ResetPasswordRequest;
import com.tieuluan.laptopstore.auth.dto.ForgotPassword.VerifyOtpForgotPassword;
import com.tieuluan.laptopstore.auth.dto.User.UserToken;
import com.tieuluan.laptopstore.auth.entities.User;
import com.tieuluan.laptopstore.auth.repositories.UserDetailRepository;
import com.tieuluan.laptopstore.auth.services.OtpService;
import com.tieuluan.laptopstore.auth.services.RegistrationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.TimeUnit;

// Định nghĩa đây là một REST API controller (thay vì trả về view thì trả về JSON, object)
@RestController
// Cho phép các request từ domain khác (cross-origin), cần thiết khi FE và BE chạy trên 2 cổng/host khác nhau
@CrossOrigin
// Mapping gốc cho tất cả endpoint trong controller này sẽ bắt đầu bằng /api/auth
@RequestMapping("/api/auth")
public class AuthController {

    // Tự động inject AuthenticationManager (của Spring Security) để thực hiện việc xác thực user
    @Autowired
    AuthenticationManager authenticationManager;

    // Service xử lý logic đăng ký tài khoản
    @Autowired
    RegistrationService registrationService;

    // Spring Security UserDetailsService, dùng để load thông tin user từ DB
    @Autowired
    UserDetailsService userDetailsService;

    // Helper class để sinh/gia hạn token JWT
    @Autowired
    JWTTokenHelper jwtTokenHelper;

    @Autowired
    OtpService otpService;

    @Autowired
    EmailService emailService;

    @Autowired
    RedisTemplate<String, String> redisTemplate;

    @Autowired
    UserDetailRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    // API login: nhận thông tin đăng nhập và trả về token nếu thành công
    @PostMapping("/login")
    public ResponseEntity<UserToken> login(@RequestBody LoginRequest loginRequest){
        try{
            // Tạo đối tượng Authentication chưa xác thực (chỉ chứa username và password người dùng nhập vào)
            Authentication authentication = UsernamePasswordAuthenticationToken.unauthenticated(
                    loginRequest.getUserName(),
                    loginRequest.getPassword()
            );

            // Nhờ authenticationManager xác thực thông tin này (so sánh với DB, password encoder,…)
            Authentication authenticationResponse = this.authenticationManager.authenticate(authentication);

            // Nếu xác thực thành công
            if(authenticationResponse.isAuthenticated()){
                // Lấy thông tin user đã xác thực ra
                User user = (User) authenticationResponse.getPrincipal();

                // Kiểm tra user có được kích hoạt (enabled) hay chưa
                if(!user.isEnabled()) {
                    // Nếu chưa thì từ chối đăng nhập
                    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                }

                // Sinh token JWT dựa trên email user
                String token = jwtTokenHelper.generateToken(user.getEmail());

                // Gói token vào object UserToken để trả về FE
                UserToken userToken = UserToken.builder().token(token).build();

                // Trả về token với status 200 OK
                return new ResponseEntity<>(userToken, HttpStatus.OK);
            }

        } catch (BadCredentialsException e) {
            // Nếu username hoặc password sai -> trả về 401 Unauthorized
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Nếu có lỗi khác hoặc không xác thực được
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    // API register: dùng để đăng ký tài khoản mới
    @PostMapping("/register")
    public ResponseEntity<CodeResponse> register(@RequestBody RegistrationRequest request){
        // Gọi service để xử lý tạo tài khoản
        CodeResponse registrationResponse = registrationService.createUser(request);

        // Trả về response với code 200 nếu thành công, còn lại thì 400 Bad Request
        return new ResponseEntity<>(registrationResponse,
                registrationResponse.getCode() == 200 ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    // API verify: xác minh tài khoản qua mã code (thường gửi email)
    @PostMapping("/verifyOtp-register")
    public ResponseEntity<?> verifyCode(@RequestBody Map<String,String> map){
        String email = map.get("email");
        String otp = map.get("otp");
        boolean success = registrationService.verifyUser(email, otp);
        if (success) {
            return ResponseEntity.ok("User verified successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("The verification code is incorrect or expired.");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String email = request.getEmail();
        System.out.println("Email nhận được: " + email);
        User user = userRepository.findByEmail(email);
        System.out.println("User tìm thấy: " + user);
        if (user == null) {
            return ResponseEntity.badRequest().body("Email không tồn tại!");
        }

        // Tạo OTP
        String otp = otpService.generateOtp();
        
        // Lưu vào Redis hoặc DB tạm
        redisTemplate.opsForValue().set("OTP:" + email, otp, 5, TimeUnit.MINUTES);

        // Gửi OTP qua email
        emailService.sendEmail(email, "OTP đặt lại mật khẩu", "Mã OTP của bạn là: " + otp);

        return ResponseEntity.ok("Đã gửi OTP tới email.");
    }

    @PostMapping("/verifyOtp-forgotPassword")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpForgotPassword request) {
        String email = request.getEmail();
        String otp = request.getOtp();

        System.out.println("👉 Email nhận: " + request.getEmail());
        System.out.println("👉 OTP nhận: " + request.getOtp());

        String cachedOtp = redisTemplate.opsForValue().get("OTP:" + email);

        if (cachedOtp == null) {
            return ResponseEntity.badRequest().body("OTP đã hết hạn hoặc không tồn tại!");
        }
        if (!cachedOtp.equals(otp)) {
            return ResponseEntity.badRequest().body("OTP không hợp lệ!");
        }
        redisTemplate.delete("OTP:" + email);

        return ResponseEntity.ok("Xác thực OTP thành công!");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        String email = request.getEmail();
        String newPassword = request.getNewPassword();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Đổi mật khẩu thành công!");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestBody ResendOtp request) {
        String email = request.getEmail();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("Email không tồn tại!");
        }

        // Tạo OTP mới
        String otp = otpService.generateOtp();

        // Ghi đè lại OTP trong Redis (5 phút)
        otpService.saveOtpAndUser(email, otp, "", 5);

        // Gửi lại email
        emailService.sendEmail(email, "OTP xác thực lại", "Mã OTP mới của bạn là: " + otp);

        return ResponseEntity.ok("Đã gửi lại OTP!");
    }

}
