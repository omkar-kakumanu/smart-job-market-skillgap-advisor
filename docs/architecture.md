# System Architecture & Technical Design

## Architectural Pattern

The application follows an N-Tier Layered Full-Stack Architecture:

```text
[ React 18 Single Page App ]  (Port 5173 / Nginx 80)
           |
           | HTTP REST / JSON (JWT Authorization Header)
           v
[ Spring Boot Controller Layer ]
           |
[ Service Business Logic Layer ] (Gap Engine, Analytics, Auth)
           |
[ Spring Data JPA Repository ]
           |
[ MySQL 8.0 Database ] (Port 3306)
```

## Security Design & JWT Flow

1. Client posts credentials to `/api/v1/auth/login`.
2. `AuthService` authenticates via `AuthenticationManager` + BCrypt encoder.
3. `JwtTokenProvider` builds signed HMAC SHA-512 JWT token.
4. Subsequent requests pass `Authorization: Bearer <token>`.
5. `JwtAuthenticationFilter` validates token on every request and populates SecurityContext.

## Skill Gap Analysis Calculation Algorithm

- For each required skill $S_i$ in job posting $J$ with importance weight $W_i$:
  - Total Weight $W_{total} = \sum W_i$
  - If Candidate possesses skill $S_i$: Matched Weight $W_{matched} \mathrel{+}= W_i$
  - Match Percentage $= \left( \frac{W_{matched}}{W_{total}} \right) \times 100\%$
- Missing skills are sorted by importance weight descending and matched against `courses` table via foreign key `primary_skill_id`.
