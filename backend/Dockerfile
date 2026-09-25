# ── Stage 1: Build ──
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

# Copy project files
COPY pom.xml .
COPY src ./src

# Build the JAR (skip tests for faster deploy)
RUN mvn clean package -DskipTests -B

# ── Stage 2: Run ──
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/carequeue-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
