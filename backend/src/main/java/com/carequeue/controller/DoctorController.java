package com.carequeue.controller;

import com.carequeue.dto.ApiResponse;
import com.carequeue.dto.DoctorDTOs.*;
import com.carequeue.security.UserPrincipal;
import com.carequeue.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@Tag(name = "Doctor APIs", description = "Endpoints for searching doctors, viewing availability, and managing doctor profiles")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    @Operation(summary = "Get list of active doctors, option to filter by specialization")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getDoctors(
            @RequestParam(required = false) String specialization) {
        List<DoctorResponse> doctors = doctorService.getDoctorsBySpecialization(specialization);
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get doctor details by ID")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorById(@PathVariable String id) {
        DoctorResponse doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success(doctor));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_DOCTOR')")
    @Operation(summary = "Get current logged-in doctor profile")
    public ResponseEntity<ApiResponse<DoctorResponse>> getCurrentDoctor(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        DoctorResponse doctor = doctorService.getDoctorByUserId(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(doctor));
    }

    @GetMapping("/{id}/availability")
    @Operation(summary = "Get available time slots for doctor on a given day of week")
    public ResponseEntity<ApiResponse<List<String>>> getDoctorSlots(
            @PathVariable String id,
            @RequestParam String dayOfWeek) {
        List<String> slots = doctorService.getAvailableTimeSlots(id, dayOfWeek.toUpperCase());
        return ResponseEntity.ok(ApiResponse.success(slots));
    }

    @PutMapping("/{id}/availability")
    @PreAuthorize("hasAnyAuthority('ROLE_DOCTOR', 'ROLE_ADMIN')")
    @Operation(summary = "Update doctor availability schedule")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateAvailability(
            @PathVariable String id,
            @Valid @RequestBody UpdateAvailabilityRequest request) {
        DoctorResponse updated = doctorService.updateDoctorAvailability(id, request);
        return ResponseEntity.ok(ApiResponse.success("Availability schedule updated successfully", updated));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Add a new doctor")
    public ResponseEntity<ApiResponse<DoctorResponse>> createDoctor(@Valid @RequestBody CreateDoctorRequest request) {
        DoctorResponse doctor = doctorService.createDoctor(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Doctor added successfully", doctor));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_DOCTOR', 'ROLE_ADMIN')")
    @Operation(summary = "Update doctor details")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateDoctor(
            @PathVariable String id,
            @Valid @RequestBody UpdateDoctorRequest request) {
        DoctorResponse updated = doctorService.updateDoctor(id, request);
        return ResponseEntity.ok(ApiResponse.success("Doctor details updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Admin: Delete doctor")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor removed successfully", null));
    }
}
