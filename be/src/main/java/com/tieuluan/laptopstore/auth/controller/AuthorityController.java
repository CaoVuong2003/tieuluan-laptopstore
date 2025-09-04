package com.tieuluan.laptopstore.auth.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tieuluan.laptopstore.auth.dto.Role.AuthorityDto;
import com.tieuluan.laptopstore.auth.dto.Role.AuthorityRequestDto;
import com.tieuluan.laptopstore.auth.entities.Authority;
import com.tieuluan.laptopstore.auth.services.AuthorityService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

// Đánh dấu đây là một REST API controller (các method sẽ trả về JSON thay vì view)
@RestController

// Mapping URL gốc cho controller này là /api/roles
@RequestMapping("/api/roles")

// Cho phép request từ domain khác (CORS), dùng khi FE và BE chạy khác cổng/host
@CrossOrigin

// Lombok annotation: tự động tạo logger (log.info, log.error,…) để log thông tin
@Slf4j
public class AuthorityController {

    // Inject service xử lý logic liên quan đến Authority (role)
    @Autowired
    private AuthorityService authorityService;

    // Lấy danh sách tất cả authority (GET /api/roles)
    @GetMapping
    public List<AuthorityDto> getAll() {
        return authorityService.getAllAuthorities().stream() // gọi service để lấy danh sách
                .map(this::toDto) // convert từ entity -> dto
                .collect(Collectors.toList()); // gom lại thành List
    }

    // Lấy thông tin authority theo id (GET /api/roles/{id})
    @GetMapping("/{id}")
    public AuthorityDto getById(@PathVariable UUID id) {
        // gọi service lấy authority theo id, rồi convert sang dto
        return toDto(authorityService.getAuthorityById(id));
    }

    // Tạo mới authority (POST /api/roles)
    @PostMapping
    public AuthorityDto create(@Valid @RequestBody AuthorityRequestDto dto) {
        // Ghi log thông tin DTO nhận được
        log.info("==> Entering create method with DTO: {}", dto);

        // In ra console (thường để debug)
        System.out.println("==> Received: " + dto);

        // Gọi service để tạo mới authority (truyền roleCode & roleDescription)
        Authority saved = authorityService.createAuthority(dto.getRoleCode(), dto.getRoleDescription());

        // Ghi log thông tin authority vừa lưu
        log.info("==> Saved authority: {}", saved);

        // Trả về DTO cho FE
        return toDto(saved);
    }

    // Cập nhật authority theo id (PUT /api/roles/{id})
    @PutMapping("/{id}")
    public AuthorityDto update(@PathVariable UUID id, @RequestBody AuthorityRequestDto dto) {
        // Gọi service để cập nhật authority
        Authority updated = authorityService.updateAuthority(id, dto.getRoleCode(), dto.getRoleDescription());
        return toDto(updated); // Trả về DTO
    }

    // Xóa authority theo id (DELETE /api/roles/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        authorityService.deleteAuthority(id); // Gọi service để xóa
        return ResponseEntity.ok().build(); // Trả về status 200 OK mà không có body
    }

    // Hàm tiện ích: chuyển đổi từ Entity -> DTO để trả ra ngoài
    private AuthorityDto toDto(Authority authority) {
        return AuthorityDto.builder()
                .id(authority.getId())
                .roleCode(authority.getRoleCode())
                .roleDescription(authority.getRoleDescription())
                .build();
    }
}
