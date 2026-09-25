package com.carequeue.repository;

import com.carequeue.model.Appointment;
import com.carequeue.model.AppointmentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDescAppointmentTimeAsc(String patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDescAppointmentTimeAsc(String doctorId);
    List<Appointment> findByDoctorIdAndAppointmentDateOrderByQueueNumberAsc(String doctorId, LocalDate appointmentDate);
    List<Appointment> findByDoctorIdAndAppointmentDateAndStatusInOrderByQueueNumberAsc(
            String doctorId, LocalDate appointmentDate, Collection<AppointmentStatus> statuses);
    
    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusIn(
            String doctorId, LocalDate appointmentDate, String appointmentTime, Collection<AppointmentStatus> statuses);

    boolean existsByPatientIdAndDoctorIdAndAppointmentDateAndStatusIn(
            String patientId, String doctorId, LocalDate appointmentDate, Collection<AppointmentStatus> statuses);

    long countByStatus(AppointmentStatus status);
    long countByAppointmentDate(LocalDate date);
}
