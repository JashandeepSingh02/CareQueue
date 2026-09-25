package com.carequeue.repository;

import com.carequeue.model.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {
    Optional<Doctor> findByUserId(String userId);
    Optional<Doctor> findByEmail(String email);
    List<Doctor> findByActiveTrue();
    List<Doctor> findBySpecializationIgnoreCaseAndActiveTrue(String specialization);
    List<Doctor> findBySpecializationIgnoreCase(String specialization);
    long countByActiveTrue();
}
