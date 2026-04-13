package com.example.campuscart.config;

import com.example.campuscart.entity.Tenant;
import com.example.campuscart.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TenantRepository tenantRepository;

    @Override
    public void run(String... args) throws Exception {
        if (tenantRepository.count() == 0) {
            Tenant t1 = new Tenant();
            t1.setName("Indian Institute of Technology");
            t1.setCode("IIT");

            Tenant t2 = new Tenant();
            t2.setName("National Institute of Technology");
            t2.setCode("NIT");

            Tenant t3 = new Tenant();
            t3.setName("Stanford University");
            t3.setCode("STANFORD");

            Tenant t4 = new Tenant();
            t4.setName("Sharda University");
            t4.setCode("SHARDA");

            tenantRepository.saveAll(List.of(t1, t2, t3, t4));
            System.out.println("Initial tenants seeded!");
        }
    }
}
