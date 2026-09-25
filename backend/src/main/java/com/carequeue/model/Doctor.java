package com.carequeue.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "doctors")
public class Doctor {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String phone;

    @Indexed
    private String specialization;

    private String qualification;

    private Integer experience; // in years

    private Double consultationFee;

    private String profileImage;

    private String bio;

    @Builder.Default
    private List<DayAvailability> availability = new ArrayList<>();

    @Indexed
    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
