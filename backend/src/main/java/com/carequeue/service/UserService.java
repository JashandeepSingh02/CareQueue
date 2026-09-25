package com.carequeue.service;

import com.carequeue.dto.UserDTOs.*;
import com.carequeue.exception.ResourceNotFoundException;
import com.carequeue.model.Role;
import com.carequeue.model.User;
import com.carequeue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        return mapToProfileResponse(user);
    }

    public UserProfileResponse updateUserProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        user.setUpdatedAt(Instant.now());

        User updated = userRepository.save(user);
        return mapToProfileResponse(updated);
    }

    public List<UserProfileResponse> getAllPatients() {
        return userRepository.findByRole(Role.ROLE_PATIENT).stream()
                .map(this::mapToProfileResponse)
                .collect(Collectors.toList());
    }

    public List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToProfileResponse)
                .collect(Collectors.toList());
    }

    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
