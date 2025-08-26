package com.tieuluan.laptopstore.auth.controller;

import com.tieuluan.laptopstore.auth.config.JWTTokenHelper;
import com.tieuluan.laptopstore.auth.entities.User;
import com.tieuluan.laptopstore.auth.services.OAuth2Service;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

// Đánh dấu đây là một REST Controller (API trả JSON/redirect, không trả view JSP/Thymeleaf)
@RestController

// Cho phép các domain khác gọi API này (tránh lỗi CORS khi FE và BE khác host/port)
@CrossOrigin

// Mapping gốc cho tất cả API trong controller này là /oauth2
@RequestMapping("/oauth2")
public class OAuth2Controller {

    // Inject service xử lý logic OAuth2 (tạo user, tìm user,…)
    @Autowired
    OAuth2Service oAuth2Service;

    // Helper class để sinh/gia hạn token JWT
    @Autowired
    private JWTTokenHelper jwtTokenHelper;

    // API callback khi đăng nhập OAuth2 thành công (Google/Facebook…)
    // Spring Security sẽ tự động inject OAuth2User (thông tin user từ provider)
    @GetMapping("/success")
    public void callbackOAuth2(
            @AuthenticationPrincipal OAuth2User oAuth2User, // user lấy được từ Google
            HttpServletResponse response // để redirect về FE
    ) throws IOException {

        // Lấy email từ thông tin OAuth2User (Google luôn trả về email)
        String userName = oAuth2User.getAttribute("email");

        // Kiểm tra trong DB xem user đã tồn tại chưa
        User user = oAuth2Service.getUser(userName);

        // Nếu chưa có user trong DB thì tạo mới
        if (null == user) {
            user = oAuth2Service.createUser(oAuth2User, "google");
        }

        // Sinh JWT token cho user (dựa trên username)
        String token = jwtTokenHelper.generateToken(user.getUsername());

        // Redirect về frontend kèm theo token (FE nhận token và lưu vào localStorage/sessionStorage)
        response.sendRedirect("http://localhost:3000/oauth2/callback?token=" + token);
    }
}
