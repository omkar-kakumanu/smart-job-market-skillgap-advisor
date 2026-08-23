# Production Deployment Guide (Docker & AWS/Cloud)

## Docker Compose One-Command Deployment

The application includes multi-stage Dockerfiles for both frontend and backend along with Nginx reverse proxy configuration.

### Deployment Command
```bash
cd docker
docker-compose up --build -d
```

Services started:
- `skillgap_mysql`: MySQL 8.0 container on port `3306` with initialized schema and seed data.
- `skillgap_backend`: Java 21 Spring Boot REST API container on port `8080`.
- `skillgap_frontend`: React Vite static production build served by Nginx on port `80`.

### Health Check & Logs
```bash
docker-compose logs -f backend
docker-compose ps
```
