# CareQueue Backend

Spring Boot 3 REST API for CareQueue — Smart Clinic Appointment & Queue Management System.

## Stack
- Java 21 LTS
- Spring Boot 3.2.4
- Spring Security (JWT + BCrypt)
- Spring Data MongoDB (No JPA/SQL)
- Bean Validation
- Springdoc OpenAPI (Swagger UI)

## Key Endpoints
- `POST /api/auth/register` - Patient signup
- `POST /api/auth/login` - Authenticate & get JWT
- `POST /api/auth/forgot-password` - Trigger reset token email
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/doctors` - View active doctors & search
- `POST /api/appointments` - Book appointment & get queue number
- `GET /api/appointments/doctor/{id}/queue` - Real-time queue view
- `GET /api/admin/statistics` - Admin metrics & dashboard data

## Local Development
```bash
mvn spring-boot:run
```
Swagger UI: `http://localhost:8080/swagger-ui.html`
