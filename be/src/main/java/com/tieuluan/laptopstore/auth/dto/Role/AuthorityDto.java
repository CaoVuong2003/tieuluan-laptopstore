package com.tieuluan.laptopstore.auth.dto.Role;

import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorityDto {
    private UUID id;
    private String roleCode;
    private String roleDescription;
}
