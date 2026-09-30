package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.ApiResponse;
import com.skillgap.advisor.dto.AuthRequest;
import com.skillgap.advisor.dto.AuthResponse;
import com.skillgap.advisor.dto.GoogleSsoRequest;
import com.skillgap.advisor.dto.RegisterRequest;
import com.skillgap.advisor.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user registration, JWT login, and Google SSO")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register new job seeker or candidate profile")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(ApiResponse.success(response, "User registered successfully"), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue Bearer JWT Token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "User authenticated successfully"));
    }

    @PostMapping("/google-sso")
    @Operation(summary = "Authenticate or register user via Google SSO")
    public ResponseEntity<ApiResponse<AuthResponse>> googleSso(@Valid @RequestBody GoogleSsoRequest request) {
        AuthResponse response = authService.loginWithGoogle(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Google SSO authenticated successfully"));
    }
}
