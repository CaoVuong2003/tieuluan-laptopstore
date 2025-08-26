package com.tieuluan.laptopstore.auth.dto;

import lombok.Data;

@Data
public class VerifyOtpForgotPassword {
    private String email;
    private String otp;
}
