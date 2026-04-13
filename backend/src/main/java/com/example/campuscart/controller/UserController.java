package com.example.campuscart.controller;

import com.example.campuscart.dto.UserDTO;
import com.example.campuscart.entity.User;
import com.example.campuscart.repository.UserRepository;
import com.example.campuscart.security.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Long userId = TenantContext.getUserId();
        User user = userRepository.findById(userId).orElseThrow();
        
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setTenantId(user.getTenant().getId());
        dto.setTenantName(user.getTenant().getName());
        
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UserDTO dto) {
        Long userId = TenantContext.getUserId();
        User user = userRepository.findById(userId).orElseThrow();
        
        user.setName(dto.getName());
        User saved = userRepository.save(user);
        
        dto.setId(saved.getId());
        dto.setEmail(saved.getEmail());
        dto.setTenantId(saved.getTenant().getId());
        dto.setTenantName(saved.getTenant().getName());
        
        return ResponseEntity.ok(dto);
    }
}
