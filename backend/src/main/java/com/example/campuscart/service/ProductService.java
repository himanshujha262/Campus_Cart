package com.example.campuscart.service;

import com.example.campuscart.dto.ProductDTO;
import com.example.campuscart.entity.Product;
import com.example.campuscart.entity.Tenant;
import com.example.campuscart.entity.User;
import com.example.campuscart.repository.ProductRepository;
import com.example.campuscart.repository.TenantRepository;
import com.example.campuscart.repository.UserRepository;
import com.example.campuscart.security.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;

    public List<ProductDTO> getAllProducts() {
        Long tenantId = TenantContext.getTenantId();
        return productRepository.findByTenantId(tenantId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Ensure data isolation
        if (!product.getTenant().getId().equals(TenantContext.getTenantId())) {
            throw new RuntimeException("Unauthorized access to data of another tenant");
        }
        
        return mapToDTO(product);
    }

    public ProductDTO createProduct(ProductDTO dto) {
        Long tenantId = TenantContext.getTenantId();
        Long userId = TenantContext.getUserId();

        Tenant tenant = tenantRepository.findById(tenantId).orElseThrow();
        User seller = userRepository.findById(userId).orElseThrow();

        Product product = new Product();
        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setImageUrl(dto.getImageUrl());
        product.setSeller(seller);
        product.setTenant(tenant);

        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }

    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(TenantContext.getUserId())) {
            throw new RuntimeException("Unauthorized to update this product");
        }

        product.setTitle(dto.getTitle());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setImageUrl(dto.getImageUrl());

        return mapToDTO(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(TenantContext.getUserId())) {
            throw new RuntimeException("Unauthorized to delete this product");
        }

        productRepository.delete(product);
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setTitle(product.getTitle());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategory(product.getCategory());
        dto.setImageUrl(product.getImageUrl());
        dto.setSellerId(product.getSeller().getId());
        dto.setSellerName(product.getSeller().getName());
        return dto;
    }
}
