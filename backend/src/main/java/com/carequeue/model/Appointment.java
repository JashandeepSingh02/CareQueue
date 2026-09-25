package com.carequeue.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "appointments")
@CompoundIndexes({
    @CompoundIndex(name = "doctor_date_idx", def = "{'doctorId': 1, 'appointmentDate': 1}"),
    @CompoundIndex(name = "patient_date_idx", def = "{'patientId': 1, 'appointmentDate': 1}")
})
public class Appointment {

    @Id
    private String id;

    @Indexed
    private String patientId;

    private String patientName;

    private String patientEmail;

    private String patientPhone;

    @Indexed
    private String doctorId;

    private String doctorName;

    private String specialization;

    @Indexed
    private LocalDate appointmentDate;

    private String appointmentTime; // e.g. "10:00"

    private int queueNumber;

    @Indexed
    private AppointmentStatus status;

    private String reason;

    private String notes;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
