package com.carequeue.dto;

import com.carequeue.model.AppointmentStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public class AppointmentDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentResponse {
        private String id;
        private String patientId;
        private String patientName;
        private String patientEmail;
        private String patientPhone;
        private String doctorId;
        private String doctorName;
        private String specialization;
        private LocalDate appointmentDate;
        private String appointmentTime;
        private int queueNumber;
        private AppointmentStatus status;
        private String reason;
        private String notes;
        private Instant createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookAppointmentRequest {
        @NotBlank(message = "Doctor ID is required")
        private String doctorId;

        @NotNull(message = "Appointment date is required")
        @FutureOrPresent(message = "Appointment date must be today or in the future")
        private LocalDate appointmentDate;

        @NotBlank(message = "Appointment time is required")
        private String appointmentTime;

        private String reason;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStatusRequest {
        @NotNull(message = "Status is required")
        private AppointmentStatus status;

        private String notes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QueueStatusResponse {
        private String doctorId;
        private String doctorName;
        private String specialization;
        private LocalDate date;
        private Integer currentQueueNumber;
        private String currentPatientName;
        private Integer nextQueueNumber;
        private String nextPatientName;
        private int totalWaiting;
        private int totalCompleted;
        private List<AppointmentResponse> appointments;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SystemStatsResponse {
        private long totalUsers;
        private long totalPatients;
        private long totalDoctors;
        private long activeDoctors;
        private long totalAppointments;
        private long pendingAppointments;
        private long acceptedAppointments;
        private long completedAppointments;
        private long cancelledAppointments;
        private long todayAppointments;
    }
}
