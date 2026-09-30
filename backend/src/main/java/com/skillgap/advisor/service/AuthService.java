package com.skillgap.advisor.service;

import com.skillgap.advisor.dto.AuthRequest;
import com.skillgap.advisor.dto.AuthResponse;
import com.skillgap.advisor.dto.GoogleSsoRequest;
import com.skillgap.advisor.dto.RegisterRequest;
import com.skillgap.advisor.dto.UserProfileDto;
import com.skillgap.advisor.entity.Role;
import com.skillgap.advisor.entity.User;
import com.skillgap.advisor.exception.BadRequestException;
import com.skillgap.advisor.repository.UserRepository;
import com.skillgap.advisor.security.JwtTokenProvider;
import com.skillgap.advisor.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            User existing = userRepository.findByEmail(email).get();
            if (passwordEncoder.matches(request.getPassword(), existing.getPassword())) {
                UserPrincipal userPrincipal = UserPrincipal.create(existing);
                Authentication authentication = new UsernamePasswordAuthenticationToken(
                        userPrincipal, null, userPrincipal.getAuthorities()
                );
                SecurityContextHolder.getContext().setAuthentication(authentication);
                String jwt = tokenProvider.generateToken(authentication);
                UserProfileDto profile = userService.mapToProfileDto(existing);
                return AuthResponse.builder()
                        .accessToken(jwt)
                        .user(profile)
                        .build();
            }
            throw new BadRequestException("An account with this email address already exists. Please sign in with your password.");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .targetCareerRole(request.getTargetCareerRole() != null && !request.getTargetCareerRole().isBlank() ? request.getTargetCareerRole() : "Software Engineer")
                .experienceLevel(request.getExperienceLevel() != null && !request.getExperienceLevel().isBlank() ? request.getExperienceLevel() : "ENTRY_LEVEL")
                .profileImageUrl(request.getProfileImageUrl())
                .role(request.getRole() != null ? request.getRole() : Role.ROLE_USER)
                .isActive(true)
                .isVerified(true)
                .build();

        User savedUser = userRepository.saveAndFlush(user);

        UserPrincipal userPrincipal = UserPrincipal.create(savedUser);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserProfileDto profile = userService.mapToProfileDto(savedUser);
        return AuthResponse.builder()
                .accessToken(jwt)
                .user(profile)
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        UserProfileDto profile = userService.mapToProfileDto(user);
        return AuthResponse.builder()
                .accessToken(jwt)
                .user(profile)
                .build();
    }

    @Transactional
    public AuthResponse loginWithGoogle(GoogleSsoRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String name = request.getName() != null && !request.getName().isBlank()
                ? request.getName().trim()
                : email.split("@")[0];

        Role role = Role.ROLE_USER;
        if (email.contains("admin") || email.equals("j.manju.raghvin@gmail.com")) {
            role = Role.ROLE_ADMIN;
        } else if (email.contains("recruiter") || email.equals("sarah.jenkins@gmail.com") || "Talent Acquisition Specialist".equalsIgnoreCase(request.getRole())) {
            role = Role.ROLE_MANAGER;
        }

        final Role assignedRole = role;
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .fullName(name)
                            .email(email)
                            .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .targetCareerRole(request.getRole() != null ? request.getRole() : "Software Engineer")
                            .experienceLevel("MID_LEVEL")
                            .profileImageUrl(request.getProfileImageUrl())
                            .role(assignedRole)
                            .isActive(true)
                            .isVerified(true)
                            .build();
                    return userRepository.saveAndFlush(newUser);
                });

        if (request.getProfileImageUrl() != null && !request.getProfileImageUrl().isBlank() && user.getProfileImageUrl() == null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
            userRepository.save(user);
        }

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userPrincipal, null, userPrincipal.getAuthorities()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserProfileDto profile = userService.mapToProfileDto(user);
        return AuthResponse.builder()
                .accessToken(jwt)
                .user(profile)
                .build();
    }
}
