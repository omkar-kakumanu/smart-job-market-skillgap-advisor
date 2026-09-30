package com.skillgap.advisor.config;

import com.skillgap.advisor.entity.*;
import com.skillgap.advisor.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final JobPostingRepository jobPostingRepository;
    private final JobSkillRepository jobSkillRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Verifying and seeding platform user accounts...");
        seedUsers();

        if (skillRepository.count() == 0) {
            log.info("Seeding initial skills, jobs, and courses data...");
            seedSkillsAndJobs();
            log.info("Database skills and jobs seeding completed successfully!");
        }
    }

    private void seedUsers() {
        // Professional Default Accounts for Smart Job Market Skill-Gap Advisor
        createOrUpdateUser("admin@skillgap.com", "System Administrator", "admin123", "System Administrator", "LEAD", Role.ROLE_ADMIN);
        createOrUpdateUser("admin@smartjobadvisor.com", "System Administrator", "admin123", "System Administrator", "LEAD", Role.ROLE_ADMIN);
        createOrUpdateUser("admin@copilot.com", "System Administrator", "admin123", "System Administrator", "LEAD", Role.ROLE_ADMIN);

        createOrUpdateUser("recruiter@skillgap.com", "Talent Acquisition Lead", "recruiter123", "Talent Acquisition Lead", "SENIOR_LEVEL", Role.ROLE_MANAGER);
        createOrUpdateUser("recruiter@smartjobadvisor.com", "Talent Acquisition Lead", "recruiter123", "Talent Acquisition Lead", "SENIOR_LEVEL", Role.ROLE_MANAGER);
        createOrUpdateUser("manager@skillgap.com", "Engineering Hiring Manager", "Password123!", "Engineering Hiring Manager", "SENIOR_LEVEL", Role.ROLE_MANAGER);
        createOrUpdateUser("recruiter@copilot.com", "Talent Acquisition Lead", "recruiter123", "Talent Acquisition Lead", "SENIOR_LEVEL", Role.ROLE_MANAGER);

        createOrUpdateUser("candidate@skillgap.com", "Candidate Applicant", "candidate123", "Full Stack Java Developer", "MID_LEVEL", Role.ROLE_USER);
        createOrUpdateUser("candidate@smartjobadvisor.com", "Candidate Applicant", "candidate123", "Full Stack Java Developer", "MID_LEVEL", Role.ROLE_USER);
        createOrUpdateUser("user@skillgap.com", "Alex Vance", "Password123!", "Full Stack Java Developer", "MID_LEVEL", Role.ROLE_USER);
        createOrUpdateUser("candidate@copilot.com", "Candidate Applicant", "candidate123", "Full Stack Java Developer", "MID_LEVEL", Role.ROLE_USER);
    }

    private void createOrUpdateUser(String email, String fullName, String rawPassword, String targetRole, String expLevel, Role role) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = User.builder()
                    .fullName(fullName)
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .targetCareerRole(targetRole)
                    .experienceLevel(expLevel)
                    .bio("Verified profile for " + fullName + ".")
                    .role(role)
                    .isActive(true)
                    .isVerified(true)
                    .build();
            userRepository.save(user);
            log.info("Seeded account: {} with role {}", email, role);
        } else {
            user.setFullName(fullName);
            user.setRole(role);
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
        }
    }

    private void seedSkillsAndJobs() {
        Skill java = Skill.builder().name("Java 21").category(SkillCategory.TECHNICAL).description("Core Java, OOPs, Streams, Concurrency").marketDemandScore(95).build();
        Skill springBoot = Skill.builder().name("Spring Boot").category(SkillCategory.TECHNICAL).description("Spring MVC, Security, Data JPA").marketDemandScore(92).build();
        Skill react = Skill.builder().name("ReactJS").category(SkillCategory.TECHNICAL).description("React Hooks, JSX, Context API").marketDemandScore(90).build();
        Skill mysql = Skill.builder().name("MySQL").category(SkillCategory.TECHNICAL).description("Relational database, SQL queries, indexing").marketDemandScore(88).build();
        Skill restApi = Skill.builder().name("RESTful APIs").category(SkillCategory.TECHNICAL).description("API design, OpenAPI/Swagger, JSON").marketDemandScore(94).build();
        Skill aws = Skill.builder().name("AWS").category(SkillCategory.TECHNICAL).description("EC2, S3, RDS, Cloud Architecture").marketDemandScore(88).build();
        Skill git = Skill.builder().name("Git").category(SkillCategory.TECHNICAL).description("Version control, GitHub, branching").marketDemandScore(92).build();

        skillRepository.saveAll(List.of(java, springBoot, react, mysql, restApi, aws, git));

        JobPosting job1 = JobPosting.builder()
                .title("Senior Full Stack Java Engineer")
                .company("TechCorp Solutions")
                .location("Remote")
                .experienceLevel("SENIOR_LEVEL")
                .salaryRange("$120,000 - $150,000")
                .description("Looking for a Senior Full Stack Engineer. Required: Java 21, Spring Boot, ReactJS, MySQL, AWS.")
                .sourceUrl("https://techcorp.jobs/senior-fullstack")
                .isActive(true)
                .postedDate(LocalDate.now())
                .build();

        JobPosting job2 = JobPosting.builder()
                .title("Backend Java Developer")
                .company("FinTech Dynamics")
                .location("Hybrid")
                .experienceLevel("MID_LEVEL")
                .salaryRange("$105,000 - $130,000")
                .description("Join our financial backend team. Required: Java 21, Spring Boot, RESTful APIs, MySQL.")
                .sourceUrl("https://fintechdynamics.com/careers/backend-dev")
                .isActive(true)
                .postedDate(LocalDate.now())
                .build();

        jobPostingRepository.saveAll(List.of(job1, job2));

        JobSkill js1 = JobSkill.builder().jobPosting(job1).skill(java).isRequired(true).importanceWeight(10).build();
        JobSkill js2 = JobSkill.builder().jobPosting(job1).skill(springBoot).isRequired(true).importanceWeight(10).build();
        JobSkill js3 = JobSkill.builder().jobPosting(job1).skill(react).isRequired(true).importanceWeight(9).build();
        JobSkill js4 = JobSkill.builder().jobPosting(job1).skill(aws).isRequired(true).importanceWeight(8).build();

        JobSkill js5 = JobSkill.builder().jobPosting(job2).skill(java).isRequired(true).importanceWeight(10).build();
        JobSkill js6 = JobSkill.builder().jobPosting(job2).skill(springBoot).isRequired(true).importanceWeight(10).build();
        JobSkill js7 = JobSkill.builder().jobPosting(job2).skill(mysql).isRequired(true).importanceWeight(9).build();

        jobSkillRepository.saveAll(List.of(js1, js2, js3, js4, js5, js6, js7));

        Course c1 = Course.builder().title("Mastering Java 21").provider("Coursera").courseUrl("https://coursera.org/search?query=java").durationHours(25).difficulty("ADVANCED").costType("PAID").rating(BigDecimal.valueOf(4.9)).primarySkill(java).build();
        Course c2 = Course.builder().title("Spring Boot 3 Masterclass").provider("Udemy").courseUrl("https://udemy.com/courses/search/?q=spring+boot").durationHours(35).difficulty("INTERMEDIATE").costType("PAID").rating(BigDecimal.valueOf(4.8)).primarySkill(springBoot).build();
        Course c3 = Course.builder().title("React 18 & Modern Web Development").provider("freeCodeCamp").courseUrl("https://youtube.com").durationHours(12).difficulty("BEGINNER").costType("FREE").rating(BigDecimal.valueOf(4.7)).primarySkill(react).build();

        courseRepository.saveAll(List.of(c1, c2, c3));
    }
}
