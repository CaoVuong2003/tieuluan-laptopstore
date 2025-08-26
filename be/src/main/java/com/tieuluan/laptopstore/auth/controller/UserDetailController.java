package com.tieuluan.laptopstore.auth.controller;

import com.tieuluan.laptopstore.auth.dto.UserDetailsDto;
import com.tieuluan.laptopstore.auth.entities.User;
import com.tieuluan.laptopstore.auth.mapper.UserDetailsMapper;
import com.tieuluan.laptopstore.auth.repositories.UserDetailRepository;
import com.tieuluan.laptopstore.auth.services.CustomUserDetailService;
import com.tieuluan.laptopstore.auth.services.CloudinaryService;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.Date;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController // Định nghĩa đây là REST Controller, trả JSON (không trả về view như @Controller)
@CrossOrigin   // Cho phép gọi API từ domain khác (tránh lỗi CORS khi frontend gọi API)
@RequestMapping("/api/user") // Tất cả API trong class này sẽ có prefix là /api/user
public class UserDetailController {

    // --- Inject các dependency cần thiết ---
    @Autowired
    private UserDetailsService userDetailsService; // Spring Security service load thông tin user

    @Autowired
    private CustomUserDetailService customUserDetailService; // Service custom để lưu/update user

    @Autowired
    private UserDetailRepository userDetailRepository; // Repository thao tác với DB (User entity)

    @Autowired
    private CloudinaryService cloudinaryService; // Service upload ảnh lên Cloudinary

    @Autowired
    private UserDetailsMapper userDetailsMapper; // Mapper chuyển entity <-> DTO

    // ================== API LẤY THÔNG TIN PROFILE NGƯỜI DÙNG ==================
    @GetMapping("/profile")
    public ResponseEntity<UserDetailsDto> getUserProfile(Principal principal) {
        if (principal == null) {
            // Người dùng chưa login / token sai
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Lấy user hiện tại từ token (Spring Security lưu trong Principal)
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());

        // Nếu không tồn tại => chưa đăng nhập hoặc token sai
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        // Chuyển User entity sang DTO để trả ra frontend
        UserDetailsDto userDetailsDto = UserDetailsDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .addressList(user.getAddressList())
                .authorityList(user.getAuthorities().toArray()) // quyền (role) của user
                .build();

        return new ResponseEntity<>(userDetailsDto, HttpStatus.OK);
    }

    // ================== API UPDATE PROFILE NGƯỜI DÙNG (form-data) ==================
    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUserProfile(
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "avatarUrl", required = false) String avatarUrl,
            @RequestPart(value = "avatar", required = false) MultipartFile avatarFile, // Upload ảnh
            Principal principal
    ) {
        // Lấy user hiện tại từ token
        User user = (User) userDetailsService.loadUserByUsername(principal.getName());

        if (user == null) {
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        // Cập nhật thông tin cá nhân nếu có dữ liệu gửi lên
        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (email != null) user.setEmail(email);
        if (phoneNumber != null) user.setPhoneNumber(phoneNumber);

        // Nếu có ảnh upload thì upload lên Cloudinary
        try {
            if (avatarFile != null && !avatarFile.isEmpty()) {
                String uploadedFile = cloudinaryService.uploadFile(avatarFile);
                user.setAvatarUrl(uploadedFile);
            }
            else if (avatarUrl != null && !avatarUrl.isEmpty()) {
                String uploadedUrl = cloudinaryService.uploadFileFromUrl(avatarUrl);
                user.setAvatarUrl(uploadedUrl);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Upload ảnh thất bại: " + e.getMessage());
        }

        // Cập nhật ngày sửa đổi + lưu lại
        user.setUpdatedOn(new Date());
        customUserDetailService.save(user);

        // Trả lại thông tin mới cập nhật
        UserDetailsDto updatedDto = UserDetailsDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .addressList(user.getAddressList())
                .authorityList(user.getAuthorities().toArray())
                .build();
        return ResponseEntity.ok(updatedDto);
    }

    // ================== API LẤY DANH SÁCH USER (có phân trang + filter enabled) ==================
    @GetMapping
    public ResponseEntity<Map<String, Object>> getUsers(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "1000") int perPage,
        @RequestParam(required = false) Boolean enabled
    ) {
        PageRequest pageable = PageRequest.of(page - 1, perPage);
        Page<User> users;
        long total;

        if (enabled == null) {
            // Không filter
            users = userDetailRepository.findAll(pageable);
            total = userDetailRepository.count();
        } else {
            // Filter theo enabled = true/false
            users = userDetailRepository.findAllByEnabled(enabled, pageable);
            total = userDetailRepository.countByEnabled(enabled);
        }

        // Convert sang DTO
        List<UserDetailsDto> userDtos = users.getContent().stream()
            .map(userDetailsMapper::toUserDetailsDto)
            .collect(Collectors.toList());

        // Response
        Map<String, Object> response = new HashMap<>();
        response.put("data", userDtos);
        response.put("total", total);

        return ResponseEntity.ok(response);
    }

    // ================== API LẤY USER THEO ID ==================
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable UUID id) {
        Optional<User> optionalUser = userDetailRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            UserDetailsDto dto = UserDetailsDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .avatarUrl(user.getAvatarUrl())
                .addressList(user.getAddressList())
                .authorityList(user.getAuthorities().toArray())
                .enabled(user.isEnabled())
                .build();
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    // ================== API UPDATE USER BẰNG FORM-DATA ==================
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUserById(
            @PathVariable UUID id,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "avatarUrl", required = false) String avatarUrl,
            @RequestPart(value = "avatarFile", required = false) MultipartFile avatarFile,
            @RequestParam(value = "enabled", required = false) Boolean enabled
    ) {
        Optional<User> optionalUser = userDetailRepository.findById(id);
        if (optionalUser.isEmpty()) 
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found"));

        User user = optionalUser.get();
        // Gọi hàm update chung
        updateUserInfo(user, firstName, lastName, email, phoneNumber, avatarUrl, avatarFile, enabled);
        
        return ResponseEntity.ok(userDetailsMapper.toUserDetailsDto(user));
    }

    // ================== API UPDATE USER BẰNG JSON ==================
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUserJson(@PathVariable UUID id, @RequestBody UserDetailsDto dto) {
        Optional<User> optionalUser = userDetailRepository.findById(id);
        if (optionalUser.isEmpty()) 
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));

        User user = optionalUser.get();
        // Gọi hàm update chung
        updateUserInfo(user, dto.getFirstName(), dto.getLastName(), dto.getEmail(),
                dto.getPhoneNumber(), dto.getAvatarUrl(), null, dto.getEnabled());
        return ResponseEntity.ok(userDetailsMapper.toUserDetailsDto(user));
    }

    // ================== API XÓA USER (XÓA MỀM) ==================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable UUID id) {
        Optional<User> optionalUser = userDetailRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = optionalUser.get();
        user.setEnabled(false); // 👈 Xóa mềm (disable user thay vì xóa DB)
        user.setUpdatedOn(new Date()); // cập nhật thời gian xóa
        customUserDetailService.save(user); // lưu lại user

        return ResponseEntity.ok(Map.of("message", "User disabled successfully"));
    }

    // ================== HÀM CHUNG: cập nhật thông tin + upload ảnh ==================
    private void updateUserInfo(User user, String firstName, String lastName, String email, String phoneNumber,
                                String avatarUrl, MultipartFile avatarFile, Boolean enabled) {
        if (firstName != null) user.setFirstName(firstName);
        if (lastName != null) user.setLastName(lastName);
        if (email != null) user.setEmail(email);
        if (phoneNumber != null) user.setPhoneNumber(phoneNumber);
        if (enabled != null) user.setEnabled(enabled);

        try {
            if (avatarFile != null && !avatarFile.isEmpty()) {
                String uploadedUrl = cloudinaryService.uploadFile(avatarFile);
                user.setAvatarUrl(uploadedUrl);
            } else if (avatarUrl != null && !avatarUrl.isBlank()) {
                String uploadedUrl = cloudinaryService.uploadFileFromUrl(avatarUrl);
                user.setAvatarUrl(uploadedUrl);
            }
        } catch (IOException e) {
            throw new RuntimeException("Upload ảnh thất bại: " + e.getMessage());
        }

        user.setUpdatedOn(new Date());
        customUserDetailService.save(user);
    }
}
