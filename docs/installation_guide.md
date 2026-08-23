# Installation & Environment Setup Guide

## Prerequisites

1. **Java Development Kit (JDK 21)**
   Verify installation: `java -version`

2. **Node.js (v18+) & NPM**
   Verify installation: `node -v` and `npm -v`

3. **MySQL Server (8.0+)**
   Ensure service is active on port `3306`.

---

## Detailed Step-by-Step Installation

### Step 1: Database Setup
1. Log into your MySQL instance:
   ```bash
   mysql -u root -p
   ```
2. Run the schema and seed scripts:
   ```sql
   SOURCE database/schema.sql;
   SOURCE database/seed.sql;
   ```

### Step 2: Backend Configuration
Check `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/skillgap_advisor?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=Omkar1707mysql
```

To build and run:
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Step 3: Frontend Configuration
Navigate to frontend folder, install packages, and start dev server:
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` in your browser.
Default Admin Account: `admin@skillgap.com` / `password123`
Default Candidate Account: `john.doe@example.com` / `password123`
