package com.carequeue.service;

import com.carequeue.dto.AppointmentDTOs.SystemStatsResponse;
import com.carequeue.model.AppointmentStatus;
import com.carequeue.model.Role;
import com.carequeue.repository.AppointmentRepository;
import com.carequeue.repository.DoctorRepository;
import com.carequeue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public SystemStatsResponse getSystemStats() {
        long totalUsers = userRepository.count();
        long totalPatients = userRepository.countByRole(Role.ROLE_PATIENT);
        long totalDoctors = doctorRepository.count();
        long activeDoctors = doctorRepository.countByActiveTrue();

        long totalAppointments = appointmentRepository.count();
        long pendingApps = appointmentRepository.countByStatus(AppointmentStatus.PENDING);
        long acceptedApps = appointmentRepository.countByStatus(AppointmentStatus.ACCEPTED);
        long completedApps = appointmentRepository.countByStatus(AppointmentStatus.COMPLETED);
        long cancelledApps = appointmentRepository.countByStatus(AppointmentStatus.CANCELLED);
        long todayApps = appointmentRepository.countByAppointmentDate(LocalDate.now());

        return SystemStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalPatients(totalPatients)
                .totalDoctors(totalDoctors)
                .activeDoctors(activeDoctors)
                .totalAppointments(totalAppointments)
                .pendingAppointments(pendingApps)
                .acceptedAppointments(acceptedApps)
                .completedAppointments(completedApps)
                .cancelledAppointments(cancelledApps)
                .todayAppointments(todayApps)
                .build();
    }
}
