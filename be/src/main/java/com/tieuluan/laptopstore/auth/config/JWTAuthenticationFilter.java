package com.tieuluan.laptopstore.auth.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

// Lớp filter custom để xử lý JWT trong mỗi request
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    // Dùng để so khớp đường dẫn (ví dụ "/api/auth/**")
    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    // Service của Spring Security để lấy thông tin người dùng
    private final UserDetailsService userDetailsService;

    // Helper class (tự viết) để xử lý token JWT (tạo, parse, validate,...)
    private final JWTTokenHelper jwtTokenHelper;

    // Constructor để inject dependency
    public JWTAuthenticationFilter(JWTTokenHelper jwtTokenHelper, UserDetailsService userDetailsService) {
        this.jwtTokenHelper = jwtTokenHelper;
        this.userDetailsService = userDetailsService;
    }

    // Hàm chính của filter, chạy cho mỗi request
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        
        // Lấy đường dẫn của request (ví dụ: "/api/products/1")
        String path = request.getServletPath();

        // Danh sách các API public (không cần JWT xác thực)
        List<String> publicPaths = Arrays.asList(
            "/api/auth/**",     // login, register
            "/api/category/**", // danh mục sản phẩm
            "/api/products/**", // danh sách sản phẩm
            "/v3/api-docs/**",  // swagger docs
            "/swagger-ui/**"    // swagger UI
        );

        // Kiểm tra xem đường dẫn hiện tại có thuộc danh sách public không
        boolean isPublic = publicPaths.stream()
            .anyMatch(pattern -> pathMatcher.match(pattern, path));

        // Nếu là API public => cho qua không kiểm tra JWT
        if (isPublic) {
            filterChain.doFilter(request, response);
            return;
        }

        // Lấy token từ header Authorization
        String authHeader = request.getHeader("Authorization");

        // Nếu không có header hoặc không bắt đầu bằng "Bearer" => cho qua luôn
        if (authHeader == null || !authHeader.startsWith("Bearer")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Dùng helper lấy token (cắt "Bearer ")
            String authToken = jwtTokenHelper.getToken(request);

            if (authToken != null) {
                // Parse token để lấy username
                String userName = jwtTokenHelper.getUserNameFromToken(authToken);

                if (userName != null) {
                    // Tìm thông tin user từ database (qua UserDetailsService)
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userName);

                    // Validate token có hợp lệ với user không
                    if (jwtTokenHelper.validateToken(authToken, userDetails)) {
                        // Nếu hợp lệ => tạo Authentication object
                        UsernamePasswordAuthenticationToken authenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                userDetails,       // thông tin user
                                null,              // credentials (password để null)
                                userDetails.getAuthorities() // quyền (ROLE_USER, ROLE_ADMIN,...)
                            );

                        // Gắn thêm thông tin request vào token (IP, session,...)
                        authenticationToken.setDetails(new WebAuthenticationDetails(request));

                        // Đưa authentication vào SecurityContext => đánh dấu user đã đăng nhập
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                }
            }

            // Cho phép request đi tiếp qua filter tiếp theo
            filterChain.doFilter(request, response);

        } catch (Exception e) {
            // Nếu có lỗi (ví dụ token sai, hết hạn) => ném runtime exception
            throw new RuntimeException(e);
        }
    }
}
