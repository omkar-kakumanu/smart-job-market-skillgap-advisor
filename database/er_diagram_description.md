# Smart Job Market Skill-Gap Advisor - Entity Relationship Diagram & Architecture

This document provides a detailed description of the Database Schema, Entity Relationships, Constraints, and Business Rules implemented in MySQL for the platform.

```mermaid
erDiagram
    USERS ||--o{ USER_SKILLS : possesses
    USERS ||--o{ GAP_ANALYSIS_RESULTS : generates
    SKILLS ||--o{ USER_SKILLS : mapped_to
    SKILLS ||--o{ JOB_SKILLS : required_in
    SKILLS ||--o{ COURSES : bridges
    JOB_POSTINGS ||--o{ JOB_SKILLS : contains

    USERS {
        bigint id PK
        string full_name
        string email UK
        string password
        string profile_image_url
        string target_career_role
        string experience_level
        string role
        boolean is_active
        timestamp created_at
    }

    SKILLS {
        bigint id PK
        string name UK
        string category
        string description
        int market_demand_score
    }

    USER_SKILLS {
        bigint id PK
        bigint user_id FK
        bigint skill_id FK
        string proficiency_level
        decimal years_experience
    }

    JOB_POSTINGS {
        bigint id PK
        string title
        string company
        string location
        string experience_level
        string salary_range
        text description
        boolean is_active
        date posted_date
    }

    JOB_SKILLS {
        bigint id PK
        bigint job_id FK
        bigint skill_id FK
        boolean is_required
        int importance_weight
    }

    COURSES {
        bigint id PK
        string title
        string provider
        string course_url
        int duration_hours
        string difficulty
        string cost_type
        decimal rating
        bigint primary_skill_id FK
    }

    GAP_ANALYSIS_RESULTS {
        bigint id PK
        bigint user_id FK
        string target_job_title
        decimal match_percentage
        int matched_skills_count
        int missing_skills_count
        json missing_skills_json
        json recommendations_json
        timestamp created_at
    }
```

## Entity Details & Keys

### 1. `users`
- **Primary Key**: `id` (AUTO_INCREMENT)
- **Unique Constraint**: `email`
- **Indexes**: `idx_user_email`, `idx_user_role`
- **Role Enums**: `ROLE_USER`, `ROLE_ADMIN`, `ROLE_MANAGER`

### 2. `skills`
- **Primary Key**: `id` (AUTO_INCREMENT)
- **Unique Constraint**: `name`
- **Categories**: `TECHNICAL`, `SOFT`, `CERTIFICATION`, `METHODOLOGY`

### 3. `user_skills`
- **Primary Key**: `id` (AUTO_INCREMENT)
- **Foreign Keys**: `user_id` -> `users(id)`, `skill_id` -> `skills(id)`
- **Unique Key**: `uq_user_skill` (`user_id`, `skill_id`)
- **Proficiency Levels**: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`

### 4. `job_postings`
- **Primary Key**: `id` (AUTO_INCREMENT)
- **Indexes**: `idx_job_title`, `idx_job_company`, `idx_job_experience`

### 5. `job_skills`
- **Primary Key**: `id` (AUTO_INCREMENT)
- **Foreign Keys**: `job_id` -> `job_postings(id)`, `skill_id` -> `skills(id)`
- **Unique Key**: `uq_job_skill` (`job_id`, `skill_id`)

### 6. `courses`
- **Primary Key**: `id` (AUTO_INCREMENT)
- **Foreign Key**: `primary_skill_id` -> `skills(id)`

### 7. `gap_analysis_results`
- **Primary Key**: `id` (AUTO_INCREMENT)
- **Foreign Key**: `user_id` -> `users(id)`
- **JSON Payload Fields**: Stores structured snapshots of missing skills and course recommendations for fast historical lookups and trends.
