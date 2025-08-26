package com.tieuluan.laptopstore.auth.services;

import com.tieuluan.laptopstore.auth.entities.User;
import com.tieuluan.laptopstore.auth.repositories.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

/**
 * OAuth2Service chịu trách nhiệm xử lý logic liên quan đến OAuth2 user.
 * 
 * - getUser(String userName): Lấy thông tin user từ DB dựa trên email.
 * - createUser(OAuth2User oAuth2User, String provider): Tạo user mới từ thông tin 
 *   được cung cấp bởi OAuth2 (Google, Facebook,...), gồm firstName, lastName, email,
 *   provider và gán mặc định quyền USER.
 */
@Service
public class OAuth2Service {

    @Autowired
    UserDetailRepository userDetailRepository;

    @Autowired
    private AuthorityService authorityService;

    public User getUser(String userName) {
        return userDetailRepository.findByEmail(userName);
    }

    public User createUser(OAuth2User oAuth2User, String provider) {
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");
        String email = oAuth2User.getAttribute("email");

        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .provider(provider)
                .enabled(true)
                .authorities(authorityService.getUserAuthority()) // Gán quyền mặc định
                .build();

        return userDetailRepository.save(user);
    }
}
