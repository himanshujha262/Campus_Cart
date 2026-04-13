# CampusCart Backend

Spring Boot backend for a multi-tenant college marketplace.

## Quick Start
1. Create PostgreSQL DB: `CREATE DATABASE campuscart;`
2. Update `src/main/resources/application.properties` with credentials.
3. Run: `mvn spring-boot:run`

## Features
- Multi-tenant isolation (tenant_id filtering).
- JWT Authentication (userId and tenantId in token).
- REST APIs for Users and Products.
