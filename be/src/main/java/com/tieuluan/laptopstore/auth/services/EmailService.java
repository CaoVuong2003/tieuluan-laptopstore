package com.tieuluan.laptopstore.auth.services;

import com.tieuluan.laptopstore.auth.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage; 
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // Tự động inject JavaMailSender để gửi mail
    @Autowired
    private JavaMailSender javaMailSender;

    // Lấy email người gửi từ application.properties (spring.mail.username)
    @Value("${spring.mail.username}")
    private String sender;

    public String sendMail(User user, String otp){
        // Chủ đề email
        String subject = "Verify your email";
        // Tên hiển thị của hệ thống gửi mail
        String senderName = "LaptopStore";

        // Nội dung email
        String mailContent = "Hello " + user.getUsername() + ",\n";

        mailContent += "Your OTP code is: " + otp + "\n";
        mailContent += "This code will expire in 5 minutes.\n";
        mailContent += senderName;

        return sendEmail(user.getEmail(), subject, mailContent);
    }

    // Gửi email cơ bản (dùng cho forgot-password, thông báo khác…)
    public String sendEmail(String to, String subject, String body){
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(sender);
            mailMessage.setTo(to);
            mailMessage.setSubject(subject);
            mailMessage.setText(body);

            javaMailSender.send(mailMessage);
        }
        catch (Exception e) {
            e.printStackTrace();
            return "Error while Sending Mail: " + e.getMessage();
        }
        return "Email sent";
    }
}
