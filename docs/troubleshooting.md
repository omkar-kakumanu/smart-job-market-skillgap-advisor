# Troubleshooting & FAQ Guide

## 1. Database Connection Errors (`Communications link failure`)
- Ensure MySQL service is running on `localhost:3306`.
- Verify database `skillgap_advisor` exists or run `database/schema.sql`.
- Check credentials in `backend/src/main/resources/application.properties`:
  - `username=root`
  - `password=Omkar1707mysql`

## 2. CORS Errors in Browser Console
- Verify Vite frontend is running on `http://localhost:5173`.
- `WebConfig.java` in backend is preconfigured to accept origins from `http://localhost:5173` and `http://localhost:3000`.

## 3. JWT Authentication 401 Unauthorized Error
- Ensure the `Authorization` header is formatted as `Bearer <token>`.
- Token expires after 24 hours (86,400,000 ms). Log out and log back in to renew your token.
