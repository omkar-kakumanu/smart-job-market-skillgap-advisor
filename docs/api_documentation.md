# API Specification & Swagger Documentation

All APIs are prefixed with `/api/v1`.

| Endpoint | Method | Security | Description |
|---|---|---|---|
| `/auth/register` | POST | Public | Register new candidate account |
| `/auth/login` | POST | Public | Authenticate user & get JWT token |
| `/users/profile` | GET | Bearer JWT | Fetch authenticated user profile & skills |
| `/users/profile` | PUT | Bearer JWT | Update profile details & target role |
| `/users/skills` | POST | Bearer JWT | Add/update skill in user inventory |
| `/users/skills/{id}` | DELETE | Bearer JWT | Remove skill from user profile |
| `/jobs` | GET | Public | Paginated job postings with search filter |
| `/jobs/{id}` | GET | Public | Fetch job posting details & required skills |
| `/jobs` | POST | Admin/Manager | Create new industry job description |
| `/jobs/{id}` | DELETE | Admin/Manager | Delete job posting |
| `/skills` | GET | Public | Master skills catalog |
| `/advisor/analyze` | POST | Bearer JWT | Perform real-time skill gap analysis |
| `/advisor/history` | GET | Bearer JWT | Fetch candidate's past gap analysis logs |
| `/analytics/trends` | GET | Public | Top demanded skills & market metrics |
| `/courses` | GET | Public | Recommended learning resources directory |

Swagger OpenAPI interactive testing UI is live at:
`http://localhost:8080/swagger-ui.html`
