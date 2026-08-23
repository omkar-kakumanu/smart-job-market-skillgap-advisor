-- Smart Job Market Skill-Gap Advisor Database Schema
-- Database: skillgap_advisor
-- MySQL 8.0+ Compatible

CREATE DATABASE IF NOT EXISTS skillgap_advisor;
USE skillgap_advisor;

-- Drop existing tables in correct dependency order
DROP TABLE IF EXISTS gap_analysis_results;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS job_skills;
DROP TABLE IF EXISTS job_postings;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image_url LONGTEXT DEFAULT NULL,
    target_career_role VARCHAR(100) DEFAULT 'Software Engineer',
    experience_level VARCHAR(50) DEFAULT 'ENTRY_LEVEL',
    bio TEXT DEFAULT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Skills Master Table
CREATE TABLE skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL, -- TECHNICAL, SOFT, CERTIFICATION, METHODOLOGY
    description TEXT DEFAULT NULL,
    market_demand_score INT DEFAULT 50, -- 1 to 100
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_skill_name (name),
    INDEX idx_skill_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. User Skills Mapping Table
CREATE TABLE user_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency_level VARCHAR(30) NOT NULL DEFAULT 'INTERMEDIATE', -- BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    years_experience DECIMAL(4,1) DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_skill (user_id, skill_id),
    CONSTRAINT fk_user_skills_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    INDEX idx_user_skills_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Job Postings Table
CREATE TABLE job_postings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(100) NOT NULL,
    location VARCHAR(100) DEFAULT 'Remote',
    experience_level VARCHAR(50) NOT NULL, -- ENTRY_LEVEL, MID_LEVEL, SENIOR_LEVEL, LEAD
    salary_range VARCHAR(100) DEFAULT NULL,
    description TEXT NOT NULL,
    source_url VARCHAR(500) DEFAULT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    posted_date DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_job_title (title),
    INDEX idx_job_company (company),
    INDEX idx_job_experience (experience_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Job Required Skills Table
CREATE TABLE job_skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    importance_weight INT DEFAULT 5, -- Scale 1 to 10
    UNIQUE KEY uq_job_skill (job_id, skill_id),
    CONSTRAINT fk_job_skills_job FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE,
    CONSTRAINT fk_job_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    INDEX idx_job_skills_job (job_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Recommended Courses Table
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    provider VARCHAR(100) NOT NULL, -- Coursera, Udemy, edX, LinkedIn Learning, YouTube
    course_url VARCHAR(500) NOT NULL,
    duration_hours INT DEFAULT 10,
    difficulty VARCHAR(30) DEFAULT 'INTERMEDIATE', -- BEGINNER, INTERMEDIATE, ADVANCED
    cost_type VARCHAR(20) DEFAULT 'PAID', -- FREE, PAID
    rating DECIMAL(3,2) DEFAULT 4.5,
    primary_skill_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_courses_skill FOREIGN KEY (primary_skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    INDEX idx_course_skill (primary_skill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Gap Analysis Results Table
CREATE TABLE gap_analysis_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    target_job_title VARCHAR(150) NOT NULL,
    match_percentage DECIMAL(5,2) NOT NULL,
    matched_skills_count INT NOT NULL DEFAULT 0,
    missing_skills_count INT NOT NULL DEFAULT 0,
    missing_skills_json JSON NOT NULL, -- Detailed array of missing technical and soft skills
    recommendations_json JSON DEFAULT NULL, -- Courses and recommended actions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gap_analysis_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_gap_analysis_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
