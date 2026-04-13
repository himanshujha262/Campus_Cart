package com.example.campuscart.controller;

import com.example.campuscart.dto.TenantDTO;
import com.example.campuscart.entity.Tenant;
import com.example.campuscart.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantRepository tenantRepository;

    @GetMapping
    public ResponseEntity<List<TenantDTO>> getAllTenants() {
        return ResponseEntity.ok(tenantRepository.findAll().stream().map(t -> {
            TenantDTO dto = new TenantDTO();
            dto.setId(t.getId());
            dto.setName(t.getName());
            dto.setCode(t.getCode());
            return dto;
        }).collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseEntity<TenantDTO> createTenant(@RequestBody TenantDTO dto) {
        if (tenantRepository.findByCode(dto.getCode()).isPresent()) {
            throw new RuntimeException("College code already exists!");
        }
        
        Tenant tenant = new Tenant();
        tenant.setName(dto.getName());
        tenant.setCode(dto.getCode().toUpperCase());
        
        Tenant saved = tenantRepository.save(tenant);
        dto.setId(saved.getId());
        return ResponseEntity.ok(dto);
    }
}
