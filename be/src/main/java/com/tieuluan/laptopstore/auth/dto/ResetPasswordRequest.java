package com.tieuluan.laptopstore.auth.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String newPassword;
}