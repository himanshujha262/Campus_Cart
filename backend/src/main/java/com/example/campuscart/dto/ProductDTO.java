package com.example.campuscart.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String category;
    private String imageUrl;
    private Long sellerId;
    private String sellerName;
}
