package com.carequeue.controller;

import com.carequeue.dto.ApiResponse;
import com.carequeue.dto.AppointmentDTOs.*;
import com.carequeue.security.UserPrincipal;
import com.carequeue.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Tag(name = "Appointment & Queue APIs", description = "Endpoints for booking, managing, and tracking appointments and clinic queues")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    @Operation(summary = "Book appointment and receive automatically generated queue number")
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody BookAppointmentRequest request) {
        AppointmentResponse response = appointmentService.bookAppointment(request, userPrincipal.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Appointment booked successfully. Queue number assigned.", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    @Operation(summary = "Get current patient's appointments")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getMyPatientAppointments(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<AppointmentResponse> appointments = appointmentService.getPatientAppointments(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/doctor/my")
    @PreAuthorize("hasAuthority('ROLE_DOCTOR')")
    @Operation(summary = "Get logged-in doctor's appointments")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getMyDoctorAppointments(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<AppointmentResponse> appointments = appointmentService.getDoctorAppointments(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/doctor/{doctorId}/queue")
    @Operation(summary = "Get current real-time queue status for a doctor on a given date")
    public ResponseEntity<ApiResponse<QueueStatusResponse>> getDoctorQueue(
            @PathVariable String doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        QueueStatusResponse queue = appointmentService.getDoctorQueueForDate(doctorId, date);
        return ResponseEntity.ok(ApiResponse.success(queue));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update appointment status (ACCEPT, REJECT, COMPLETE, CANCEL)")
    public ResponseEntity<ApiResponse<AppointmentResponse>> updateStatus(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateStatusRequest request) {
        AppointmentResponse updated = appointmentService.updateAppointmentStatus(
                id, request, userPrincipal.getId(), userPrincipal.getRole().name());
        return ResponseEntity.ok(ApiResponse.success("Appointment status updated to " + request.getStatus(), updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel appointment")
    public ResponseEntity<ApiResponse<AppointmentResponse>> cancelAppointment(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UpdateStatusRequest req = new UpdateStatusRequest(com.carequeue.model.AppointmentStatus.CANCELLED, "Cancelled by user");
        AppointmentResponse cancelled = appointmentService.updateAppointmentStatus(
                id, req, userPrincipal.getId(), userPrincipal.getRole().name());
        return ResponseEntity.ok(ApiResponse.success("Appointment cancelled successfully", cancelled));
    }
}
