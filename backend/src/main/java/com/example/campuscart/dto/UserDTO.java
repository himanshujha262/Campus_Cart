package com.example.campuscart.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private Long tenantId;
    private String tenantName;
}
