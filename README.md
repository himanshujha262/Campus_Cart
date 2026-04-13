# 🎓 Campus Cart

A modern, multi-tenant marketplace designed specifically for college campuses. Buy, sell, and trade textbooks, electronics, and notes within your own campus community with complete data isolation and secure JWT authentication.

---

## 🚀 Quick Start

### 1. Prerequisites
*   **Java 17+** and **Maven** (for the Backend)
*   **PostgreSQL** (Database)
*   **A Modern Browser** (for the Frontend)

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE campuscart;
   ```
3. Update `src/main/resources/application.properties` with your PostgreSQL username and password.
4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The server will start on [http://localhost:8080](http://localhost:8080)*

### 3. Frontend Setup
1. Ensure the backend is running.
2. Open `index.html` in your browser. (You can use "Live Server" in VS Code or just double-click the file).
3. If you're using Tailwind CLI for development:
   ```bash
   npm install
   npx tailwindcss -i ./style.css -o ./dist/output.css --watch
   ```

---

## 🛠 Features

*   **Multi-Tenancy**: Choose your college during signup. You will only see listings from your specific campus.
*   **College Creation**: Don't see your college? You can register a new one on-the-fly!
*   **Secure Authentication**: JWT-based login and registration system.
*   **Product Listings**: Easily post items for sale under categories like Books, Electronics, and Notes.
*   **Ownership Control**: Users can only edit or delete their own listings.

---

## 🏗 Architecture

### Backend (Spring Boot)
*   **Data Isolation**: Every table uses a `tenant_id` column to ensure no cross-leakage of data between colleges.
*   **ThreadLocal Context**: A custom `TenantContext` stores the current tenant and user identity throughout the request lifecycle.
*   **JWT Security**: Custom `JwtAuthenticationFilter` validates tokens and populates the security context.

### Frontend (Vanilla JS + Tailwind CSS)
*   **Stateless**: The frontend stores the JWT in `localStorage` and sends it with every API request.
*   **Modular API**: A centralized `api.js` handles all communication with the Spring Boot REST controllers.
*   **Dynamic UI**: Real-time filtering, search, and college discovery.

---

## 📂 Project Structure

```text
Campus_Cart/
├── backend/               # Spring Boot Application
│   ├── src/main/java/     # Java Source Code
│   │   └── com/.../       # Controller, Service, Repository, Entity, Security
│   └── src/main/resources/# Application configuration
├── index.html             # Main Frontend UI
├── app.js                 # Frontend Logic & UI Interaction
├── api.js                 # Backend API Integration
├── style.css              # Custom Styling (Tailwind-integrated)
└── README.md              # Project Documentation
```

---

## 🤝 Contributing
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.