# 🎓 CampusCart

A modern, multi-tenant marketplace designed specifically for college campuses. Buy, sell, and trade textbooks, electronics, and notes within your own campus community with complete data isolation, secure JWT authentication, and built-in AI assistance.

---

## 🚀 Quick Start

### 1. Prerequisites
*   **Java 21+** and **Maven** (for the Backend API)
*   **A Modern Browser** (for the Frontend)

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   > **Note**: The API server will start on [http://localhost:8080](http://localhost:8080).
   By default, it is configured to run automatically using an **H2 in-memory Database** so you do not need to install PostgreSQL to run the backend locally. Database structure auto-updates on launch.

### 3. Frontend Setup
1. Ensure the Spring Boot backend is successfully running.
2. At the root of the project, open `index.html` in your browser. (You can use "Live Server" in VS Code for rapid reloading).
3. If you'd like to tweak styles utilizing the Tailwind CLI for development:
   ```bash
   npm install
   npx tailwindcss -i ./style.css -o ./dist/output.css --watch
   ```

### 4. Enabling AI Chat features (Optional)
This platform includes an embedded AI Chatbox powered organically by the Google Gemini REST API. To activate it:
1. Obtain a Free Gemini API key from Google AI Studio.
2. In `app.js`, navigate to `line 400`.
3. Locate `const GEMINI_API_KEY = "YOUR_API_KEY_HERE"` and securely paste your token within the quotes.

---

## 🛠 Features

*   **Multi-Tenancy Architecture**: Choose your college during signup. You will firmly ONLY see item listings originating from your specific campus community.
*   **College Creation**: Don't see your target college? You can seamlessly register a brand new one on-the-fly!
*   **Secure Authentication**: Stateless JWT-based login and registration system.
*   **Product Listings**: Easily post items for sale dynamically categorized as Books, Electronics, and Notes.
*   **AI Chat Assistant**: Need guidance? The sleek interactive chatbot uses the Gemini 1.5 model to quickly aid you right at the bottom corner of your screen.
*   **Announcements Board**: Clean interactive notification bells to broadcast campus-wide notices.

---

## 🏗 Architecture

### Backend (Spring Boot 3.2.4)
*   **Data Isolation**: Every database table uniquely utilizes a `tenant_id` column to verify and guarantee absolutely zero cross-leakage of private listings between opposed colleges.
*   **ThreadLocal Context**: A personalized `TenantContext` consistently stores your current tenant code identity throughout the REST request lifecycle.
*   **JWT Security**: Custom `JwtAuthenticationFilter` automatically intercepts and validates access tokens before populating the security context layer.

### Frontend (Vanilla HTML, JS + Tailwind CSS)
*   **Stunning UI**: Heavy utilization of high aesthetic glassmorphism, responsive micro-animations, bespoke icon SVGs, and modern editorial font stacks (Playfair Display, DM Sans, Jetbrains Mono).
*   **Stateless Operations**: The frontend captures your JWT upon login to `localStorage` and persistently attaches it strictly into the Authorization header of every single secure API request route.
*   **Modular API Scripting**: A fully centralized wrapper script (`api.js`) gracefully structures all HTTP communication alongside the Java Spring Boot REST controllers.
*   **Dynamic Data Displays**: Ultra-fast front-end category pill filtering logic built structurally atop a single `fetch` request.

---

## 📂 Project Directory Structure

```text
CampusCart/
├── backend/               # Java / Spring Boot Backend 
│   ├── src/main/java/     # Main Code (Controllers, Services, Repositories, Security Config)
│   └── src/main/resources/# Application configurations (H2 setup & JWT Secrets)
│   └── pom.xml            # Maven Configuration (Java 21, JPA, Security, Lombok, JJWT)
├── assets/                # App Icons & Base Images (favicon.svg, custom SVGs)
├── index.html             # The Main Frontend UI Base
├── app.js                 # Local Logic, Chat Operations, and UI Interaction Control
├── api.js                 # Network Connector interacting with Localhost Server
├── style.css              # Bespoke Micro-animations & Tailwind Additions
└── README.md              # Project Documentation
```

---

## 🤝 Contributing
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingOptimization`).
3. Commit your awesome changes (`git commit -m 'Added some Amazing Optimization'`).
4. Push natively back up to the branch (`git push origin feature/AmazingOptimization`).
5. Open a Pull Request.

---

## 📝 License
Distributed under the MIT License.
