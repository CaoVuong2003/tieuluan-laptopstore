package com.tieuluan.laptopstore.auth.services;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private final RedisTemplate<String, String> redisTemplate;

    public OtpService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Sinh OTP ngẫu nhiên 6 chữ số
    public String generateOtp() {
        int code = 100000 + new Random().nextInt(900000);
        return String.valueOf(code);
    }

    // Lưu OTP + userJson vào Redis
    // public void saveOtpAndUser(String email, String otp, String userJson, long ttlMinutes) {
    //     String data = otp + "|" + userJson; 
    //     redisTemplate.opsForValue().set("REG:" + email, data, ttlMinutes, TimeUnit.MINUTES);
    // }

    public void saveOtpAndUser(String email, String otp, String userJson, long ttlMinutes) {
        String key = "REG:" + email;
        String value = otp + "|" + userJson; // format: "123456|{userJson}"
        try {
            redisTemplate.opsForValue().set(key, value, ttlMinutes, TimeUnit.MINUTES);

            // Kiểm tra ngay
            String stored = redisTemplate.opsForValue().get(key);
            Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
            if (stored != null) {
                System.out.println("✅ OTP and user saved successfully for " + email);
                System.out.println("TTL for " + key + " = " + ttl + " seconds");
            } else {
                System.err.println("❌ Failed to save OTP for " + email + " - Redis returned null when reading back");
            }
        } catch (Exception e) {
            System.err.println("❌ Exception while saving OTP for " + email);
            e.printStackTrace();
        }
    }

    // Lấy OTP từ Redis
    public String getOtp(String email) {
        String data = redisTemplate.opsForValue().get("REG:" + email);
        System.out.println("Reading key: REG:" + email);
        return (data != null) ? data.split("\\|", 2)[0] : null;
    }

    // Lấy thông tin user tạm từ Redis
    public String getTempUser(String email) {
        String data = redisTemplate.opsForValue().get("REG:" + email);
        System.out.println("Reading key: REG:" + email);
        return (data != null) ? data.split("\\|", 2)[1] : null;
    }

    // Xóa OTP + user tạm
    public void deleteOtpAndUser(String email) {
        redisTemplate.delete("REG:" + email);
    }
}
