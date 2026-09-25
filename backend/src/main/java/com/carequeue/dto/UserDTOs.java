package com.carequeue.dto;

import com.carequeue.model.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

public class UserDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserProfileResponse {
        private String id;
        private String fullName;
        private String email;
        private String phone;
        private Role role;
        private String gender;
        private String dateOfBirth;
        private boolean enabled;
        private Instant createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateProfileRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;
        private String phone;
        private String gender;
        private String dateOfBirth;
    }
}
