package com.carequeue.service;

import com.carequeue.dto.AppointmentDTOs.*;
import com.carequeue.exception.InvalidAppointmentException;
import com.carequeue.exception.ResourceNotFoundException;
import com.carequeue.exception.UnauthorizedException;
import com.carequeue.model.*;
import com.carequeue.repository.AppointmentRepository;
import com.carequeue.repository.DoctorRepository;
import com.carequeue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public AppointmentResponse bookAppointment(BookAppointmentRequest request, String patientUserId) {
        // 1. Fetch patient details
        User patient = userRepository.findById(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient user not found with ID: " + patientUserId));

        // 2. Fetch doctor details
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + request.getDoctorId()));

        if (!doctor.isActive()) {
            throw new InvalidAppointmentException("This doctor is currently inactive and not accepting appointments.");
        }

        LocalDate appointmentDate = request.getAppointmentDate();
        if (appointmentDate.isBefore(LocalDate.now())) {
            throw new InvalidAppointmentException("Appointment date cannot be in the past.");
        }

        String dayOfWeek = appointmentDate.getDayOfWeek().name();

        // 3. Validate Doctor Day Availability
        DayAvailability dayAvail = doctor.getAvailability().stream()
                .filter(a -> a.getDayOfWeek().equalsIgnoreCase(dayOfWeek) && a.isAvailable())
                .findFirst()
                .orElseThrow(() -> new InvalidAppointmentException(
                        "Doctor " + doctor.getFullName() + " is not available on " + dayOfWeek + "s."));

        // 4. Validate time slot format and bounds
        validateTimeSlot(request.getAppointmentTime(), dayAvail);

        // 5. Check if slot already booked for this doctor
        List<AppointmentStatus> activeStatuses = List.of(AppointmentStatus.PENDING, AppointmentStatus.ACCEPTED);
        boolean slotBooked = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusIn(
                doctor.getId(), appointmentDate, request.getAppointmentTime(), activeStatuses);
        if (slotBooked) {
            throw new InvalidAppointmentException("The selected time slot (" + request.getAppointmentTime() + ") is already booked.");
        }

        // 6. Check if patient already has an active appointment with doctor on same date
        boolean patientAlreadyBooked = appointmentRepository.existsByPatientIdAndDoctorIdAndAppointmentDateAndStatusIn(
                patient.getId(), doctor.getId(), appointmentDate, activeStatuses);
        if (patientAlreadyBooked) {
            throw new InvalidAppointmentException("You already have an active appointment scheduled with Dr. "
                    + doctor.getFullName() + " on " + appointmentDate + ".");
        }

        // 7. Calculate Backend Queue Number for Doctor & Date
        List<Appointment> existingApps = appointmentRepository
                .findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(doctor.getId(), appointmentDate);

        int nextQueueNumber = existingApps.stream()
                .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED && a.getStatus() != AppointmentStatus.REJECTED)
                .mapToInt(Appointment::getQueueNumber)
                .max()
                .orElse(0) + 1;

        // 8. Create & Save Appointment
        Appointment appointment = Appointment.builder()
                .patientId(patient.getId())
                .patientName(patient.getFullName())
                .patientEmail(patient.getEmail())
                .patientPhone(patient.getPhone())
                .doctorId(doctor.getId())
                .doctorName(doctor.getFullName())
                .specialization(doctor.getSpecialization())
                .appointmentDate(appointmentDate)
                .appointmentTime(request.getAppointmentTime())
                .queueNumber(nextQueueNumber)
                .status(AppointmentStatus.PENDING)
                .reason(request.getReason())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        log.info("Appointment booked successfully. ID: {}, Queue #: {}", saved.getId(), nextQueueNumber);

        return mapToResponse(saved);
    }

    public List<AppointmentResponse> getPatientAppointments(String patientUserId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDescAppointmentTimeAsc(patientUserId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getDoctorAppointments(String doctorUserId) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user ID: " + doctorUserId));

        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeAsc(doctor.getId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public QueueStatusResponse getDoctorQueueForDate(String doctorId, LocalDate targetDate) {
        LocalDate date = (targetDate != null) ? targetDate : LocalDate.now();

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));

        List<Appointment> dayAppointments = appointmentRepository
                .findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(doctor.getId(), date);

        List<Appointment> activeList = dayAppointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.ACCEPTED || a.getStatus() == AppointmentStatus.PENDING)
                .collect(Collectors.toList());

        Appointment current = activeList.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.ACCEPTED)
                .findFirst()
                .orElse(activeList.isEmpty() ? null : activeList.get(0));

        Appointment next = null;
        if (current != null) {
            int currentIndex = activeList.indexOf(current);
            if (currentIndex + 1 < activeList.size()) {
                next = activeList.get(currentIndex + 1);
            }
        }

        long totalCompleted = dayAppointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED)
                .count();

        int totalWaiting = activeList.size() - (current != null ? 1 : 0);

        List<AppointmentResponse> mappedList = dayAppointments.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return QueueStatusResponse.builder()
                .doctorId(doctor.getId())
                .doctorName(doctor.getFullName())
                .specialization(doctor.getSpecialization())
                .date(date)
                .currentQueueNumber(current != null ? current.getQueueNumber() : null)
                .currentPatientName(current != null ? current.getPatientName() : "None")
                .nextQueueNumber(next != null ? next.getQueueNumber() : null)
                .nextPatientName(next != null ? next.getPatientName() : "None")
                .totalWaiting(totalWaiting)
                .totalCompleted((int) totalCompleted)
                .appointments(mappedList)
                .build();
    }

    public AppointmentResponse updateAppointmentStatus(String appointmentId, UpdateStatusRequest request,
                                                       String actingUserId, String actingRole) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));

        // Security Authorization Check
        if (actingRole.equals(Role.ROLE_DOCTOR.name())) {
            Doctor doctor = doctorRepository.findByUserId(actingUserId)
                    .orElseThrow(() -> new UnauthorizedException("User is not registered as a doctor"));
            if (!doctor.getId().equals(appointment.getDoctorId())) {
                throw new UnauthorizedException("Doctors can only update status for their own appointments.");
            }
        } else if (actingRole.equals(Role.ROLE_PATIENT.name())) {
            if (!actingUserId.equals(appointment.getPatientId())) {
                throw new UnauthorizedException("Patients can only manage their own appointments.");
            }
            if (request.getStatus() != AppointmentStatus.CANCELLED) {
                throw new InvalidAppointmentException("Patients are only permitted to CANCEL appointments.");
            }
        }

        appointment.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            appointment.setNotes(request.getNotes());
        }
        appointment.setUpdatedAt(Instant.now());

        Appointment updated = appointmentRepository.save(appointment);
        log.info("Appointment ID {} status updated to {}", appointmentId, request.getStatus());
        return mapToResponse(updated);
    }

    public List<AppointmentResponse> getAllAppointmentsForAdmin() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private void validateTimeSlot(String timeSlot, DayAvailability dayAvail) {
        try {
            String[] timeParts = timeSlot.split(":");
            int slotMin = Integer.parseInt(timeParts[0]) * 60 + Integer.parseInt(timeParts[1]);

            String[] startParts = dayAvail.getStartTime().split(":");
            int startMin = Integer.parseInt(startParts[0]) * 60 + Integer.parseInt(startParts[1]);

            String[] endParts = dayAvail.getEndTime().split(":");
            int endMin = Integer.parseInt(endParts[0]) * 60 + Integer.parseInt(endParts[1]);

            if (slotMin < startMin || slotMin >= endMin) {
                throw new InvalidAppointmentException("Time slot " + timeSlot + " is outside doctor's consultation hours ("
                        + dayAvail.getStartTime() + " - " + dayAvail.getEndTime() + ").");
            }
        } catch (NumberFormatException e) {
            throw new InvalidAppointmentException("Invalid time slot format. Expected HH:mm.");
        }
    }

    public AppointmentResponse mapToResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatientId())
                .patientName(appointment.getPatientName())
                .patientEmail(appointment.getPatientEmail())
                .patientPhone(appointment.getPatientPhone())
                .doctorId(appointment.getDoctorId())
                .doctorName(appointment.getDoctorName())
                .specialization(appointment.getSpecialization())
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .queueNumber(appointment.getQueueNumber())
                .status(appointment.getStatus())
                .reason(appointment.getReason())
                .notes(appointment.getNotes())
                .createdAt(appointment.getCreatedAt())
                .build();
    }
}
