package com.carequeue.service;

import com.carequeue.dto.DoctorDTOs.*;
import com.carequeue.exception.DuplicateEmailException;
import com.carequeue.exception.ResourceNotFoundException;
import com.carequeue.model.DayAvailability;
import com.carequeue.model.Doctor;
import com.carequeue.model.Role;
import com.carequeue.model.User;
import com.carequeue.repository.DoctorRepository;
import com.carequeue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private static final Logger log = LoggerFactory.getLogger(DoctorService.class);

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<DoctorResponse> getAllActiveDoctors() {
        return doctorRepository.findByActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DoctorResponse> getAllDoctorsForAdmin() {
        return doctorRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DoctorResponse> getDoctorsBySpecialization(String specialization) {
        if (specialization == null || specialization.isBlank() || specialization.equalsIgnoreCase("all")) {
            return getAllActiveDoctors();
        }
        return doctorRepository.findBySpecializationIgnoreCaseAndActiveTrue(specialization).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DoctorResponse getDoctorById(String id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
        return mapToResponse(doctor);
    }

    public DoctorResponse getDoctorByUserId(String userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user ID: " + userId));
        return mapToResponse(doctor);
    }

    public DoctorResponse createDoctor(CreateDoctorRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("Email is already in use: " + email);
        }

        // 1. Create User with ROLE_DOCTOR
        User user = User.builder()
                .fullName(request.getFullName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.ROLE_DOCTOR)
                .enabled(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        User savedUser = userRepository.save(user);

        // 2. Default availability if empty
        List<DayAvailability> availability = request.getAvailability();
        if (availability == null || availability.isEmpty()) {
            availability = createDefaultAvailability();
        }

        // 3. Create Doctor Document
        Doctor doctor = Doctor.builder()
                .userId(savedUser.getId())
                .fullName(request.getFullName())
                .email(email)
                .phone(request.getPhone())
                .specialization(request.getSpecialization())
                .qualification(request.getQualification())
                .experience(request.getExperience() != null ? request.getExperience() : 5)
                .consultationFee(request.getConsultationFee() != null ? request.getConsultationFee() : 50.0)
                .profileImage(request.getProfileImage())
                .bio(request.getBio())
                .availability(availability)
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);
        log.info("Doctor profile created successfully for email: {}", email);

        return mapToResponse(savedDoctor);
    }

    public DoctorResponse updateDoctor(String id, UpdateDoctorRequest request) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        doctor.setFullName(request.getFullName());
        if (request.getPhone() != null) doctor.setPhone(request.getPhone());
        doctor.setSpecialization(request.getSpecialization());
        if (request.getQualification() != null) doctor.setQualification(request.getQualification());
        if (request.getExperience() != null) doctor.setExperience(request.getExperience());
        if (request.getConsultationFee() != null) doctor.setConsultationFee(request.getConsultationFee());
        if (request.getProfileImage() != null) doctor.setProfileImage(request.getProfileImage());
        if (request.getBio() != null) doctor.setBio(request.getBio());
        if (request.getActive() != null) doctor.setActive(request.getActive());
        doctor.setUpdatedAt(Instant.now());

        // Also update associated user full name
        userRepository.findById(doctor.getUserId()).ifPresent(user -> {
            user.setFullName(request.getFullName());
            if (request.getPhone() != null) user.setPhone(request.getPhone());
            user.setUpdatedAt(Instant.now());
            userRepository.save(user);
        });

        Doctor updated = doctorRepository.save(doctor);
        return mapToResponse(updated);
    }

    public DoctorResponse updateDoctorAvailability(String doctorId, UpdateAvailabilityRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));

        doctor.setAvailability(request.getAvailability());
        doctor.setUpdatedAt(Instant.now());
        Doctor updated = doctorRepository.save(doctor);

        log.info("Availability updated for doctor ID: {}", doctorId);
        return mapToResponse(updated);
    }

    public void deleteDoctor(String id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));

        // Delete user and doctor profile
        userRepository.deleteById(doctor.getUserId());
        doctorRepository.deleteById(id);
        log.info("Doctor deleted with ID: {}", id);
    }

    public List<DayAvailability> createDefaultAvailability() {
        List<DayAvailability> slots = new ArrayList<>();
        String[] days = {"MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"};
        for (String day : days) {
            slots.add(DayAvailability.builder()
                    .dayOfWeek(day)
                    .startTime("09:00")
                    .endTime("13:00")
                    .slotDurationMinutes(30)
                    .available(true)
                    .build());
        }
        return slots;
    }

    public List<String> getAvailableTimeSlots(String doctorId, String dayOfWeek) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));

        return doctor.getAvailability().stream()
                .filter(a -> a.getDayOfWeek().equalsIgnoreCase(dayOfWeek) && a.isAvailable())
                .findFirst()
                .map(this::generateSlots)
                .orElse(List.of());
    }

    private List<String> generateSlots(DayAvailability avail) {
        List<String> slots = new ArrayList<>();
        try {
            String[] startParts = avail.getStartTime().split(":");
            String[] endParts = avail.getEndTime().split(":");

            int startMin = Integer.parseInt(startParts[0]) * 60 + Integer.parseInt(startParts[1]);
            int endMin = Integer.parseInt(endParts[0]) * 60 + Integer.parseInt(endParts[1]);
            int duration = avail.getSlotDurationMinutes() > 0 ? avail.getSlotDurationMinutes() : 30;

            for (int current = startMin; current + duration <= endMin; current += duration) {
                int hour = current / 60;
                int min = current % 60;
                slots.add(String.format("%02d:%02d", hour, min));
            }
        } catch (Exception e) {
            log.error("Error generating slots for doctor", e);
        }
        return slots;
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return DoctorResponse.builder()
                .id(doctor.getId())
                .userId(doctor.getUserId())
                .fullName(doctor.getFullName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experience(doctor.getExperience())
                .consultationFee(doctor.getConsultationFee())
                .profileImage(doctor.getProfileImage())
                .bio(doctor.getBio())
                .availability(doctor.getAvailability())
                .active(doctor.isActive())
                .build();
    }
}
