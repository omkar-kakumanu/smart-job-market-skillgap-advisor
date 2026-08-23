package com.skillgap.advisor;

import com.skillgap.advisor.dto.AuthRequest;
import com.skillgap.advisor.dto.AuthResponse;
import com.skillgap.advisor.dto.RegisterRequest;
import com.skillgap.advisor.entity.Role;
import com.skillgap.advisor.entity.User;
import com.skillgap.advisor.repository.UserRepository;
import com.skillgap.advisor.security.JwtTokenProvider;
import com.skillgap.advisor.service.AuthService;
import com.skillgap.advisor.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthService authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .fullName("Test User")
                .email("test@example.com")
                .password("encodedPassword")
                .role(Role.ROLE_USER)
                .build();
    }

    @Test
    void register_ShouldReturnAuthResponse() {
        RegisterRequest req = new RegisterRequest();
        req.setFullName("Test User");
        req.setEmail("test@example.com");
        req.setPassword("password123");

        when(userRepository.existsByEmail(req.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(req.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("jwt.token.string");

        AuthResponse res = authService.register(req);

        assertNotNull(res);
        assertNotNull(res.getAccessToken());
    }

    @Test
    void login_ShouldReturnAuthResponse() {
        AuthRequest req = new AuthRequest();
        req.setEmail("test@example.com");
        req.setPassword("password123");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("jwt.token.string");
        when(userRepository.findByEmail(req.getEmail())).thenReturn(Optional.of(sampleUser));

        AuthResponse res = authService.login(req);

        assertNotNull(res);
        assertNotNull(res.getAccessToken());
    }
}
