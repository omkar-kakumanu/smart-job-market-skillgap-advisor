# Deployment & Production Build Guide

## Building for Local Production Deployment

This guide outlines how to build and run the React frontend and Spring Boot backend locally without containers.

### 1. Build the Frontend Production Bundle
```bash
cd frontend
npm install
npm run build
```
The compiled static assets will be located in the `frontend/dist` directory.

### 2. Build the Backend JAR
```bash
cd backend
mvn clean package -DskipTests
```
The generated executable JAR file will be located in `backend/target/advisor-1.0.0.jar`.

### 3. Running the Backend JAR
```bash
java -jar backend/target/advisor-1.0.0.jar
```
*The Spring Boot server will run on `http://localhost:8080`.*
