package com.carequeue.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;

    @Value("${carequeue.cors.allowed-origins:http://localhost:5173}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String baseUrl = frontendUrl.split(",")[0];
        String resetUrl = baseUrl + "/reset-password?token=" + resetToken;
        
        log.info("=================================================");
        log.info("PASSWORD RESET LINK GENERATED FOR: {}", toEmail);
        log.info("RESET TOKEN: {}", resetToken);
        log.info("RESET URL: {}", resetUrl);
        log.info("=================================================");

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@carequeue.com");
            message.setTo(toEmail);
            message.setSubject("CareQueue — Password Reset Request");
            message.setText("Hello,\n\nYou requested a password reset for your CareQueue account.\n\n" +
                    "Please click the link below to reset your password:\n" + resetUrl + "\n\n" +
                    "If you did not request this, please ignore this email.\n\n" +
                    "Best regards,\nCareQueue Team");

            mailSender.send(message);
            log.info("Password reset email sent successfully to {}", toEmail);
        } catch (Exception e) {
            log.warn("Could not send mail via SMTP (dev environment mode active). Reset link logged above: {}", e.getMessage());
        }
    }
}
