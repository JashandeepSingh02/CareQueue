# CareQueue — Smart Clinic Appointment & Queue Management System

CareQueue is a production-ready, full-stack enterprise healthcare application engineered with **Spring Boot 3 (Java 21)**, **Spring Data MongoDB**, **Spring Security (JWT + BCrypt)**, and **React.js (Vite + Tailwind CSS)**. 

It provides automated per-doctor daily queue number generation, real-time queue tracking, interactive schedule configuration, role-based authorization, and tokenized password reset workflows.

---

## 🌟 Key Features

### 👤 Patient Portal
* **Registration & Auth**: Register with email validation, secure login, password reset flow.
* **Doctor Search**: Search specialists by medical field (Cardiology, Neurology, Pediatrics, General Medicine).
* **Schedule & Availability Booking**: Select available consultation dates and time slots based on doctor schedules.
* **Automated Backend Queue Numbers**: Receive automatically generated daily per-doctor Queue Numbers (`Queue #1`, `Queue #2`, etc.).
* **Live Queue Tracking**: Monitor live queue status (current patient in room, next in line, waiting count).
* **Appointment Management**: View appointment history and cancel pending bookings.

### 🩺 Doctor Portal
* **Console Dashboard**: View today's scheduled consultations and real-time waiting room counts.
* **Queue Management**: Call current patient into room, view next patient, mark consultations as `COMPLETED`.
* **Appointment Controls**: Accept, reject, or cancel appointment requests.
* **Availability Configuration**: Set weekly consultation hours per day of the week with slot durations.

### 🛡️ Admin Portal
* **System Metrics Overview**: Live statistics (Total Users, Patients, Doctors, Active Staff, Total Appointments, Today's Appointments, Status breakdowns).
* **Staff Directory Management**: Add new doctors, edit credentials, set fees, and activate/deactivate accounts.
* **User Oversight**: Audit patient/doctor records and remove inactive user accounts.
* **Global Appointment Ledger**: Inspect and monitor all appointment records across all clinic departments.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, JavaScript, React Router v6, Axios, Tailwind CSS, Lucide Icons |
| **Backend** | Java 21 LTS, Spring Boot 3.2.4, Spring Web, Spring Security, Bean Validation, Maven |
| **Database** | MongoDB 7.0, Spring Data MongoDB (No JPA/Hibernate/SQL used) |
| **Security** | JWT (io.jsonwebtoken 0.12.5), BCrypt Password Hashing, RBAC Filter Chain |
| **API Docs** | Springdoc OpenAPI / Swagger UI |
| **DevOps** | Docker, Docker Compose, Nginx, Multi-stage Dockerfiles |

---

## 📂 Project Architecture

```
CareQueue/
├── backend/
│   ├── src/
│   │   ├── main/java/com/carequeue/
│   │   │   ├── config/            # Security, CORS, Swagger, Mail config
│   │   │   ├── controller/        # Auth, User, Doctor, Appointment, Admin controllers
│   │   │   ├── dto/               # API Data Transfer Objects
│   │   │   ├── exception/         # Centralized GlobalExceptionHandler
│   │   │   ├── model/             # MongoDB Documents (User, Doctor, Appointment, PasswordResetToken)
│   │   │   ├── repository/        # MongoRepositories
│   │   │   ├── security/          # JWT Provider, Auth Filter, UserPrincipal
│   │   │   ├── service/           # Auth, User, Doctor, Appointment, Admin, Mail services
│   │   │   └── util/              # DataInitializer for admin/demo seeding
│   │   └── resources/             # application.properties
│   ├── test/                      # Unit & integration tests
│   ├── pom.xml
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/            # Navbar, Footer, ProtectedRoute, Toast, Modal, StatusBadges
│   │   ├── context/               # AuthContext for state & JWT persistence
│   │   ├── pages/                 # Landing, Login, Register, Dashboards, Search, Queue, Profile
│   │   ├── services/              # Axios central API wrappers
│   │   ├── utils/                 # Formatters & helper functions
│   │   └── index.css              # Tailwind CSS directives
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🗄️ MongoDB Database Structure

### Collections & Indexes
1. `users`
   - Fields: `id`, `fullName`, `email` (Unique Index), `password` (BCrypt Hash), `phone`, `role` (`ROLE_ADMIN`, `ROLE_DOCTOR`, `ROLE_PATIENT`), `enabled`, `createdAt`, `updatedAt`
2. `doctors`
   - Fields: `id`, `userId` (Index), `fullName`, `email` (Unique Index), `phone`, `specialization` (Index), `qualification`, `experience`, `consultationFee`, `profileImage`, `availability` (List of day schedules), `active` (Index), `createdAt`, `updatedAt`
3. `appointments`
   - Fields: `id`, `patientId` (Index), `patientName`, `doctorId` (Index), `doctorName`, `specialization`, `appointmentDate` (Index), `appointmentTime`, `queueNumber`, `status` (`PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`, `CANCELLED`), `reason`, `notes`, `createdAt`, `updatedAt`
   - Compound Indexes: `(doctorId, appointmentDate)`, `(patientId, appointmentDate)`
4. `password_reset_tokens`
   - Fields: `id`, `userId`, `token` (Unique Index), `expiryDate`, `used`, `createdAt`

---

## 🔐 Security & Password Reset Flow

1. **Password Storage**: Passwords are standard BCrypt hashed before persisting to MongoDB. Plaintext passwords are never stored or logged.
2. **JWT Flow**:
   - `POST /api/auth/login` verifies BCrypt password and issues a signed JWT containing `email`, `id`, and `role`.
   - `JwtAuthenticationFilter` validates bearer tokens on incoming requests.
3. **Password Reset Workflow**:
   ```
   Forgot Password -> POST /api/auth/forgot-password -> Generates 30-min UUID Token -> Mail/Log Dispatch
   User Opens Link -> GET /reset-password?token=xxx -> Form Input
   Submit -> POST /api/auth/reset-password -> Validates Token & Expiry -> BCrypt Hash Update -> Token Invalidation
   ```

---

## 🚀 Local Quick Start Guide

### Prerequisites
- Java 17 or Java 21 JDK
- Maven 3.8+
- Node.js 18+ and npm
- MongoDB Server running on `localhost:27017` (or Docker)

### 1. Database Setup
Ensure MongoDB is running locally:
```bash
mongod
# or test TCP connection on port 27017
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
mvn clean spring-boot:run
```
The backend starts at `http://localhost:8080`.  
Swagger UI is accessible at `http://localhost:8080/swagger-ui.html`.

### 3. Frontend Setup
In a new terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
The frontend starts at `http://localhost:5713`.

---

## 🔑 Default Seed Demo Accounts

Upon initial boot, CareQueue automatically populates seed accounts and sample specialists into MongoDB for instant testing:

| Role | Email | Password | Access / Dashboard |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@carequeue.com` | `Admin@123` | `/admin` (System Overview & Staff Management) |
| **Doctor (Neurology)** | `neuro.chen@carequeue.com` | `Doctor@123` | `/doctor-dashboard` (Console & Today's Queue) |
| **Doctor (Cardiology)** | `cardio.jenkins@carequeue.com` | `Doctor@123` | `/doctor-dashboard` |
| **Patient** | `patient@carequeue.com` | `Patient@123` | `/dashboard` (Patient Appointments & Live Queue) |

*Note: The login page includes 1-click quick fill demo buttons for testing convenience.*

---

## 🐳 Docker Setup

Run the entire application stack (MongoDB + Spring Boot + React/Nginx) with Docker Compose:

```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`
- MongoDB: `localhost:27017`

---

## 🌐 Production Cloud Deployment

### 1. MongoDB Atlas Configuration
1. Create a cluster on MongoDB Atlas.
2. Under **Network Access**, allow IP `0.0.0.0/0` (or host IP).
3. Create a database user and copy connection string:
   `mongodb+srv://<username>:<password>@cluster.mongodb.net/carequeue_db?retryWrites=true&w=majority`
4. Set environment variable on backend: `MONGODB_URI=<your_atlas_connection_string>`.

### 2. Backend Deployment (Render / Railway / AWS Elastic Beanstalk)
- Root directory: `./backend`
- Environment variables:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `FRONTEND_URL=https://your-frontend.vercel.app`
- Build command: `./mvnw clean package -DskipTests`
- Start command: `java -jar target/carequeue-backend-1.0.0.jar`

### 3. Frontend Deployment (Vercel / Netlify)
- Root directory: `./frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_URL=https://your-backend.onrender.com/api`

---

## 🧪 Running Backend Tests

```bash
cd backend
mvn test
```
Executes unit and integration tests covering:
- Patient registration & password hashing
- Login authentication & JWT generation
- Duplicate email prevention
- Queue number generation logic per doctor & date
- Double booking prevention

---

## 📜 License
Apache License 2.0. Developed for CareQueue Healthcare SaaS.
