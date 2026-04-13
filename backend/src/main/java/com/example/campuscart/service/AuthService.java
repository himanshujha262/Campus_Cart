package com.example.campuscart.service;

import com.example.campuscart.dto.AuthResponse;
import com.example.campuscart.dto.LoginRequest;
import com.example.campuscart.dto.RegisterRequest;
import com.example.campuscart.entity.Tenant;
import com.example.campuscart.entity.User;
import com.example.campuscart.repository.TenantRepository;
import com.example.campuscart.repository.UserRepository;
import com.example.campuscart.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        Tenant tenant = tenantRepository.findByCode(request.getTenantCode())
                .orElseThrow(() -> new RuntimeException("Tenant not found with code: " + request.getTenantCode()));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setTenant(tenant);

        User savedUser = userRepository.save(user);
        String jwtToken = jwtService.generateToken(savedUser.getEmail(), savedUser.getId(), tenant.getId());

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(savedUser.getId())
                .tenantId(tenant.getId())
                .userName(savedUser.getName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String jwtToken = jwtService.generateToken(user.getEmail(), user.getId(), user.getTenant().getId());

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .tenantId(user.getTenant().getId())
                .userName(user.getName())
                .build();
    }
}
