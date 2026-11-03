// Enterprise Master Data & Account Recovery Engine (Infosys Enterprise Standard)
// Restores all user accounts, candidate profiles, resumes, skill requests, jobs, and interview telemetry.

import { DEFAULT_USER_PASSWORDS, EMAIL_ALIASES_MAP, PROTECTED_MAIN_ADMIN_EMAILS } from '../context/AuthContext';

export const MASTER_ACCOUNTS = [
  {
    fullName: 'System Administrator',
    email: 'admin@skillgap.com',
    role: 'ROLE_ADMIN',
    targetCareerRole: 'Platform Administrator & Governance Lead',
    experienceLevel: 'LEAD',
    department: 'Enterprise Cloud Infrastructure',
    bio: 'Root system administrator with platform governance authority, user access approvals, and candidate promotion privileges.',
    approvalStatus: 'APPROVED',
    isApproved: true,
    isProfileLocked: false,
    skills: [
      { skillName: 'Java 21', category: 'Backend', proficiencyLevel: 'EXPERT', yearsExperience: 8 },
      { skillName: 'Spring Security 6', category: 'Security', proficiencyLevel: 'EXPERT', yearsExperience: 6 },
      { skillName: 'Kubernetes', category: 'DevOps', proficiencyLevel: 'EXPERT', yearsExperience: 6 },
      { skillName: 'AWS Cloud', category: 'Cloud', proficiencyLevel: 'EXPERT', yearsExperience: 7 }
    ]
  },
  {
    fullName: 'Executive System Admin',
    email: 'admin@smartjobadvisor.com',
    role: 'ROLE_ADMIN',
    targetCareerRole: 'Platform Governance Lead',
    experienceLevel: 'LEAD',
    department: 'Global Security & Operations',
    bio: 'Executive administrator account with master governance authority.',
    approvalStatus: 'APPROVED',
    isApproved: true,
    isProfileLocked: false,
    skills: [
      { skillName: 'Spring Boot 3', category: 'Backend', proficiencyLevel: 'EXPERT', yearsExperience: 7 },
      { skillName: 'Enterprise Architecture', category: 'Architecture', proficiencyLevel: 'EXPERT', yearsExperience: 8 }
    ]
  },
  {
    fullName: 'Senior Technical Recruiter',
    email: 'manager@skillgap.com',
    role: 'ROLE_RECRUITER',
    targetCareerRole: 'Senior Technical Recruiter',
    experienceLevel: 'SENIOR_LEVEL',
    department: 'Global Talent Acquisition',
    bio: 'Senior talent acquisition officer evaluating candidate technical assessments, ATS rankings, and skill endorsements.',
    approvalStatus: 'APPROVED',
    isApproved: true,
    isProfileLocked: false,
    skills: [
      { skillName: 'Talent Acquisition', category: 'Management', proficiencyLevel: 'EXPERT', yearsExperience: 6 },
      { skillName: 'Technical Interviewing', category: 'Evaluation', proficiencyLevel: 'EXPERT', yearsExperience: 6 }
    ]
  },
  {
    fullName: 'Talent Acquisition Partner',
    email: 'recruiter@skillgap.com',
    role: 'ROLE_RECRUITER',
    targetCareerRole: 'Talent Acquisition Lead',
    experienceLevel: 'SENIOR_LEVEL',
    department: 'Engineering Hiring Division',
    bio: 'Talent partner conducting candidate evaluations and reviewing technical competency endorsements.',
    approvalStatus: 'APPROVED',
    isApproved: true,
    isProfileLocked: false,
    skills: [
      { skillName: 'Technical Screening', category: 'Evaluation', proficiencyLevel: 'EXPERT', yearsExperience: 5 }
    ]
  },
  {
    fullName: 'Alex Mercer (Candidate)',
    email: 'user@skillgap.com',
    role: 'ROLE_USER',
    targetCareerRole: 'Full Stack Java Developer',
    experienceLevel: 'MID_LEVEL',
    bio: 'Senior Full Stack Java Engineer with 4.5+ years of verified production experience across Spring Boot 3 microservices and modern React UI architectures.',
    approvalStatus: 'APPROVED',
    isApproved: true,
    isProfileLocked: false,
    atsScore: 94,
    skillMatchScore: 92,
    interviewScore: 90,
    voiceScore: 88,
    skills: [
      { skillName: 'Java 21', category: 'Backend', proficiencyLevel: 'ADVANCED', yearsExperience: 4.5 },
      { skillName: 'Spring Boot 3', category: 'Backend', proficiencyLevel: 'ADVANCED', yearsExperience: 4.0 },
      { skillName: 'React', category: 'Frontend', proficiencyLevel: 'ADVANCED', yearsExperience: 3.5 },
      { skillName: 'PostgreSQL', category: 'Database', proficiencyLevel: 'ADVANCED', yearsExperience: 3.5 },
      { skillName: 'Docker', category: 'DevOps', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 3.0 },
      { skillName: 'AWS Cloud', category: 'Cloud', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 2.5 }
    ]
  },
  {
    fullName: 'Verified Candidate',
    email: 'candidate@skillgap.com',
    role: 'ROLE_USER',
    targetCareerRole: 'Full Stack Java Developer',
    experienceLevel: 'MID_LEVEL',
    bio: 'Candidate undergoing competency evaluations and technical interview screening.',
    approvalStatus: 'APPROVED',
    isApproved: true,
    isProfileLocked: false,
    atsScore: 91,
    skillMatchScore: 88,
    interviewScore: 86,
    voiceScore: 85,
    skills: [
      { skillName: 'Java 21', category: 'Backend', proficiencyLevel: 'ADVANCED', yearsExperience: 3.5 },
      { skillName: 'Spring Boot 3', category: 'Backend', proficiencyLevel: 'ADVANCED', yearsExperience: 3.0 },
      { skillName: 'ReactJS', category: 'Frontend', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 2.5 }
    ]
  }
];

export const MASTER_CANDIDATES = {
  'devansh.verma@example.com': {
    fullName: 'Devansh Verma',
    email: 'devansh.verma@example.com',
    targetCareerRole: 'Full Stack Java Developer',
    experienceLevel: 'SENIOR_LEVEL',
    bio: 'Senior Full Stack Engineer with 7+ years architecting reactive microservices with Java 21, Spring Boot 3, and React 19.',
    resumeName: 'Devansh_Verma_Enterprise_Architect.pdf',
    isProfileLocked: true,
    approvalStatus: 'APPROVED',
    isApproved: true,
    role: 'ROLE_USER',
    atsScore: 96,
    skillMatchScore: 94,
    interviewScore: 95,
    voiceScore: 92,
    skills: [
      { skillName: 'Java 21', category: 'Backend', proficiencyLevel: 'EXPERT', yearsExperience: 7 },
      { skillName: 'Spring Boot 3', category: 'Backend', proficiencyLevel: 'EXPERT', yearsExperience: 6 },
      { skillName: 'React', category: 'Frontend', proficiencyLevel: 'ADVANCED', yearsExperience: 5 },
      { skillName: 'Docker', category: 'DevOps', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
      { skillName: 'Kubernetes', category: 'DevOps', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 3 },
      { skillName: 'PostgreSQL', category: 'Database', proficiencyLevel: 'ADVANCED', yearsExperience: 5 }
    ],
    submissionDate: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    certStatus: 'APPROVED',
    voiceRecords: [
      {
        id: 'v-dev-1',
        question: 'Explain how you design high-throughput microservices using Spring Boot and how you handle distributed caching.',
        transcript: 'In our architecture, we decomposed monoliths into event-driven Spring Boot 3 microservices communicating via Kafka. For caching, we configured multi-tier Redis with TTL-based eviction and Redis Sentinel high availability. We applied resilient circuit breaking using Resilience4j and optimized connection pools with HikariCP, achieving sub-25ms p99 latency.',
        durationSeconds: 62,
        overall: 94,
        clarity: 96,
        fluency: 92,
        technicalDepth: 95,
        detectedKeywords: ['spring boot', 'microservices', 'redis', 'caching', 'concurrency', 'kafka'],
        recommendation: 'EXCEPTIONAL FIT - SENIOR ARCHITECT',
        feedback: 'Superior articulation of distributed microservice architecture, caching eviction policies, and connection pool sizing.',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: 'v-dev-2',
        question: 'Describe an instance where you identified and resolved a severe database performance bottleneck in production.',
        transcript: 'We had sudden CPU spikes on PostgreSQL during morning traffic surges. Using pg_stat_statements and EXPLAIN ANALYZE, I identified missing composite indexes on customer order queries resulting in full sequential table scans across 15 million rows. We created partial indexes concurrently and tuned work_mem, reducing query response times by 85%.',
        durationSeconds: 58,
        overall: 92,
        clarity: 93,
        fluency: 91,
        technicalDepth: 94,
        detectedKeywords: ['indexing', 'query optimization', 'latency', 'postgres', 'explain analyze'],
        recommendation: 'STRONGLY RECOMMENDED',
        feedback: 'Methodical diagnostic workflow referencing execution plans and zero-downtime concurrent index creation.',
        timestamp: new Date(Date.now() - 3600000 * 72).toISOString()
      }
    ],
    interviewAttempts: [
      {
        id: 'att-dev-1',
        candidateName: 'Devansh Verma',
        candidateEmail: 'devansh.verma@example.com',
        role: 'Full Stack Java Developer',
        attemptNumber: 1,
        completedQuestions: 10,
        totalQuestions: 10,
        avgClarity: 96,
        avgRelevance: 95,
        overallScore: 95,
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 3600000 * 36).toISOString(),
        responses: [
          {
            questionId: 1,
            question: 'In Java memory architecture, where are static variables stored in Java 8 and later versions?',
            questionType: 'objective',
            answer: 'B) Metaspace (Native Memory)',
            isCorrect: true,
            clarity: 100,
            relevance: 100,
            overall: 100,
            feedback: 'Correct! In Java 8+, PermGen was replaced by Metaspace residing in native OS memory.'
          },
          {
            questionId: 2,
            question: "According to Brewer's CAP Theorem, in the presence of a network partition (P), what trade-off must a distributed database system make?",
            questionType: 'objective',
            answer: 'B) Choose between Consistency (CP) and Availability (AP)',
            isCorrect: true,
            clarity: 100,
            relevance: 100,
            overall: 100,
            feedback: 'Correct! When network partitions happen, systems choose between strict consistency or availability.'
          },
          {
            questionId: 3,
            question: 'Which HTTP status code is designated by RFC 6585 when a client has exceeded its allowed rate limit quota?',
            questionType: 'objective',
            answer: 'C) 429 Too Many Requests',
            isCorrect: true,
            clarity: 100,
            relevance: 100,
            overall: 100,
            feedback: 'Correct! HTTP 429 indicates client rate-limiting quota exceeded.'
          },
          {
            questionId: 4,
            question: 'Which ANSI SQL transaction isolation level guarantees complete prevention of dirty reads, non-repeatable reads, and phantom reads?',
            questionType: 'objective',
            answer: 'C) Serializable',
            isCorrect: true,
            clarity: 100,
            relevance: 100,
            overall: 100,
            feedback: 'Correct! Serializable eliminates all anomalies through serial equivalent execution.'
          },
          {
            questionId: 5,
            question: 'In Apache Kafka distributed event streaming, what mechanism guarantees strict message ordering?',
            questionType: 'objective',
            answer: 'B) Publishing messages with the same partition key within a single partition',
            isCorrect: true,
            clarity: 100,
            relevance: 100,
            overall: 100,
            feedback: 'Correct! Kafka partition key hashing ensures sequential ordering per partition.'
          },
          {
            questionId: 6,
            question: 'Explain how Java 21 Virtual Threads differ from traditional OS platform threads, and describe how they impact high-throughput web server performance.',
            questionType: 'descriptive',
            answer: 'Java 21 Virtual Threads are lightweight user-mode threads managed by the JVM runtime rather than 1:1 OS kernel threads. While platform threads require 1MB stack memory and costly kernel context switching, Virtual Threads occupy only a few hundred bytes and unmount from carrier threads when blocking on I/O. This allows millions of concurrent requests without thread starvation.',
            isCorrect: true,
            clarity: 98,
            relevance: 97,
            overall: 98,
            feedback: 'Outstanding explanation covering JVM carrier threads, continuation unmounting, and memory scaling.'
          },
          {
            questionId: 7,
            question: 'Describe how the Spring Boot @Transactional annotation operates internally under default proxy mode. Detail two common pitfalls.',
            questionType: 'descriptive',
            answer: 'Spring creates a dynamic CGLIB or JDK dynamic proxy that intercepts method calls, opens a transaction via PlatformTransactionManager, and commits or rolls back based on exceptions. Pitfall 1: Calling a @Transactional method from within the same class bypasses the proxy (self-invocation). Pitfall 2: Checked exceptions do not trigger rollback by default unless rollbackFor = Exception.class is declared.',
            isCorrect: true,
            clarity: 96,
            relevance: 95,
            overall: 96,
            feedback: 'Precise analysis of proxy interception, self-invocation bypass, and rollback exception rules.'
          },
          {
            questionId: 8,
            question: 'Design an end-to-end distributed transaction architecture for an e-commerce order checkout using the Saga Pattern.',
            questionType: 'descriptive',
            answer: 'We utilize an Orchestrated Saga with Temporal or Kafka. The Order Service emits OrderCreated, which triggers Payment Service. If payment succeeds, Inventory Service reserves stock. If inventory reservation fails, compensating transactions are published to refund payment and mark order failed, ensuring eventual consistency.',
            isCorrect: true,
            clarity: 94,
            relevance: 95,
            overall: 94,
            feedback: 'Solid orchestrated saga blueprint with explicit compensating actions and eventual consistency guarantees.'
          },
          {
            questionId: 9,
            question: 'Explain the internal architecture of Redis caching, explaining eviction policies (LRU vs LFU) and preventing cache stampede.',
            questionType: 'descriptive',
            answer: 'Redis operates as an in-memory single-threaded event loop utilizing epoll/kqueue. Eviction policies: allkeys-lru removes least recently accessed keys, while allkeys-lfu tracks access frequency. To mitigate cache stampede, we combine probabilistic early expiration (XFetch algorithm) with distributed locks (Redisson) ensuring only one worker queries the primary database.',
            isCorrect: true,
            clarity: 95,
            relevance: 94,
            overall: 95,
            feedback: 'Comprehensive coverage of event-loop concurrency, LRU/LFU comparison, and stampede mitigation.'
          },
          {
            questionId: 10,
            question: 'Architect a secure JWT stateless authentication system for React frontend and Spring Security 6 backend.',
            questionType: 'descriptive',
            answer: 'We issue short-lived JWT access tokens (15m) and long-lived refresh tokens (7d) stored in HttpOnly, Secure, SameSite=Strict cookies to prevent XSS. Spring Security 6 configures a SecurityFilterChain with OncePerRequestFilter for Bearer token validation and automatic token refresh interceptors.',
            isCorrect: true,
            clarity: 94,
            relevance: 96,
            overall: 95,
            feedback: 'Industry-standard security pattern properly addressing XSS and CSRF prevention.'
          }
        ]
      }
    ]
  },
  'sarah.jenkins@talentcorp.io': {
    fullName: 'Sarah Jenkins',
    email: 'sarah.jenkins@talentcorp.io',
    targetCareerRole: 'Cloud Native DevOps Engineer',
    experienceLevel: 'MID_LEVEL',
    bio: 'DevOps and Infrastructure Specialist with deep focus on Kubernetes orchestration, Terraform automation, and AWS architectures.',
    resumeName: 'Sarah_Jenkins_DevOps_Specialist.pdf',
    isProfileLocked: true,
    approvalStatus: 'APPROVED',
    isApproved: true,
    role: 'ROLE_USER',
    atsScore: 92,
    skillMatchScore: 91,
    interviewScore: 89,
    voiceScore: 94,
    skills: [
      { skillName: 'Kubernetes', category: 'DevOps', proficiencyLevel: 'EXPERT', yearsExperience: 4 },
      { skillName: 'AWS Cloud', category: 'Cloud', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
      { skillName: 'Terraform', category: 'DevOps', proficiencyLevel: 'ADVANCED', yearsExperience: 3 },
      { skillName: 'CI/CD Pipelines', category: 'DevOps', proficiencyLevel: 'EXPERT', yearsExperience: 4 },
      { skillName: 'Docker', category: 'DevOps', proficiencyLevel: 'EXPERT', yearsExperience: 4 }
    ],
    submissionDate: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    certStatus: 'PENDING_APPROVAL',
    voiceRecords: [
      {
        id: 'v-sarah-1',
        question: 'How do you structure CI/CD deployment pipelines using Docker, Kubernetes, and automated test suites?',
        transcript: 'I implement multi-stage Docker builds to keep images below 80MB. In GitHub Actions, code triggers SonarQube static analysis, integration tests, and Trivy vulnerability scanning. Approved images are pushed to AWS ECR and deployed via ArgoCD using automated canary rollouts with Prometheus metric analysis.',
        durationSeconds: 52,
        overall: 94,
        clarity: 95,
        fluency: 93,
        technicalDepth: 94,
        detectedKeywords: ['docker', 'kubernetes', 'ci/cd', 'helm', 'zero-downtime', 'argocd'],
        recommendation: 'STRONGLY RECOMMENDED FOR CLOUD ARCHITECT',
        feedback: 'Concise GitOps pipeline strategy detailing automated vulnerability scanning and progressive canary delivery.',
        timestamp: new Date(Date.now() - 3600000 * 50).toISOString()
      }
    ],
    interviewAttempts: [
      {
        id: 'att-sarah-1',
        candidateName: 'Sarah Jenkins',
        candidateEmail: 'sarah.jenkins@talentcorp.io',
        role: 'Cloud Native DevOps Engineer',
        attemptNumber: 1,
        completedQuestions: 10,
        totalQuestions: 10,
        avgClarity: 89,
        avgRelevance: 89,
        overallScore: 89,
        status: 'COMPLETED',
        timestamp: new Date(Date.now() - 3600000 * 40).toISOString(),
        responses: [
          {
            questionId: 1,
            question: 'Which Kubernetes workload controller is specifically designed to run exactly one copy of a Pod on every node?',
            questionType: 'objective',
            answer: 'B) DaemonSet',
            isCorrect: true,
            clarity: 100,
            relevance: 100,
            overall: 100,
            feedback: 'Correct! DaemonSets guarantee a single Pod replica per cluster node.'
          }
        ]
      }
    ]
  },
  'priya.sharma@aimodels.io': {
    fullName: 'Priya Sharma',
    email: 'priya.sharma@aimodels.io',
    targetCareerRole: 'MLOps & Machine Learning Systems Engineer',
    experienceLevel: 'SENIOR_LEVEL',
    bio: 'Machine Learning systems engineer specializing in LLM inference pipelines, PyTorch modeling, and scalable vector store infrastructure.',
    resumeName: 'Priya_Sharma_MLOps_Architect.pdf',
    isProfileLocked: true,
    approvalStatus: 'APPROVED',
    isApproved: true,
    role: 'ROLE_USER',
    atsScore: 95,
    skillMatchScore: 93,
    interviewScore: 92,
    voiceScore: 88,
    skills: [
      { skillName: 'Python', category: 'Data & AI', proficiencyLevel: 'EXPERT', yearsExperience: 6 },
      { skillName: 'Machine Learning', category: 'Data & AI', proficiencyLevel: 'EXPERT', yearsExperience: 5 },
      { skillName: 'PyTorch', category: 'Data & AI', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
      { skillName: 'Docker', category: 'DevOps', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
      { skillName: 'PostgreSQL', category: 'Database', proficiencyLevel: 'ADVANCED', yearsExperience: 4 }
    ],
    submissionDate: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    certStatus: 'APPROVED',
    voiceRecords: [
      {
        id: 'v-priya-1',
        question: 'Explain how you design high-throughput microservices and handle distributed caching and inference pipelines.',
        transcript: 'For real-time ML inference, I deploy Triton Inference Server or FastAPI microservices with ONNX runtime acceleration and GPU batching. We cache embeddings in Redis and Milvus vector databases, keeping semantic similarity lookup latency under 12ms under heavy concurrency.',
        durationSeconds: 48,
        overall: 88,
        clarity: 90,
        fluency: 87,
        technicalDepth: 91,
        detectedKeywords: ['fastapi', 'onnx', 'vector database', 'redis', 'caching', 'concurrency'],
        recommendation: 'RECOMMENDED - STRONG ML SYSTEMS COMPETENCY',
        feedback: 'Clear technical architecture detailing ONNX GPU runtime acceleration and vector cache strategies.',
        timestamp: new Date(Date.now() - 3600000 * 60).toISOString()
      }
    ],
    interviewAttempts: []
  },
  'rohan.mehta@cloudhire.io': {
    fullName: 'Rohan Mehta',
    email: 'rohan.mehta@cloudhire.io',
    targetCareerRole: 'Cloud Native DevOps Engineer',
    experienceLevel: 'ENTRY_LEVEL',
    bio: 'Junior DevOps engineer with experience in Docker containerization, Linux administration, and GitHub Actions CI pipelines, seeking admission to platform programs.',
    resumeName: 'Rohan_Mehta_DevOps_Resume.pdf',
    isProfileLocked: false,
    approvalStatus: 'PENDING_APPROVAL',
    isApproved: false,
    role: 'ROLE_USER',
    atsScore: 84,
    skillMatchScore: 82,
    interviewScore: 80,
    voiceScore: 82,
    skills: [
      { skillName: 'Docker', category: 'DevOps', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 2 },
      { skillName: 'Linux', category: 'DevOps', proficiencyLevel: 'ADVANCED', yearsExperience: 2 },
      { skillName: 'CI/CD Pipelines', category: 'DevOps', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 1 }
    ],
    submissionDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    certStatus: 'NOT_REQUESTED',
    voiceRecords: [],
    interviewAttempts: []
  },
  'alex.vance@candidate.io': {
    fullName: 'Alex Vance',
    email: 'alex.vance@candidate.io',
    targetCareerRole: 'Frontend React Architect',
    experienceLevel: 'MID_LEVEL',
    bio: 'Specialist in modern frontend engineering, Next.js, reactive state modeling, and enterprise design systems.',
    resumeName: 'Alex_Vance_Frontend_Resume.pdf',
    isProfileLocked: false,
    approvalStatus: 'APPROVED',
    isApproved: true,
    role: 'ROLE_USER',
    atsScore: 86,
    skillMatchScore: 88,
    interviewScore: 84,
    voiceScore: 86,
    skills: [
      { skillName: 'React', category: 'Frontend', proficiencyLevel: 'ADVANCED', yearsExperience: 4 },
      { skillName: 'TypeScript', category: 'Frontend', proficiencyLevel: 'ADVANCED', yearsExperience: 3 },
      { skillName: 'Next.js', category: 'Frontend', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 2 },
      { skillName: 'Tailwind CSS', category: 'Frontend', proficiencyLevel: 'EXPERT', yearsExperience: 4 }
    ],
    submissionDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    certStatus: 'NOT_REQUESTED',
    voiceRecords: [],
    interviewAttempts: []
  },
  'user@skillgap.com': {
    fullName: 'Alex Mercer (Candidate)',
    email: 'user@skillgap.com',
    targetCareerRole: 'Full Stack Java Developer',
    experienceLevel: 'MID_LEVEL',
    bio: 'Senior Full Stack Java Engineer with 4.5+ years of verified production experience across Spring Boot 3 microservices and modern React UI architectures.',
    resumeName: 'Alex_Mercer_FullStack_Resume.pdf',
    isProfileLocked: false,
    approvalStatus: 'APPROVED',
    isApproved: true,
    role: 'ROLE_USER',
    atsScore: 94,
    skillMatchScore: 92,
    interviewScore: 90,
    voiceScore: 88,
    skills: [
      { skillName: 'Java 21', category: 'Backend', proficiencyLevel: 'ADVANCED', yearsExperience: 4.5 },
      { skillName: 'Spring Boot 3', category: 'Backend', proficiencyLevel: 'ADVANCED', yearsExperience: 4.0 },
      { skillName: 'React', category: 'Frontend', proficiencyLevel: 'ADVANCED', yearsExperience: 3.5 },
      { skillName: 'PostgreSQL', category: 'Database', proficiencyLevel: 'ADVANCED', yearsExperience: 3.5 },
      { skillName: 'Docker', category: 'DevOps', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 3.0 },
      { skillName: 'AWS Cloud', category: 'Cloud', proficiencyLevel: 'INTERMEDIATE', yearsExperience: 2.5 }
    ],
    submissionDate: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    certStatus: 'APPROVED',
    voiceRecords: [],
    interviewAttempts: []
  }
};

export const MASTER_SKILL_REQUESTS = [
  {
    id: 'skill_req_101',
    candidateEmail: 'devansh.verma@example.com',
    candidateName: 'Devansh Verma',
    targetCareerRole: 'Full Stack Java Developer',
    skillName: 'Apache Kafka Event Streams',
    category: 'Backend',
    proficiencyLevel: 'ADVANCED',
    yearsExperience: 2.5,
    justification: 'Architected distributed event messaging with Kafka clusters and Spring Cloud Stream in high-throughput telemetry.',
    status: 'PENDING_APPROVAL',
    requestedAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'skill_req_102',
    candidateEmail: 'user@skillgap.com',
    candidateName: 'Alex Mercer',
    targetCareerRole: 'Full Stack Java Developer',
    skillName: 'GraphQL & Apollo Federation',
    category: 'Frontend',
    proficiencyLevel: 'INTERMEDIATE',
    yearsExperience: 1.5,
    justification: 'Completed production schema stitching and Spring Boot GraphQL API gateway for microservices.',
    status: 'PENDING_APPROVAL',
    requestedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'skill_req_103',
    candidateEmail: 'candidate@skillgap.com',
    candidateName: 'Candidate Applicant',
    targetCareerRole: 'Full Stack Java Developer',
    skillName: 'Kubernetes Cluster Management',
    category: 'DevOps',
    proficiencyLevel: 'ADVANCED',
    yearsExperience: 3.0,
    justification: 'Certified Kubernetes Administrator (CKA). Managed multi-node cluster deployments with Helm charts and zero-downtime rolling updates.',
    status: 'APPROVED',
    approvedBy: 'Administrator Review Board',
    approvedDate: new Date(Date.now() - 3600000 * 48).toISOString(),
    requestedAt: new Date(Date.now() - 3600000 * 72).toISOString()
  },
  {
    id: 'skill_req_104',
    candidateEmail: 'priya.sharma@aimodels.io',
    candidateName: 'Priya Sharma',
    targetCareerRole: 'MLOps & Machine Learning Systems Engineer',
    skillName: 'LangChain & Vector Databases',
    category: 'AI_ML',
    proficiencyLevel: 'EXPERT',
    yearsExperience: 2.0,
    justification: 'Implemented production RAG architectures using Milvus vector stores, Hybrid search, and vLLM acceleration.',
    status: 'PENDING_APPROVAL',
    requestedAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

export const MASTER_CERT_REQUESTS = [
  {
    id: 'cert_req_1',
    candidateEmail: 'devansh.verma@example.com',
    candidateName: 'Devansh Verma',
    targetCareerRole: 'Full Stack Java Developer',
    certTitle: 'Certified Enterprise Java & Cloud Architect',
    themeStyle: 'gold',
    status: 'APPROVED',
    approvedDate: new Date(Date.now() - 3600000 * 24).toISOString(),
    approvedBy: 'Platform Governance Board',
    verificationCode: 'SKG-2026-AUTH-9821',
    skills: [
      { name: 'Java 21', skillName: 'Java 21', category: 'BACKEND', proficiency: 'EXPERT', proficiencyLevel: 'EXPERT', years: 5.0 },
      { name: 'Spring Boot 3', skillName: 'Spring Boot 3', category: 'BACKEND', proficiency: 'EXPERT', proficiencyLevel: 'EXPERT', years: 4.5 },
      { name: 'PostgreSQL', skillName: 'PostgreSQL', category: 'DATABASE', proficiency: 'ADVANCED', proficiencyLevel: 'ADVANCED', years: 4.0 },
      { name: 'Docker', skillName: 'Docker', category: 'CLOUD_DEVOPS', proficiency: 'ADVANCED', proficiencyLevel: 'ADVANCED', years: 3.5 },
      { name: 'AWS Cloud', skillName: 'AWS Cloud', category: 'CLOUD_DEVOPS', proficiency: 'ADVANCED', proficiencyLevel: 'ADVANCED', years: 3.0 }
    ],
    requestedAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'cert_req_2',
    candidateEmail: 'sarah.jenkins@talentcorp.io',
    candidateName: 'Sarah Jenkins',
    targetCareerRole: 'Cloud Native DevOps Engineer',
    certTitle: 'Certified Cloud Native Infrastructure Specialist',
    themeStyle: 'emerald',
    status: 'PENDING_APPROVAL',
    verificationCode: 'SKG-2026-PENDING-REVIEW',
    skills: [
      { name: 'Kubernetes', skillName: 'Kubernetes', category: 'CLOUD_DEVOPS', proficiency: 'EXPERT', proficiencyLevel: 'EXPERT', years: 4.0 },
      { name: 'Terraform', skillName: 'Terraform', category: 'CLOUD_DEVOPS', proficiency: 'ADVANCED', proficiencyLevel: 'ADVANCED', years: 3.0 },
      { name: 'Docker', skillName: 'Docker', category: 'CLOUD_DEVOPS', proficiency: 'EXPERT', proficiencyLevel: 'EXPERT', years: 4.0 },
      { name: 'AWS Cloud', skillName: 'AWS Cloud', category: 'CLOUD_DEVOPS', proficiency: 'ADVANCED', proficiencyLevel: 'ADVANCED', years: 3.5 }
    ],
    requestedAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 'cert_req_3',
    candidateEmail: 'user@skillgap.com',
    candidateName: 'Alex Mercer',
    targetCareerRole: 'Full Stack Java Developer',
    certTitle: 'Certified Skill Gap & Market Competency Certificate',
    themeStyle: 'indigo',
    status: 'APPROVED',
    approvedDate: new Date(Date.now() - 3600000 * 10).toISOString(),
    approvedBy: 'Platform Governance Board',
    verificationCode: 'SKG-2026-AUTH-4412',
    skills: [
      { name: 'Java 21', skillName: 'Java 21', category: 'BACKEND', proficiency: 'ADVANCED', proficiencyLevel: 'ADVANCED', years: 3.5 },
      { name: 'Spring Boot 3', skillName: 'Spring Boot 3', category: 'BACKEND', proficiency: 'ADVANCED', proficiencyLevel: 'ADVANCED', years: 3.0 },
      { name: 'React', skillName: 'React', category: 'FRONTEND', proficiency: 'ADVANCED', proficiencyLevel: 'ADVANCED', years: 3.0 },
      { name: 'PostgreSQL', skillName: 'PostgreSQL', category: 'DATABASE', proficiency: 'INTERMEDIATE', proficiencyLevel: 'INTERMEDIATE', years: 2.0 }
    ],
    requestedAt: new Date(Date.now() - 3600000 * 30).toISOString()
  }
];

export const MASTER_JOBS = [
  {
    id: 1,
    title: 'Senior Full Stack Java Developer',
    company: 'TechCorp Solutions',
    location: 'Bengaluru / Remote',
    experienceLevel: 'SENIOR_LEVEL',
    salaryRange: '$130,000 - $160,000',
    description: 'Lead design and development of event-driven distributed microservices using Java 21, Spring Boot 3, Apache Kafka, PostgreSQL, and high-performance React frontends.',
    requiredSkills: [
      { name: 'Java 21', importance: 'CORE' },
      { name: 'Spring Boot 3', importance: 'CORE' },
      { name: 'React', importance: 'CORE' },
      { name: 'PostgreSQL', importance: 'CORE' },
      { name: 'Docker', importance: 'SECONDARY' },
      { name: 'AWS Cloud', importance: 'SECONDARY' }
    ]
  },
  {
    id: 2,
    title: 'Cloud Native DevOps Engineer',
    company: 'CloudScale Global Systems',
    location: 'Hyderabad / Hybrid',
    experienceLevel: 'MID_LEVEL',
    salaryRange: '$125,000 - $155,000',
    description: 'Maintain and scale enterprise Kubernetes clusters (EKS/GKE), automate infrastructure with Terraform, and configure GitOps canary deployments via ArgoCD.',
    requiredSkills: [
      { name: 'Kubernetes', importance: 'CORE' },
      { name: 'Docker', importance: 'CORE' },
      { name: 'Terraform', importance: 'CORE' },
      { name: 'CI/CD Pipelines', importance: 'CORE' },
      { name: 'AWS Cloud', importance: 'SECONDARY' },
      { name: 'Linux', importance: 'SECONDARY' }
    ]
  },
  {
    id: 3,
    title: 'Senior MLOps & AI Systems Engineer',
    company: 'NeuralWorks Intelligence Labs',
    location: 'Remote (Global)',
    experienceLevel: 'SENIOR_LEVEL',
    salaryRange: '$150,000 - $185,000',
    description: 'Architect low-latency LLM inference pipelines, fine-tune models with LoRA/QLoRA, build hybrid vector search with Milvus and Redis, and scale PyTorch training clusters.',
    requiredSkills: [
      { name: 'Python', importance: 'CORE' },
      { name: 'PyTorch', importance: 'CORE' },
      { name: 'Machine Learning', importance: 'CORE' },
      { name: 'Docker', importance: 'SECONDARY' },
      { name: 'PostgreSQL', importance: 'SECONDARY' }
    ]
  },
  {
    id: 4,
    title: 'Frontend React Architect',
    company: 'FinStream Capital Technologies',
    location: 'Bengaluru / Hybrid',
    experienceLevel: 'SENIOR_LEVEL',
    salaryRange: '$120,000 - $150,000',
    description: 'Architect reactive web trading portals with Next.js, TypeScript, Tailwind CSS, and WebSockets with sub-16ms frame render times.',
    requiredSkills: [
      { name: 'React', importance: 'CORE' },
      { name: 'TypeScript', importance: 'CORE' },
      { name: 'Next.js', importance: 'CORE' },
      { name: 'Tailwind CSS', importance: 'SECONDARY' }
    ]
  },
  {
    id: 5,
    title: 'Site Reliability Engineer (SRE)',
    company: 'Apex Enterprise Cloud',
    location: 'Pune / Remote',
    experienceLevel: 'MID_LEVEL',
    salaryRange: '$115,000 - $145,000',
    description: 'Ensure 99.99% availability across distributed polyglot microservices using OpenTelemetry, Prometheus, Grafana, and automated chaos engineering.',
    requiredSkills: [
      { name: 'Kubernetes', importance: 'CORE' },
      { name: 'Linux', importance: 'CORE' },
      { name: 'Docker', importance: 'CORE' },
      { name: 'CI/CD Pipelines', importance: 'SECONDARY' }
    ]
  }
];

export const MASTER_COURSES = [
  {
    id: 'course-1',
    title: 'Mastering Spring Boot 3 & Enterprise Microservices',
    provider: 'Coursera / VMware',
    difficulty: 'ADVANCED',
    rating: 4.9,
    primarySkillName: 'Spring Boot 3',
    durationHours: 36,
    courseUrl: 'https://coursera.org/search?query=spring+boot',
    description: 'Deep dive into event-driven architecture, Spring Cloud Gateway, resilience patterns, and virtual threads.'
  },
  {
    id: 'course-2',
    title: 'Modern React & TypeScript Enterprise Architectures',
    provider: 'Meta / edX',
    difficulty: 'INTERMEDIATE',
    rating: 4.8,
    primarySkillName: 'React',
    durationHours: 28,
    courseUrl: 'https://coursera.org/search?query=react+typescript',
    description: 'Enterprise React development with TypeScript, Zustand state management, and modern component design.'
  },
  {
    id: 'course-3',
    title: 'Docker & Kubernetes Cloud-Native Deployment',
    provider: 'Linux Foundation',
    difficulty: 'ADVANCED',
    rating: 4.9,
    primarySkillName: 'Kubernetes',
    durationHours: 42,
    courseUrl: 'https://coursera.org/search?query=kubernetes',
    description: 'Certified Kubernetes Administrator (CKA) curriculum covering ingress, CNI networking, and Helm charts.'
  },
  {
    id: 'course-4',
    title: 'High-Performance PostgreSQL & Distributed Database Systems',
    provider: 'Udemy / AWS',
    difficulty: 'ADVANCED',
    rating: 4.8,
    primarySkillName: 'PostgreSQL',
    durationHours: 24,
    courseUrl: 'https://coursera.org/search?query=postgresql',
    description: 'Query optimization, composite indexing, connection pool tuning, and transactional isolation guarantees.'
  },
  {
    id: 'course-5',
    title: 'PyTorch Deep Learning & Large Language Model Fine-Tuning',
    provider: 'DeepLearning.AI',
    difficulty: 'ADVANCED',
    rating: 4.9,
    primarySkillName: 'PyTorch',
    durationHours: 38,
    courseUrl: 'https://coursera.org/search?query=pytorch+llm',
    description: 'Parameter-efficient fine-tuning with LoRA/QLoRA, RAG architectures, and vLLM inference optimization.'
  },
  {
    id: 'course-6',
    title: 'AWS Certified Solutions Architect Professional',
    provider: 'Amazon Web Services',
    difficulty: 'EXPERT',
    rating: 4.9,
    primarySkillName: 'AWS Cloud',
    durationHours: 50,
    courseUrl: 'https://aws.amazon.com/certification/',
    description: 'Multi-region architectures, disaster recovery, zero-trust security, and high-availability systems on AWS.'
  }
];

export const MASTER_SKILLS = [
  { id: 1, name: 'Java 21', category: 'Backend', description: 'Core enterprise language with virtual threads and pattern matching', marketDemandScore: 96 },
  { id: 2, name: 'Spring Boot 3', category: 'Backend', description: 'Framework for cloud-native microservices and REST APIs', marketDemandScore: 95 },
  { id: 3, name: 'React', category: 'Frontend', description: 'Component-based UI library for responsive web applications', marketDemandScore: 94 },
  { id: 4, name: 'Kubernetes', category: 'DevOps', description: 'Container orchestration, rolling updates, and cluster scalability', marketDemandScore: 93 },
  { id: 5, name: 'AWS Cloud', category: 'Cloud', description: 'Cloud infrastructure, computing, storage, and networking', marketDemandScore: 95 },
  { id: 6, name: 'PostgreSQL', category: 'Database', description: 'Advanced open-source relational database with ACID compliance', marketDemandScore: 91 },
  { id: 7, name: 'Python', category: 'Data & AI', description: 'Primary language for AI/ML, data processing, and backend automation', marketDemandScore: 98 },
  { id: 8, name: 'Docker', category: 'DevOps', description: 'Containerization standard for consistent cross-environment runtimes', marketDemandScore: 92 },
  { id: 9, name: 'TypeScript', category: 'Frontend', description: 'Typed JavaScript for scalable and bug-resistant frontend codebases', marketDemandScore: 90 },
  { id: 10, name: 'Apache Kafka', category: 'Backend', description: 'Distributed event streaming and messaging backbone for microservices', marketDemandScore: 92 }
];

export const MASTER_RESUME_DOCS = {
  'devansh.verma@example.com': {
    fileName: 'Devansh_Verma_Enterprise_Architect.pdf',
    fileType: 'application/pdf',
    fileSize: 48920,
    uploadedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    rawText: `Devansh Verma | devansh.verma@example.com | +91 98765 43210 | Bengaluru, Karnataka
Senior Full Stack Engineer & Enterprise Architect with 7+ years building reactive microservices.
Core Competencies: Java 21, Spring Boot 3, Spring Cloud, Hibernate, JPA, React 19, TypeScript, PostgreSQL, Docker, Kubernetes, AWS Cloud, Redis, Kafka, Microservices Architecture.
Education: Bachelor of Technology (B.Tech) in Computer Science & Engineering.
Experience: Architected distributed order management platforms processing 40M daily requests with sub-30ms latency.`,
    extractedSkills: ['Java 21', 'Spring Boot 3', 'React', 'Docker', 'Kubernetes', 'PostgreSQL', 'Microservices', 'AWS Cloud'],
    candidateName: 'Devansh Verma',
    candidateEmail: 'devansh.verma@example.com'
  },
  'sarah.jenkins@talentcorp.io': {
    fileName: 'Sarah_Jenkins_DevOps_Specialist.pdf',
    fileType: 'application/pdf',
    fileSize: 44100,
    uploadedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    rawText: `Sarah Jenkins | sarah.jenkins@talentcorp.io | +91 98451 22334 | Hyderabad, Telangana
Cloud Native DevOps Engineer with 4+ years orchestrating Kubernetes and multi-cloud infrastructure.
Core Competencies: Kubernetes, Docker, AWS Cloud, Terraform, CI/CD Pipelines, GitHub Actions, Linux, ArgoCD, Prometheus, Grafana.
Education: Bachelor of Technology in Information Technology.
Experience: Reduced cloud compute spend by 38% via Kubernetes spot instance autoscaling and dynamic node pools.`,
    extractedSkills: ['Kubernetes', 'Docker', 'AWS Cloud', 'Terraform', 'CI/CD Pipelines', 'Linux'],
    candidateName: 'Sarah Jenkins',
    candidateEmail: 'sarah.jenkins@talentcorp.io'
  },
  'priya.sharma@aimodels.io': {
    fileName: 'Priya_Sharma_MLOps_Architect.pdf',
    fileType: 'application/pdf',
    fileSize: 52300,
    uploadedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    rawText: `Priya Sharma | priya.sharma@aimodels.io | +91 97112 33445 | Remote / Bengaluru
MLOps & Machine Learning Systems Architect specializing in LLM serving and vector search infrastructure.
Core Competencies: Python, PyTorch, Machine Learning, Fastify, Docker, PostgreSQL, Milvus, Redis, LoRA, RAG Architecture, vLLM.
Education: Master of Technology (M.Tech) in Artificial Intelligence.
Experience: Deployed enterprise RAG search system indexing 1.2M technical documents with 99.4% precision.`,
    extractedSkills: ['Python', 'Machine Learning', 'PyTorch', 'Docker', 'PostgreSQL'],
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@aimodels.io'
  },
  'user@skillgap.com': {
    fileName: 'Alex_Mercer_FullStack_Resume.pdf',
    fileType: 'application/pdf',
    fileSize: 46200,
    uploadedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    rawText: `Alex Mercer | user@skillgap.com | +91 98765 43210 | Bengaluru, Karnataka
Senior Full Stack Java Developer with 4.5 years experience in Java 21, Spring Boot 3, ReactJS, TypeScript, PostgreSQL, Redis, Docker, Kubernetes, AWS Cloud.
Bachelor of Technology (B.Tech) in Computer Science & Engineering.
Led full stack product features serving 500k+ active corporate users.`,
    extractedSkills: ['Java 21', 'Spring Boot 3', 'React', 'PostgreSQL', 'Docker', 'AWS Cloud'],
    candidateName: 'Alex Mercer (Candidate)',
    candidateEmail: 'user@skillgap.com'
  }
};

/**
 * Synchronize all enterprise master data with accounts, passwords, resumes, jobs, and telemetry.
 * Safe, idempotent, and matches Infosys Project standard.
 */
export const syncEnterpriseMasterData = ({ force = true } = {}) => {
  try {
    // 1. Recover Passwords Map
    const existingPasswords = JSON.parse(localStorage.getItem('skillgap_user_passwords') || '{}');
    const mergedPasswords = { ...DEFAULT_USER_PASSWORDS, ...existingPasswords };
    for (const [em, pass] of Object.entries(DEFAULT_USER_PASSWORDS)) {
      mergedPasswords[em] = pass;
      localStorage.setItem('rc_password_' + em, pass);
    }
    localStorage.setItem('skillgap_user_passwords', JSON.stringify(mergedPasswords));

    // 2. Recover Candidate Profiles Database (skillgap_profiles_db)
    const existingDb = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
    const updatedDb = { ...MASTER_CANDIDATES };

    // Also inject accounts as valid profiles
    MASTER_ACCOUNTS.forEach(acc => {
      const em = acc.email.toLowerCase().trim();
      if (!updatedDb[em]) {
        updatedDb[em] = { ...acc };
      }
    });

    // Merge existing non-conflicting records
    Object.keys(existingDb).forEach(k => {
      const stored = existingDb[k] || {};
      const base = updatedDb[k] || {};
      updatedDb[k] = {
        ...base,
        ...stored,
        approvalStatus: stored.approvalStatus || base.approvalStatus || 'APPROVED',
        isApproved: stored.isApproved !== undefined ? stored.isApproved : (base.isApproved !== undefined ? base.isApproved : true),
        skills: (stored.skills && stored.skills.length > 0) ? stored.skills : (base.skills || []),
        voiceRecords: (stored.voiceRecords && stored.voiceRecords.length > 0) ? stored.voiceRecords : (base.voiceRecords || []),
        interviewAttempts: (stored.interviewAttempts && stored.interviewAttempts.length > 0) ? stored.interviewAttempts : (base.interviewAttempts || [])
      };
    });

    localStorage.setItem('skillgap_profiles_db', JSON.stringify(updatedDb));

    // 3. Recover Registered Profiles Map
    const existingReg = JSON.parse(localStorage.getItem('skillgap_registered_profiles') || '{}');
    const mergedReg = { ...updatedDb, ...existingReg };
    localStorage.setItem('skillgap_registered_profiles', JSON.stringify(mergedReg));

    // 4. Recover Resumes Store
    const existingResumes = JSON.parse(localStorage.getItem('skillgap_resumes_store') || '{}');
    const mergedResumes = { ...MASTER_RESUME_DOCS, ...existingResumes };
    localStorage.setItem('skillgap_resumes_store', JSON.stringify(mergedResumes));
    for (const [em, doc] of Object.entries(mergedResumes)) {
      localStorage.setItem('skillgap_resume_doc_' + em, JSON.stringify(doc));
    }

    // 5. Recover Skill Requests
    const existingSkillReqs = JSON.parse(localStorage.getItem('skillgap_skill_requests') || '[]');
    const reqIds = new Set(existingSkillReqs.map(r => r.id));
    const mergedSkillReqs = [...existingSkillReqs];
    MASTER_SKILL_REQUESTS.forEach(r => {
      if (!reqIds.has(r.id)) {
        mergedSkillReqs.push(r);
        reqIds.add(r.id);
      }
    });
    localStorage.setItem('skillgap_skill_requests', JSON.stringify(mergedSkillReqs));

    // 6. Recover Certificate Requests
    const normalizeSkillItem = (sk) => ({
      name: sk.name || sk.skillName || 'Skill',
      skillName: sk.name || sk.skillName || 'Skill',
      category: sk.category || 'TECHNICAL',
      proficiency: sk.proficiency || sk.proficiencyLevel || 'ADVANCED',
      proficiencyLevel: sk.proficiency || sk.proficiencyLevel || 'ADVANCED',
      years: parseFloat(sk.years || sk.yearsExperience) || 2.0
    });

    const existingCertReqs = JSON.parse(localStorage.getItem('skillgap_cert_requests') || '[]');
    const certIds = new Set(existingCertReqs.map(c => c.id));
    const mergedCertReqs = existingCertReqs.map(c => ({
      ...c,
      skills: (c.skills || []).map(normalizeSkillItem)
    }));
    MASTER_CERT_REQUESTS.forEach(c => {
      if (!certIds.has(c.id)) {
        mergedCertReqs.push({
          ...c,
          skills: (c.skills || []).map(normalizeSkillItem)
        });
        certIds.add(c.id);
      }
    });
    localStorage.setItem('skillgap_cert_requests', JSON.stringify(mergedCertReqs));

    // 7. Recover Jobs Database
    const existingJobs = JSON.parse(localStorage.getItem('skillgap_jobs_db') || '[]');
    const jobTitles = new Set(existingJobs.map(j => j.title));
    const mergedJobs = [...existingJobs];
    MASTER_JOBS.forEach(j => {
      if (!jobTitles.has(j.title)) {
        mergedJobs.push(j);
        jobTitles.add(j.title);
      }
    });
    localStorage.setItem('skillgap_jobs_db', JSON.stringify(mergedJobs));

    // 8. Recover Admin Courses
    const existingCourses = JSON.parse(localStorage.getItem('skillgap_admin_courses') || '[]');
    const courseIds = new Set(existingCourses.map(c => c.id));
    const mergedCourses = [...existingCourses];
    MASTER_COURSES.forEach(c => {
      if (!courseIds.has(c.id)) {
        mergedCourses.push(c);
        courseIds.add(c.id);
      }
    });
    localStorage.setItem('skillgap_admin_courses', JSON.stringify(mergedCourses));

    // 9. Recover Admin Skills
    const existingSkills = JSON.parse(localStorage.getItem('skillgap_admin_skills') || '[]');
    const skillNames = new Set(existingSkills.map(s => s.name?.toLowerCase()));
    const mergedSkills = [...existingSkills];
    MASTER_SKILLS.forEach(s => {
      if (!skillNames.has(s.name.toLowerCase())) {
        mergedSkills.push(s);
        skillNames.add(s.name.toLowerCase());
      }
    });
    localStorage.setItem('skillgap_admin_skills', JSON.stringify(mergedSkills));
    localStorage.setItem('skillgap_master_skills', JSON.stringify(mergedSkills));

    // 10. Secondary Candidate DB Synced Stores
    localStorage.setItem('skillgap_candidates_db', JSON.stringify(updatedDb));
    localStorage.setItem('skillgap_candidate_profiles', JSON.stringify(updatedDb));

    // Dispatch global sync notification event across active tabs/components
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('skillgap_data_synced', { detail: { timestamp: Date.now() } }));
      }
    } catch (_) {}

    return {
      success: true,
      accountsCount: Object.keys(mergedPasswords).length,
      candidatesCount: Object.keys(updatedDb).length,
      resumesCount: Object.keys(mergedResumes).length,
      skillRequestsCount: mergedSkillReqs.length,
      certRequestsCount: mergedCertReqs.length,
      jobsCount: mergedJobs.length,
      coursesCount: mergedCourses.length
    };
  } catch (err) {
    console.error('Enterprise master data sync error:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Auto-initialize baseline master data if browser localStorage is empty.
 * Guarantees that freshly opened Vercel deployments have functional default accounts.
 */
export const ensureMasterDataSeeded = () => {
  try {
    const hasProfiles = Boolean(localStorage.getItem('skillgap_profiles_db'));
    const hasPasswords = Boolean(localStorage.getItem('skillgap_user_passwords'));
    const hasCerts = Boolean(localStorage.getItem('skillgap_cert_requests'));
    const hasSkills = Boolean(localStorage.getItem('skillgap_admin_skills'));
    const hasResumes = Boolean(localStorage.getItem('skillgap_resumes_store'));
    const hasJobs = Boolean(localStorage.getItem('skillgap_jobs_db'));
    if (!hasProfiles || !hasPasswords || !hasCerts || !hasSkills || !hasResumes || !hasJobs) {
      syncEnterpriseMasterData({ force: false });
    }
  } catch (e) {
    console.warn('Auto-seed check fallback', e);
  }
};
