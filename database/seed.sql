-- Smart Job Market Skill-Gap Advisor Seed Data
USE skillgap_advisor;

-- Passwords hashed with BCrypt for 'password123': $2a$10$RKiEDpU.bagv/APXO.0GjOu5NyM9zln0uLbglrXhigow31/5PaXS.

-- 1. Users Seed
INSERT INTO users (id, full_name, email, password, profile_image_url, target_career_role, experience_level, bio, role, is_active, is_verified) VALUES
(1, 'System Administrator', 'admin@skillgap.com', '$2a$10$RKiEDpU.bagv/APXO.0GjOu5NyM9zln0uLbglrXhigow31/5PaXS.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'System Admin', 'LEAD', 'Administrator account for platform management.', 'ROLE_ADMIN', TRUE, TRUE),
(2, 'John Doe', 'john.doe@example.com', '$2a$10$RKiEDpU.bagv/APXO.0GjOu5NyM9zln0uLbglrXhigow31/5PaXS.', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'Full Stack Java Developer', 'MID_LEVEL', 'Passionate Java & React developer aiming for Senior Architect role.', 'ROLE_USER', TRUE, TRUE),
(3, 'Sarah Manager', 'sarah.manager@techcorp.com', '$2a$10$RKiEDpU.bagv/APXO.0GjOu5NyM9zln0uLbglrXhigow31/5PaXS.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Engineering Hiring Manager', 'SENIOR_LEVEL', 'Recruiting lead for Cloud & AI positions.', 'ROLE_MANAGER', TRUE, TRUE);

-- 2. Master Skills Seed
INSERT INTO skills (id, name, category, description, market_demand_score) VALUES
(1, 'Java 21', 'TECHNICAL', 'Core Java, OOPs, Streams, Concurrency, Virtual Threads', 95),
(2, 'Spring Boot', 'TECHNICAL', 'Spring MVC, Security, Data JPA, Microservices architecture', 92),
(3, 'ReactJS', 'TECHNICAL', 'React Hooks, Virtual DOM, JSX, Context API, Redux/Zustand', 90),
(4, 'MySQL', 'TECHNICAL', 'Relational database management, SQL queries, indexing, normalization', 88),
(5, 'Docker', 'TECHNICAL', 'Containerization, Dockerfile, Docker Compose, Image optimization', 89),
(6, 'Kubernetes', 'TECHNICAL', 'Container orchestration, Pods, Deployments, Services, Helm', 85),
(7, 'RESTful APIs', 'TECHNICAL', 'API design, OpenAPI/Swagger, HTTP status codes, JSON handling', 94),
(8, 'TypeScript', 'TECHNICAL', 'Strongly typed JavaScript, Interfaces, Generics', 87),
(9, 'Python', 'TECHNICAL', 'General purpose language, Data analysis, Machine Learning basics', 91),
(10, 'AWS (Amazon Web Services)', 'TECHNICAL', 'EC2, S3, RDS, Lambda, CloudWatch, IAM Security', 88),
(11, 'Agile & Scrum', 'METHODOLOGY', 'Sprint planning, Standups, JIRA, Kanban boards', 80),
(12, 'Problem Solving & Algorithms', 'SOFT', 'Data structures, algorithmic complexity, logical reasoning', 96),
(13, 'System Design', 'TECHNICAL', 'High availability, Load Balancing, Caching, Database sharding', 89),
(14, 'Git & Version Control', 'TECHNICAL', 'Branching strategies, Merge conflicts, GitHub actions CI/CD', 92),
(15, 'Communication & Collaboration', 'SOFT', 'Cross-functional teamwork, documentation, client presentation', 85),
(16, 'AWS Certified Solutions Architect', 'CERTIFICATION', 'Official Amazon Web Services Cloud Architecture certification', 82),
(17, 'Certified Kubernetes Application Developer (CKAD)', 'CERTIFICATION', 'Cloud Native Computing Foundation official certification', 78),
(18, 'Oracle Certified Professional Java SE 21', 'CERTIFICATION', 'Official Oracle Java SE 21 Developer certification', 75);

-- 3. User Skills Seed (John Doe's current skills)
INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience) VALUES
(2, 1, 'ADVANCED', 3.5),     -- Java 21
(2, 2, 'INTERMEDIATE', 2.0), -- Spring Boot
(2, 3, 'ADVANCED', 3.0),     -- ReactJS
(2, 4, 'INTERMEDIATE', 2.5), -- MySQL
(2, 7, 'ADVANCED', 3.5),     -- RESTful APIs
(2, 14, 'ADVANCED', 4.0),    -- Git
(2, 15, 'ADVANCED', 3.0);    -- Communication

-- 4. Job Postings Seed
INSERT INTO job_postings (id, title, company, location, experience_level, salary_range, description, source_url) VALUES
(1, 'Senior Full Stack Java Engineer', 'TechCorp Solutions', 'Remote / New York', 'SENIOR_LEVEL', '$120,000 - $150,000', 'We are looking for a Senior Full Stack Engineer to lead our enterprise cloud applications team. Required skills: Java 21, Spring Boot, ReactJS, Docker, AWS, System Design.', 'https://techcorp.jobs/senior-fullstack'),
(2, 'Backend Microservices Developer', 'FinTech Dynamics', 'San Francisco, CA (Hybrid)', 'MID_LEVEL', '$105,000 - $130,000', 'Join our high-throughput financial transaction processing engine team. Required skills: Java 21, Spring Boot, RESTful APIs, MySQL, Docker, Kubernetes.', 'https://fintechdynamics.com/careers/backend-dev'),
(3, 'Cloud Native DevOps Engineer', 'CloudScale Inc.', 'Remote', 'MID_LEVEL', '$110,000 - $140,000', 'Responsible for modernizing deployment pipelines and managing Kubernetes clusters. Required: Docker, Kubernetes, AWS, Git, System Design.', 'https://cloudscale.io/jobs/devops');

-- 5. Job Required Skills Seed
INSERT INTO job_skills (job_id, skill_id, is_required, importance_weight) VALUES
-- Job 1 Skills
(1, 1, TRUE, 10), -- Java 21
(1, 2, TRUE, 10), -- Spring Boot
(1, 3, TRUE, 9),  -- ReactJS
(1, 4, TRUE, 8),  -- MySQL
(1, 5, TRUE, 8),  -- Docker
(1, 10, TRUE, 9), -- AWS
(1, 13, TRUE, 9), -- System Design
(1, 14, TRUE, 7), -- Git
-- Job 2 Skills
(2, 1, TRUE, 10), -- Java 21
(2, 2, TRUE, 10), -- Spring Boot
(2, 4, TRUE, 9),  -- MySQL
(2, 5, TRUE, 8),  -- Docker
(2, 6, TRUE, 8),  -- Kubernetes
(2, 7, TRUE, 9),  -- RESTful APIs
-- Job 3 Skills
(3, 5, TRUE, 10), -- Docker
(3, 6, TRUE, 10), -- Kubernetes
(3, 10, TRUE, 10),-- AWS
(3, 13, TRUE, 9), -- System Design
(3, 14, TRUE, 8); -- Git

-- 6. Courses Seed
INSERT INTO courses (id, title, provider, course_url, duration_hours, difficulty, cost_type, rating, primary_skill_id) VALUES
(1, 'Mastering Java 21 & Virtual Threads', 'Coursera', 'https://www.coursera.org/search?query=java%2021', 25, 'ADVANCED', 'PAID', 4.9, 1),
(2, 'Spring Boot 3 & Spring Security Enterprise Masterclass', 'Udemy', 'https://www.udemy.com/courses/search/?q=spring+boot+3', 35, 'INTERMEDIATE', 'PAID', 4.8, 2),
(3, 'Ultimate Docker & Kubernetes Hands-on Bootcamp', 'Udemy', 'https://www.udemy.com/courses/search/?q=docker+kubernetes', 20, 'INTERMEDIATE', 'PAID', 4.9, 5),
(4, 'AWS Certified Solutions Architect Associate 2026', 'AWS Training', 'https://aws.amazon.com/certification/certified-solutions-architect-associate/', 40, 'INTERMEDIATE', 'PAID', 4.9, 10),
(5, 'System Design Interview & High Scalability Architectures', 'Educative.io', 'https://www.educative.io/courses/grokking-modern-system-design-interview-for-engineers-managers', 30, 'ADVANCED', 'PAID', 4.8, 13),
(6, 'React 18 & Modern Web Development', 'freeCodeCamp', 'https://www.youtube.com/watch?v=bMknfKXIFA8', 12, 'BEGINNER', 'FREE', 4.7, 3);

-- 7. Gap Analysis Results Seed (Sample for John Doe)
INSERT INTO gap_analysis_results (user_id, target_job_title, match_percentage, matched_skills_count, missing_skills_count, missing_skills_json, recommendations_json) VALUES
(2, 'Senior Full Stack Java Engineer', 62.50, 5, 3, 
'[{"skillName": "AWS (Amazon Web Services)", "category": "TECHNICAL", "importance": 9}, {"skillName": "Docker", "category": "TECHNICAL", "importance": 8}, {"skillName": "System Design", "category": "TECHNICAL", "importance": 9}]',
'[{"courseTitle": "Ultimate Docker & Kubernetes Hands-on Bootcamp", "provider": "Udemy", "url": "https://www.udemy.com/courses/search/?q=docker+kubernetes"}, {"courseTitle": "AWS Certified Solutions Architect Associate 2026", "provider": "AWS Training", "url": "https://aws.amazon.com/certification/certified-solutions-architect-associate/"}]');

