package com.carequeue.dto;

import com.carequeue.model.DayAvailability;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class DoctorDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoctorResponse {
        private String id;
        private String userId;
        private String fullName;
        private String email;
        private String phone;
        private String specialization;
        private String qualification;
        private Integer experience;
        private Double consultationFee;
        private String profileImage;
        private String bio;
        private List<DayAvailability> availability;
        private boolean active;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateDoctorRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;

        private String phone;

        @NotBlank(message = "Specialization is required")
        private String specialization;

        private String qualification;

        @Min(value = 0, message = "Experience cannot be negative")
        private Integer experience;

        @NotNull(message = "Consultation fee is required")
        @Min(value = 0, message = "Fee cannot be negative")
        private Double consultationFee;

        private String profileImage;
        private String bio;
        private List<DayAvailability> availability;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateDoctorRequest {
        @NotBlank(message = "Full name is required")
        private String fullName;

        private String phone;

        @NotBlank(message = "Specialization is required")
        private String specialization;

        private String qualification;
        private Integer experience;
        private Double consultationFee;
        private String profileImage;
        private String bio;
        private Boolean active;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateAvailabilityRequest {
        @NotNull(message = "Availability list cannot be null")
        private List<DayAvailability> availability;
    }
}
