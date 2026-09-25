package com.carequeue;

import com.carequeue.dto.AppointmentDTOs.*;
import com.carequeue.model.*;
import com.carequeue.repository.AppointmentRepository;
import com.carequeue.repository.DoctorRepository;
import com.carequeue.repository.UserRepository;
import com.carequeue.service.AppointmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentQueueTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AppointmentService appointmentService;

    private User mockPatient;
    private Doctor mockDoctor;

    @BeforeEach
    void setUp() {
        mockPatient = User.builder()
                .id("pat123")
                .fullName("John Doe")
                .email("john@example.com")
                .role(Role.ROLE_PATIENT)
                .build();

        DayAvailability mondayAvail = DayAvailability.builder()
                .dayOfWeek("MONDAY")
                .startTime("09:00")
                .endTime("13:00")
                .available(true)
                .build();

        mockDoctor = Doctor.builder()
                .id("doc123")
                .fullName("Dr. Sarah Jenkins")
                .specialization("Cardiology")
                .active(true)
                .availability(List.of(mondayAvail))
                .build();
    }

    @Test
    void bookAppointment_GeneratesFirstQueueNumber() {
        // Find next Monday date for testing
        LocalDate nextMonday = LocalDate.now();
        while (!nextMonday.getDayOfWeek().name().equals("MONDAY")) {
            nextMonday = nextMonday.plusDays(1);
        }

        BookAppointmentRequest request = new BookAppointmentRequest("doc123", nextMonday, "10:00", "Heart checkup");

        when(userRepository.findById("pat123")).thenReturn(Optional.of(mockPatient));
        when(doctorRepository.findById("doc123")).thenReturn(Optional.of(mockDoctor));
        when(appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusIn(anyString(), any(), anyString(), any())).thenReturn(false);
        when(appointmentRepository.existsByPatientIdAndDoctorIdAndAppointmentDateAndStatusIn(anyString(), anyString(), any(), any())).thenReturn(false);
        when(appointmentRepository.findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(eq("doc123"), eq(nextMonday)))
                .thenReturn(List.of());

        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment app = invocation.getArgument(0);
            app.setId("app1");
            return app;
        });

        AppointmentResponse response = appointmentService.bookAppointment(request, "pat123");

        assertNotNull(response);
        assertEquals(1, response.getQueueNumber());
        assertEquals(AppointmentStatus.PENDING, response.getStatus());
    }
}
