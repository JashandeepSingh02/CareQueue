package com.carequeue.service;

import com.carequeue.dto.AuthDTOs.*;
import com.carequeue.exception.DuplicateEmailException;
import com.carequeue.exception.InvalidTokenException;
import com.carequeue.exception.ResourceNotFoundException;
import com.carequeue.model.PasswordResetToken;
import com.carequeue.model.Role;
import com.carequeue.model.User;
import com.carequeue.repository.PasswordResetTokenRepository;
import com.carequeue.repository.UserRepository;
import com.carequeue.security.JwtTokenProvider;
import com.carequeue.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final MailService mailService;

    public JwtAuthResponse registerPatient(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new DuplicateEmailException("Email address is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .role(Role.ROLE_PATIENT)
                .enabled(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        User savedUser = userRepository.save(user);
        log.info("Patient registered successfully: {}", savedUser.getEmail());

        String token = tokenProvider.generateTokenForUser(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getFullName()
        );

        return JwtAuthResponse.builder()
                .token(token)
                .userId(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .build();
    }

    public JwtAuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(authentication);

        log.info("User logged in successfully: {}", userPrincipal.getEmail());

        return JwtAuthResponse.builder()
                .token(token)
                .userId(userPrincipal.getId())
                .fullName(userPrincipal.getFullName())
                .email(userPrincipal.getEmail())
                .role(userPrincipal.getRole().name())
                .build();
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        // Do not expose user enumeration, always complete gracefully
        userRepository.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            Instant expiryDate = Instant.now().plus(30, ChronoUnit.MINUTES);

            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .userId(user.getId())
                    .token(token)
                    .expiryDate(expiryDate)
                    .used(false)
                    .createdAt(Instant.now())
                    .build();

            resetTokenRepository.save(resetToken);
            mailService.sendPasswordResetEmail(user.getEmail(), token);
        });
    }

    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid or non-existent password reset token"));

        if (resetToken.isUsed()) {
            throw new InvalidTokenException("Password reset token has already been used");
        }

        if (resetToken.getExpiryDate().isBefore(Instant.now())) {
            throw new InvalidTokenException("Password reset token has expired");
        }

        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User associated with token not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);

        log.info("Password reset successful for user: {}", user.getEmail());
    }
}
