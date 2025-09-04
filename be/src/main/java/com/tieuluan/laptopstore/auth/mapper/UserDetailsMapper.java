package com.tieuluan.laptopstore.auth.mapper;

import org.springframework.stereotype.Component;

import com.tieuluan.laptopstore.auth.dto.User.UserDetailsDto;
import com.tieuluan.laptopstore.auth.entities.User;

/**
 * UserDetailsMapper:
 *  - Chuyển đổi từ entity User sang DTO UserDetailsDto.
 *  - Nếu User null → trả về null.
 *  - Ánh xạ đầy đủ các trường: id, firstName, lastName, email, phoneNumber, avatarUrl.
 *  - Lấy danh sách addressList trực tiếp từ user.
 *  - Chuyển authorities sang mảng để đưa vào authorityList.
 *  - Gán trạng thái enabled từ user.
 */
@Component
public class UserDetailsMapper {

    public UserDetailsDto toUserDetailsDto(User user) {
        if (user == null) {
            return null;
        }
        return UserDetailsDto.builder()
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
    }
}
