package com.tieuluan.laptopstore.auth.config;

import com.tieuluan.laptopstore.auth.exceptions.RESTAuthenticationEntryPoint;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Đánh dấu đây là class cấu hình Spring
@Configuration
// Bật Spring Security
@EnableWebSecurity
public class WebSecurityConfig {

    // Service để load thông tin user từ DB (Spring cung cấp sẵn interface này)
    @Autowired
    private UserDetailsService userDetailsService;

    // Class helper tự viết để xử lý JWT
    @Autowired
    private JWTTokenHelper jwtTokenHelper;

    // Các API public không cần đăng nhập
    private static final String[] publicApis= {
            "/api/auth/**"
    };

    // Định nghĩa SecurityFilterChain (từ Spring Security 5.7+)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:3000")); 
                config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);
                return config;
            }))

            // Tắt CSRF vì bạn dùng JWT, không cần CSRF token
            .csrf(AbstractHttpConfigurer::disable)

            // Quy định quyền truy cập cho các request
            .authorizeHttpRequests((authorize)-> authorize
                // Cho phép truy cập Swagger + API auth mà không cần đăng nhập
                .requestMatchers("/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/**", "/api/auth/**").permitAll()
                // Cho phép tất cả GET request (ví dụ: xem sản phẩm, danh mục) mà không cần login
                .requestMatchers(HttpMethod.GET, "/**").permitAll()
                // Cho phép endpoint callback OAuth2
                .requestMatchers("/oauth2/success").permitAll()
                // Các request khác bắt buộc phải đăng nhập
                .anyRequest().authenticated())

            // Cấu hình OAuth2 login với Google
            .oauth2Login((oauth2login)-> oauth2login
                .defaultSuccessUrl("/oauth2/success")                // Khi login thành công → redirect về /oauth2/success
                .loginPage("/oauth2/authorization/google"))          // URL login với Google

            // Xử lý khi người dùng không có quyền hoặc chưa đăng nhập
            .exceptionHandling((exception)-> exception
                .authenticationEntryPoint(new RESTAuthenticationEntryPoint()))

            // Thêm filter JWT trước UsernamePasswordAuthenticationFilter
            .addFilterBefore(
                new JWTAuthenticationFilter(jwtTokenHelper,userDetailsService),
                UsernamePasswordAuthenticationFilter.class
            );

        // Trả về cấu hình đã build
        return http.build();
    }

    // Cho phép Spring Security bỏ qua một số request nhất định (public APIs)
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer(){
        return (web) -> web.ignoring().requestMatchers(publicApis);
    }

    // Cấu hình AuthenticationManager (xác thực username/password)
    @Bean
    public AuthenticationManager authenticationManager(){
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);   // Load user từ DB
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());       // Dùng PasswordEncoder để kiểm tra password

        return new ProviderManager(daoAuthenticationProvider);
    }

    // Cấu hình password encoder (mặc định dùng BCrypt)
    @Bean
    public PasswordEncoder passwordEncoder(){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
