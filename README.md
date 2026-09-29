# Smart Job Market & Skill-Gap Advisor

[![Java 21](https://img.shields.io/badge/Java-21-orange.svg?style=for-the-badge&logo=openjdk)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.3-green.svg?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge)](LICENSE)

A custom full-stack web application designed to compare candidate skill profiles against job market demands, calculate job readiness percentages, identify missing technical and soft skills, and recommend learning resources.

---

## Key Features

- **Weighted Skill Gap Engine**: Evaluates candidate skills against target job roles, differentiating core critical requirements from secondary skills.
- **Market Skill Trends**: Visualizes top trending skills and industry hiring metrics using Recharts.
- **JWT Authentication & RBAC Security**: Role-based access control supporting `ROLE_USER`, `ROLE_MANAGER`, and `ROLE_ADMIN` with encrypted sessions.
- **Learning Recommendations**: Maps identified skill gaps to courses, certifications, and career roadmaps.
- **Responsive UI**: Responsive interface built with React 18, Tailwind CSS, Lucide icons, Framer Motion, and Light/Dark mode.
- **API Documentation**: Interactive API testing interface available at `/swagger-ui.html`.

---

## Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide Icons, Recharts, Framer Motion, Axios |
| **Backend** | Java 21 LTS, Spring Boot 3.2.3, Spring Security, Spring Data JPA, Lombok |
| **Security** | JSON Web Tokens (JWT HMAC SHA-512), BCrypt Password Hashing |
| **Database** | MySQL 8.0 |
| **API Docs** | Swagger UI / OpenAPI 3.0 (`/swagger-ui.html`) |

---

## Repository Structure

```text
smart-job-market-skillgap-advisor/
├── backend/                  # Spring Boot REST API
│   ├── src/                  # Source code (Controllers, Services, Repositories, Entities, Security)
│   ├── pom.xml               # Maven configuration & dependencies
│   └── .env                  # Backend environment configuration
├── frontend/                 # React + Vite + Tailwind CSS SPA
│   ├── src/                  # Components, Pages, Contexts, Services, Styles
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite build & proxy settings
│   └── .env                  # Frontend environment configuration
├── database/                 # Database scripts & ER diagrams
│   ├── schema.sql            # Table definitions & constraints
│   └── seed.sql              # Initial market data & sample job postings
├── docs/                     # Project documentation
├── .env                      # Root environment settings
├── .gitignore                # Git exclusion rules
├── LICENSE                   # Apache 2.0 Open Source License
└── README.md                 # Project README
```

---

## Quick Start Guide

### Prerequisites

Ensure you have the following installed on your machine:
- **Java JDK 21** or higher
- **Maven** (installed locally)
- **Node.js** (v18.x or later) & `npm`
- **MySQL Server 8.0** running on `localhost:3306`

---

### Local Setup Instructions

#### 1. Database Setup
Initialize the database schema and sample seed data in MySQL:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

#### 2. Backend Execution (Spring Boot)
Configure database credentials in `backend/.env` or `backend/src/main/resources/application.properties`, then start the server:
```bash
cd backend
mvn spring-boot:run
```
*The Spring Boot server will launch on `http://localhost:8080`.*

#### 3. Frontend Execution (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*The React frontend app will be accessible at `http://localhost:5173`.*

---

## Default Credentials

The platform comes pre-seeded with sample user accounts for testing:

| User Role | Username / Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Candidate** | `user@skillgap.com` | `Password123!` | Standard Candidate Profile & Skill Gap Analysis |
| **Manager** | `manager@skillgap.com` | `Password123!` | Job posting creation & market trends update |
| **Administrator** | `admin@skillgap.com` | `AdminPass123!` | System configuration & administrative privileges |

---

## API Endpoints Summary

All backend API routes are prefixed under `/api/v1`:

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Public | Register a new user account |
| `/auth/login` | `POST` | Public | Authenticate user & return JWT token |
| `/users/profile` | `GET` / `PUT` | Authenticated | Manage candidate profile and target job role |
| `/users/skills` | `POST` / `DELETE`| Authenticated | Manage candidate skill inventory |
| `/jobs` | `GET` | Public | Fetch job listings & required skills |
| `/advisor/analyze` | `POST` | Authenticated | Trigger Skill-Gap Analysis engine |
| `/analytics/trends` | `GET` | Public | Get market trends & high-demand skill metrics |
| `/courses` | `GET` | Public | Browse recommended learning resources |

---

## License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## Author

**Omkar Kakumanu**
- GitHub: [@omkar-kakumanu](https://github.com/omkar-kakumanu)
- Repository: [smart-job-market-skillgap-advisor](https://github.com/omkar-kakumanu/smart-job-market-skillgap-advisor.git)