package com.carequeue;

import com.carequeue.dto.AuthDTOs.*;
import com.carequeue.exception.DuplicateEmailException;
import com.carequeue.model.Role;
import com.carequeue.model.User;
import com.carequeue.repository.PasswordResetTokenRepository;
import com.carequeue.repository.UserRepository;
import com.carequeue.security.JwtTokenProvider;
import com.carequeue.service.AuthService;
import com.carequeue.service.MailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository resetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private MailService mailService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest("Test Patient", "test@patient.com", "Password123", "+15550199", "Male", "1995-01-01");
        loginRequest = new LoginRequest("test@patient.com", "Password123");
    }

    @Test
    void registerPatient_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        
        User mockSavedUser = User.builder()
                .id("user123")
                .fullName("Test Patient")
                .email("test@patient.com")
                .role(Role.ROLE_PATIENT)
                .build();
                
        when(userRepository.save(any(User.class))).thenReturn(mockSavedUser);
        when(tokenProvider.generateTokenForUser(anyString(), anyString(), anyString(), anyString())).thenReturn("mock_jwt_token");

        JwtAuthResponse response = authService.registerPatient(registerRequest);

        assertNotNull(response);
        assertEquals("mock_jwt_token", response.getToken());
        assertEquals("test@patient.com", response.getEmail());
        assertEquals("ROLE_PATIENT", response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerPatient_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> authService.registerPatient(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }
}
