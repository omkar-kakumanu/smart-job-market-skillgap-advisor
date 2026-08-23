package com.skillgap.advisor.service;

import com.skillgap.advisor.dto.AuthRequest;
import com.skillgap.advisor.dto.AuthResponse;
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
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email address is already registered!");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .targetCareerRole(request.getTargetCareerRole() != null ? request.getTargetCareerRole() : "Software Engineer")
                .experienceLevel(request.getExperienceLevel() != null ? request.getExperienceLevel() : "ENTRY_LEVEL")
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
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        UserProfileDto profile = userService.mapToProfileDto(user);
        return AuthResponse.builder()
                .accessToken(jwt)
                .user(profile)
                .build();
    }
}

