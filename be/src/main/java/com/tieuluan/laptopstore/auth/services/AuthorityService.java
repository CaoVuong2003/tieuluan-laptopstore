package com.tieuluan.laptopstore.auth.services;

import com.tieuluan.laptopstore.auth.entities.Authority;
import com.tieuluan.laptopstore.auth.repositories.AuthorityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AuthorityService {

    @Autowired
    private AuthorityRepository authorityRepository;

    /**
     * Lấy quyền mặc định của user (USER).
     * Trả về danh sách chỉ chứa 1 quyền USER.
     */
    public List<Authority> getUserAuthority() {
        List<Authority> authorities = new ArrayList<>();
        // Tìm quyền có roleCode = "USER"
        Authority authority = authorityRepository.findByRoleCode("USER");

        if (authority == null) {
            throw new RuntimeException("Default role USER not found in DB");
        }

        // Thêm quyền này vào danh sách
        authorities.add(authority);
        return authorities;
    }

    /**
     * Tạo mới một quyền (authority) với role và description truyền vào.
     * @param role mã quyền (vd: USER, ADMIN)
     * @param description mô tả quyền
     * @return quyền đã được lưu vào DB
     */
    public Authority createAuthority(String role, String description) {
        // Tạo object Authority bằng builder
        Authority authority = Authority.builder()
                .roleCode(role)
                .roleDescription(description)
                .build();
        // Lưu vào DB
        return authorityRepository.save(authority);
    }

    /**
     * Lấy toàn bộ danh sách quyền trong DB.
     * @return List<Authority>
     */
    public List<Authority> getAllAuthorities() {
        return authorityRepository.findAll();
    }

    /**
     * Lấy thông tin quyền theo id.
     * Nếu không tìm thấy sẽ ném RuntimeException.
     * @param id UUID của quyền
     */
    public Authority getAuthorityById(UUID id) {
        return authorityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }

    /**
     * Cập nhật thông tin của một quyền theo id.
     * @param id UUID của quyền
     * @param roleCode mã quyền mới
     * @param roleDescription mô tả quyền mới
     */
    public Authority updateAuthority(UUID id, String roleCode, String roleDescription) {
        // Lấy quyền hiện tại
        Authority existing = getAuthorityById(id);
        // Cập nhật roleCode và roleDescription
        existing.setRoleCode(roleCode);
        existing.setRoleDescription(roleDescription);
        // Lưu lại vào DB
        return authorityRepository.save(existing);
    }

    /**
     * Xoá quyền theo id.
     * @param id UUID của quyền
     */
    public void deleteAuthority(UUID id) {
        authorityRepository.deleteById(id);
    }
}
