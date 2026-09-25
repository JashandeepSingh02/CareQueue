package com.carequeue.util;

import com.carequeue.model.*;
import com.carequeue.repository.AppointmentRepository;
import com.carequeue.repository.DoctorRepository;
import com.carequeue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${carequeue.admin.name:CareQueue Admin}")
    private String adminName;

    @Value("${carequeue.admin.email:admin@carequeue.com}")
    private String adminEmail;

    @Value("${carequeue.admin.password:Admin@123}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        seedAdminUser();
        seedSampleDataIfEmpty();
    }

    private void seedAdminUser() {
        String email = adminEmail.toLowerCase().trim();
        if (!userRepository.existsByEmail(email)) {
            User admin = User.builder()
                    .fullName(adminName)
                    .email(email)
                    .password(passwordEncoder.encode(adminPassword))
                    .phone("+1 800-555-0199")
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

            userRepository.save(admin);
            log.info("SEED DATA: Initialized Admin Account -> Email: {}, Password: {}", email, adminPassword);
        }
    }

    private void seedSampleDataIfEmpty() {
        if (doctorRepository.count() == 0) {
            log.info("SEED DATA: Seeding demo doctors and patient...");

            // 1. Seed Sample Patient
            String patientEmail = "patient@carequeue.com";
            User patientUser = userRepository.findByEmail(patientEmail).orElseGet(() -> {
                User p = User.builder()
                        .fullName("John Doe")
                        .email(patientEmail)
                        .password(passwordEncoder.encode("Patient@123"))
                        .phone("+1 555-0142")
                        .gender("Male")
                        .dateOfBirth("1992-05-14")
                        .role(Role.ROLE_PATIENT)
                        .enabled(true)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build();
                return userRepository.save(p);
            });

            // 2. Seed Doctor 1: Dr. Sarah Jenkins (Cardiology)
            createDoctorSeed("Dr. Sarah Jenkins", "cardio.jenkins@carequeue.com", "Doctor@123", "+1 555-0101",
                    "Cardiology", "MD, FACC - Harvard Medical School", 14, 120.0,
                    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
                    "Senior Cardiologist specializing in preventive cardiology and heart rhythm management.");

            // 3. Seed Doctor 2: Dr. Robert Chen (Neurology)
            Doctor doc2 = createDoctorSeed("Dr. Robert Chen", "neuro.chen@carequeue.com", "Doctor@123", "+1 555-0102",
                    "Neurology", "MD, PhD - Johns Hopkins University", 11, 150.0,
                    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
                    "Board-certified Neurologist with expertise in migraine management, stroke recovery, and clinical neuroscience.");

            // 4. Seed Doctor 3: Dr. Emily Taylor (Pediatrics)
            createDoctorSeed("Dr. Emily Taylor", "peds.taylor@carequeue.com", "Doctor@123", "+1 555-0103",
                    "Pediatrics", "MD - Stanford University", 8, 90.0,
                    "https://images.unsplash.com/photo-1594824813566-88855ce78907?w=400&q=80",
                    "Compassionate pediatrician focusing on child growth, immunizations, and adolescent wellness.");

            // 5. Seed Doctor 4: Dr. Michael Vance (General Medicine)
            createDoctorSeed("Dr. Michael Vance", "general.vance@carequeue.com", "Doctor@123", "+1 555-0104",
                    "General Medicine", "MD - Columbia University", 16, 80.0,
                    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80",
                    "Primary care physician dedicated to comprehensive health screenings, chronic disease management, and holistic care.");

            // 6. Seed Sample Appointments for Today
            if (appointmentRepository.count() == 0 && doc2 != null) {
                Appointment app1 = Appointment.builder()
                        .patientId(patientUser.getId())
                        .patientName(patientUser.getFullName())
                        .patientEmail(patientUser.getEmail())
                        .patientPhone(patientUser.getPhone())
                        .doctorId(doc2.getId())
                        .doctorName(doc2.getFullName())
                        .specialization(doc2.getSpecialization())
                        .appointmentDate(LocalDate.now())
                        .appointmentTime("09:30")
                        .queueNumber(1)
                        .status(AppointmentStatus.ACCEPTED)
                        .reason("Routine Neurological Checkup and Headache Consultation")
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build();

                appointmentRepository.save(app1);
                log.info("SEED DATA: Sample appointment created with Queue #1 for Dr. Robert Chen");
            }
        }
    }

    private Doctor createDoctorSeed(String name, String email, String password, String phone,
                                    String spec, String qual, int exp, double fee, String img, String bio) {
        if (userRepository.existsByEmail(email)) {
            return doctorRepository.findByEmail(email).orElse(null);
        }

        User user = User.builder()
                .fullName(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .phone(phone)
                .role(Role.ROLE_DOCTOR)
                .enabled(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        User savedUser = userRepository.save(user);

        List<DayAvailability> availability = new ArrayList<>();
        String[] days = {"MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"};
        for (String day : days) {
            availability.add(DayAvailability.builder()
                    .dayOfWeek(day)
                    .startTime("09:00")
                    .endTime("13:00")
                    .slotDurationMinutes(30)
                    .available(true)
                    .build());
        }

        Doctor doc = Doctor.builder()
                .userId(savedUser.getId())
                .fullName(name)
                .email(email)
                .phone(phone)
                .specialization(spec)
                .qualification(qual)
                .experience(exp)
                .consultationFee(fee)
                .profileImage(img)
                .bio(bio)
                .availability(availability)
                .active(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return doctorRepository.save(doc);
    }
}
