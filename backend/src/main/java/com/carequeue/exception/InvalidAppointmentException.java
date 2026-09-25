package com.carequeue.exception;

public class InvalidAppointmentException extends RuntimeException {
    public InvalidAppointmentException(String message) {
        super(message);
    }
}
