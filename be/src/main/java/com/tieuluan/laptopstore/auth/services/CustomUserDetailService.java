package com.tieuluan.laptopstore.auth.services;

import com.tieuluan.laptopstore.auth.dto.User.UserDetailsDto;
import com.tieuluan.laptopstore.auth.entities.User;
import com.tieuluan.laptopstore.auth.mapper.UserDetailsMapper;
import com.tieuluan.laptopstore.auth.repositories.UserDetailRepository;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * CustomUserDetailService:
 * - Là service triển khai UserDetailsService để Spring Security có thể load thông tin user khi đăng nhập.
 * - loadUserByUsername(): Lấy user từ DB theo email, nếu không có thì ném ra UsernameNotFoundException.
 * - save(): Lưu user mới vào DB.
 * - restoreUser(): Khôi phục user theo id (set enabled = true) rồi trả về UserDetailsDto sau khi mapping.
 * - Sử dụng UserDetailRepository để truy vấn DB và UserDetailsMapper để chuyển entity sang DTO.
 */

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserDetailsMapper userMapper;

    @Autowired
    private UserDetailRepository userDetailRepository;

    CustomUserDetailService(UserDetailsMapper userDetailsMapper) {
        this.userMapper = userDetailsMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userDetailRepository.findByEmail(username);
        if (null == user) {
            throw new UsernameNotFoundException("User Not Found with userName " + username);
        }
        return user;
    }

    public User save(User user) {
        return userDetailRepository.save(user);
    }

    public UserDetailsDto restoreUser(UUID id) {
        User user = userDetailRepository.findById(id)
                .orElse(null);
        if (user == null) {
            return null;
        }
        user.setEnabled(true);
        user = userDetailRepository.save(user);
        return userMapper.toUserDetailsDto(user);
    }
}
