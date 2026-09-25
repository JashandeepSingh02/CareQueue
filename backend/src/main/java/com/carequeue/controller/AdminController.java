package com.carequeue.controller;

import com.carequeue.dto.ApiResponse;
import com.carequeue.dto.AppointmentDTOs.AppointmentResponse;
import com.carequeue.dto.AppointmentDTOs.SystemStatsResponse;
import com.carequeue.dto.DoctorDTOs.DoctorResponse;
import com.carequeue.dto.UserDTOs.UserProfileResponse;
import com.carequeue.service.AdminService;
import com.carequeue.service.AppointmentService;
import com.carequeue.service.DoctorService;
import com.carequeue.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin Operations APIs", description = "Endpoints restricted to System Administrators for platform management")
public class AdminController {

    private final AdminService adminService;
    private final UserService userService;
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    @GetMapping("/statistics")
    @Operation(summary = "Get system-wide metrics & statistics")
    public ResponseEntity<ApiResponse<SystemStatsResponse>> getSystemStats() {
        SystemStatsResponse stats = adminService.getSystemStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get list of all users")
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete user by ID")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/doctors")
    @Operation(summary = "Get list of all doctors (including inactive)")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getAllDoctors() {
        List<DoctorResponse> doctors = doctorService.getAllDoctorsForAdmin();
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @GetMapping("/appointments")
    @Operation(summary = "Get all appointments in the system")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAllAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getAllAppointmentsForAdmin();
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }
}
