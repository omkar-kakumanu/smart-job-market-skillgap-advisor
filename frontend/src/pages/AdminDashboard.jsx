import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import StatCard from '../components/StatCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { jobService } from '../services/jobService';
import { userService } from '../services/userService';
import { syncEnterpriseMasterData } from '../utils/enterpriseSync';
import { updateCandidateApprovalStatus, getUserPassword, setUserPassword, isProtectedMainAdmin } from '../context/AuthContext';
import { 
  Shield, 
  Plus, 
  Briefcase, 
  Cpu, 
  Trash2, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ExternalLink,
  Star, 
  Clock, 
  UserCheck,
  Trophy,
  Medal,
  Users,
  Lock,
  Unlock,
  Edit3,
  Filter,
  Eye,
  Sparkles,
  Bot,
  Mic,
  FileText,
  X,
  Check,
  ChevronRight,
  User,
  ArrowUpDown,
  ArrowLeftRight,
  ChevronLeft,
  Key,
  RefreshCw,
  AlertTriangle,
  FileCheck,
  FolderOpen
} from 'lucide-react';
import { EXPERIENCE_LEVELS, SKILL_CATEGORIES, PROFICIENCY_LEVELS } from '../utils/constants';

const AdminDashboard = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN' || user?.email?.toLowerCase().includes('admin');
  const [activeTab, setActiveTab] = useState(() => (user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN' || user?.email?.toLowerCase().includes('admin') ? 'approvals' : 'rankings')); // 'rankings', 'approvals', 'certificates', 'jobs', 'skills'
  const [dossierSubTab, setDossierSubTab] = useState('voice'); // 'voice', 'interview', 'profile'
  const [approvalFilter, setApprovalFilter] = useState('ALL'); // 'ALL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certRequests, setCertRequests] = useState([]);
  const [skillRequests, setSkillRequests] = useState([]);
  const [skillRequestFilter, setSkillRequestFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Table Scroll Refs for User Convenience
  const approvalsTableRef = useRef(null);
  const certApprovalsTableRef = useRef(null);
  const rankingsContainerRef = useRef(null);

  // Inspect Resume Document Modal State
  const [inspectingDocument, setInspectingDocument] = useState(null);

  // Admin Reset User Password Modal State
  const [adminResetCandidate, setAdminResetCandidate] = useState(null);
  const [adminNewPassword, setAdminNewPassword] = useState('');

  // Reset Directory Confirmation Modal State
  const [showResetDirectoryModal, setShowResetDirectoryModal] = useState(false);
  const [isSyncingData, setIsSyncingData] = useState(false);

  // Check if active session is Admin
//   const isAdmin = user?.role === 'ROLE_ADMIN' || user?.email?.toLowerCase().includes('admin');

  // Filter & Search states for Rankings
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('COMPOSITE');

  // Modal States
  const [selectedCandidate, setSelectedCandidate] = useState(null); // Dossier modal
  const [editingCandidate, setEditingCandidate] = useState(null); // Admin edit modal
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    targetCareerRole: '',
    experienceLevel: 'ENTRY_LEVEL',
    bio: '',
    role: 'ROLE_USER',
    atsScore: 90,
    interviewScore: 85,
    voiceScore: 88,
    skills: []
  });
  const [newSkillItem, setNewSkillItem] = useState({
    skillName: '',
    category: 'Backend',
    proficiencyLevel: 'ADVANCED',
    yearsExperience: 2.0
  });

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: 'Remote',
    experienceLevel: 'ENTRY_LEVEL',
    salaryRange: '$100,000 - $120,000',
    description: '',
  });

  // New Skill Form State
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'TECHNICAL',
    description: '',
    marketDemandScore: 85,
  });

  // Calculate composite ranking score
  const calculateCompositeScore = (cand) => {
    const ats = cand.atsScore || 85;
    const match = cand.skillMatchScore || (cand.skills?.length ? Math.min(98, 70 + cand.skills.length * 4) : 80);
    const interview = cand.interviewScore || 80;
    const voice = cand.voiceScore || 80;
    return Math.round((ats * 0.30) + (match * 0.30) + (interview * 0.20) + (voice * 0.20));
  };

  const loadCandidates = () => {
    try {
      let db = {};
      const stored = localStorage.getItem('skillgap_profiles_db');
      if (stored) {
        db = JSON.parse(stored);
      }

      // Seed realistic benchmark candidate roster for talent acquisition
      const seedCandidates = {
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
                },
                {
                  questionId: 2,
                  question: 'In Docker bridge networking, what underlying Linux kernel feature enforces container network namespace isolation?',
                  questionType: 'objective',
                  answer: 'B) Network namespaces (netns) and iptables / nftables routing',
                  isCorrect: true,
                  clarity: 100,
                  relevance: 100,
                  overall: 100,
                  feedback: 'Correct! Linux netns combined with iptables NAT provide bridge isolation.'
                },
                {
                  questionId: 3,
                  question: 'In Terraform configuration, what happens when a resource attribute changes and requires recreation?',
                  questionType: 'objective',
                  answer: 'C) Terraform destroys the existing resource and creates a new one (Replace)',
                  isCorrect: true,
                  clarity: 100,
                  relevance: 100,
                  overall: 100,
                  feedback: 'Correct! Attributes marked as "Forces replacement" destroy and recreate the asset.'
                },
                {
                  questionId: 4,
                  question: 'How does Prometheus collect metric samples from instrumented target applications by default?',
                  questionType: 'objective',
                  answer: 'B) Prometheus scrapes HTTP /metrics endpoints discovered via service discovery (Pull model)',
                  isCorrect: true,
                  clarity: 100,
                  relevance: 100,
                  overall: 100,
                  feedback: 'Correct! Prometheus utilizes a pull-based HTTP scrape architecture.'
                },
                {
                  questionId: 5,
                  question: 'In a Kubernetes cluster with default settings and no NetworkPolicies applied, how does pod traffic behave?',
                  questionType: 'objective',
                  answer: 'C) All pods can communicate freely with any other pod across all namespaces (non-isolated)',
                  isCorrect: true,
                  clarity: 100,
                  relevance: 100,
                  overall: 100,
                  feedback: 'Correct! Kubernetes default networking is flat and non-isolated.'
                },
                {
                  questionId: 6,
                  question: 'Design a GitOps continuous delivery pipeline using ArgoCD and Kubernetes. Detail how you configure automated Canary deployments.',
                  questionType: 'descriptive',
                  answer: 'We configure Argo Rollouts with an AnalysisTemplate querying Prometheus for error rates and latency p95. When a new image is committed, ArgoCD syncs the manifest and routes 10% traffic to the canary. If analysis passes for 15 minutes, traffic steps to 50% and 100%. If error rate exceeds 1%, automatic rollback initiates instantly.',
                  isCorrect: true,
                  clarity: 92,
                  relevance: 91,
                  overall: 92,
                  feedback: 'Great operational details on Argo Rollouts traffic stepping and SLI-driven abort criteria.'
                },
                {
                  questionId: 7,
                  question: 'A critical microservice enters CrashLoopBackOff with OOMKilled in production. Detail your diagnostic and remediation workflow.',
                  questionType: 'descriptive',
                  answer: 'First, kubectl describe pod reveals exit code 137 (SIGKILL by Linux OOM killer). I inspect container memory consumption vs defined cgroup limits. Next, I trigger a JVM heap dump analysis via JFR or Prometheus memory metrics. Remediation: tune JVM MaxRAMPercentage to 75% so off-heap memory has room, and adjust Kubernetes resource requests/limits.',
                  isCorrect: true,
                  clarity: 90,
                  relevance: 89,
                  overall: 90,
                  feedback: 'Structured incident response addressing exit codes, heap vs off-heap memory, and JVM tuning.'
                },
                {
                  questionId: 8,
                  question: 'Architect a multi-region active-active disaster recovery strategy on AWS using Terraform.',
                  questionType: 'descriptive',
                  answer: 'We deploy across us-east-1 and eu-west-1 using modular Terraform scripts. Route 53 latency-based routing steers users with health check failover. For persistent data, we deploy Amazon Aurora Global Database with cross-region replica latency under 1 second and bidirectional DynamoDB Global Tables.',
                  isCorrect: true,
                  clarity: 88,
                  relevance: 89,
                  overall: 89,
                  feedback: 'Solid multi-region topology with global databases and latency routing.'
                },
                {
                  questionId: 9,
                  question: 'How do you implement Zero-Trust Network Architecture across an enterprise EKS cluster?',
                  questionType: 'descriptive',
                  answer: 'We deploy Istio in STRICT mTLS mode so all pod-to-pod communication is encrypted with SPIFFE cryptographic certificates. Istio AuthorizationPolicies enforce least-privilege service-to-service access. In addition, Open Policy Agent (OPA) Gatekeeper enforces admission security standards like disallowing root containers.',
                  isCorrect: true,
                  clarity: 89,
                  relevance: 88,
                  overall: 88,
                  feedback: 'Clear Zero-Trust architecture combining mesh mTLS, auth policies, and OPA admission controls.'
                },
                {
                  questionId: 10,
                  question: 'Explain how you instrument a distributed polyglot microservice system with OpenTelemetry.',
                  questionType: 'descriptive',
                  answer: 'We configure OpenTelemetry auto-instrumentation agents and SDKs to propagate W3C traceparent headers across HTTP and Kafka calls. Spans are batched and exported via OTLP gRPC to OpenTelemetry Collectors running as DaemonSets on Kubernetes nodes, which route traces to Jaeger and Tempo for visual latency flame graphs.',
                  isCorrect: true,
                  clarity: 87,
                  relevance: 88,
                  overall: 88,
                  feedback: 'Excellent explanation of W3C trace propagation, collector daemons, and Jaeger visualization.'
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
          interviewAttempts: [
            {
              id: 'att-priya-1',
              candidateName: 'Priya Sharma',
              candidateEmail: 'priya.sharma@aimodels.io',
              role: 'Senior Machine Learning Engineer',
              attemptNumber: 1,
              completedQuestions: 10,
              totalQuestions: 10,
              avgClarity: 92,
              avgRelevance: 92,
              overallScore: 92,
              status: 'COMPLETED',
              timestamp: new Date(Date.now() - 3600000 * 30).toISOString(),
              responses: [
                {
                  questionId: 1,
                  question: 'When training Deep Neural Networks, which problem does Batch Normalization primarily mitigate?',
                  questionType: 'objective',
                  answer: 'B) Internal Covariate Shift',
                  isCorrect: true,
                  clarity: 100,
                  relevance: 100,
                  overall: 100,
                  feedback: 'Correct! Batch Normalization stabilizes layer input distribution throughout training.'
                },
                {
                  questionId: 2,
                  question: 'What is the computational complexity of the standard Multi-Head Self-Attention mechanism in Transformer architectures?',
                  questionType: 'objective',
                  answer: 'B) O(N^2 * D) where N is sequence length and D is representation dimension',
                  isCorrect: true,
                  clarity: 100,
                  relevance: 100,
                  overall: 100,
                  feedback: 'Correct! Standard attention exhibits quadratic complexity with sequence length.'
                },
                {
                  questionId: 3,
                  question: 'In LLM Fine-Tuning, how does Low-Rank Adaptation (LoRA) minimize memory consumption during training?',
                  questionType: 'objective',
                  answer: 'B) Freezing original pretrained weights and training low-rank decomposed matrices (B x A) with rank r << d',
                  isCorrect: true,
                  clarity: 100,
                  relevance: 100,
                  overall: 100,
                  feedback: 'Correct! LoRA decomposes weight updates into two low-rank matrices.'
                },
                {
                  questionId: 4,
                  question: 'Which distance metric is standard for normalized dense embedding similarity comparisons?',
                  questionType: 'objective',
                  answer: 'B) Cosine Similarity (or Inner Product on normalized vectors)',
                  isCorrect: true,
                  clarity: 100,
                  relevance: 100,
                  overall: 100,
                  feedback: 'Correct! Cosine similarity measures directional alignment between normalized embeddings.'
                },
                {
                  questionId: 5,
                  question: 'In High-Dimensional Approximate Nearest Neighbor (ANN) vector indexing, what does HNSW stand for?',
                  questionType: 'objective',
                  answer: 'B) Hierarchical Navigable Small World graphs',
                  isCorrect: true,
                  clarity: 100,
                  relevance: 100,
                  overall: 100,
                  feedback: 'Correct! HNSW builds multi-layer graphs for logarithmic search time.'
                },
                {
                  questionId: 6,
                  question: 'Design an end-to-end Retrieval-Augmented Generation (RAG) system handling 1 million technical documentation pages with sub-second latency.',
                  questionType: 'descriptive',
                  answer: 'We ingest PDFs using PyMuPDF and perform semantic chunking with overlapping windows of 512 tokens. Embeddings are generated using BAAI/bge-large and indexed in Milvus using HNSW. At query time, we perform hybrid search (BM25 + Dense embeddings) followed by a FlashRank cross-encoder reranker, sending top-5 documents into the LLM context window with sub-400ms latency.',
                  isCorrect: true,
                  clarity: 94,
                  relevance: 93,
                  overall: 94,
                  feedback: 'Excellent RAG architecture featuring hybrid search, semantic chunking, and cross-encoder reranking.'
                },
                {
                  questionId: 7,
                  question: 'Detail strategies for optimizing throughput and reducing time-to-first-token (TTFT) for LLM inference in production.',
                  questionType: 'descriptive',
                  answer: 'We deploy vLLM with PagedAttention to eliminate memory fragmentation in the KV cache. Continuous batching dynamically schedules incoming requests without waiting for previous completions. Furthermore, FP8 quantization and FlashAttention-2 speed up matrix operations by 2.5x without perceptible quality degradation.',
                  isCorrect: true,
                  clarity: 93,
                  relevance: 92,
                  overall: 93,
                  feedback: 'Strong understanding of vLLM PagedAttention, KV cache management, and continuous batching.'
                },
                {
                  questionId: 8,
                  question: 'Explain how you detect and remediate Data Drift and Concept Drift in a production credit-risk scoring ML pipeline.',
                  questionType: 'descriptive',
                  answer: 'We run Evidently AI pipelines on daily inference logs. For Data Drift, we compute Kolmogorov-Smirnov statistical tests for numerical features and PSI (Population Stability Index) for categorical features. When drift breaches our threshold (PSI > 0.2), an automated Airflow DAG retrains the model on recent labeled data.',
                  isCorrect: true,
                  clarity: 91,
                  relevance: 92,
                  overall: 92,
                  feedback: 'Thorough statistical drift detection methodology and automated retraining triggers.'
                },
                {
                  questionId: 9,
                  question: 'Compare and contrast Distributed Data Parallel (DDP) vs Fully Sharded Data Parallel (FSDP) in PyTorch.',
                  questionType: 'descriptive',
                  answer: 'In DDP, each GPU maintains a complete replica of the model weights, gradients, and optimizer states, limiting model size to single-GPU VRAM. FSDP implements Zero Redundancy Optimizer (ZeRO-3) by sharding model parameters, gradients, and optimizer states across GPUs, enabling training of models with billions of parameters across commodity GPU clusters.',
                  isCorrect: true,
                  clarity: 92,
                  relevance: 91,
                  overall: 92,
                  feedback: 'Accurate distinction between full replica synchronization in DDP and memory sharding in FSDP ZeRO-3.'
                },
                {
                  questionId: 10,
                  question: 'Design an MLOps model deployment pipeline that guarantees Zero-Downtime model updates with automated Canary evaluations.',
                  questionType: 'descriptive',
                  answer: 'We containerize model artifacts with Seldon Core or KServe on Kubernetes. New candidate models are deployed with a shadow traffic split (100% inference mirrored without impacting client responses). If error rate and latency SLOs match baseline, canary traffic shifts from 10% to 50% to 100% with automated Prometheus rollback checks.',
                  isCorrect: true,
                  clarity: 90,
                  relevance: 91,
                  overall: 91,
                  feedback: 'Superb canary architecture incorporating shadow mirroring and automated SLO evaluations.'
                }
              ]
            }
          ]
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
        }
      };

      // Merge seed data with stored database
      let updatedDb = { ...seedCandidates };
      Object.keys(db).forEach(k => {
        const seed = seedCandidates[k] || {};
        const stored = db[k] || {};
        updatedDb[k] = {
          ...seed,
          ...stored,
          approvalStatus: stored.approvalStatus || seed.approvalStatus || 'APPROVED',
          isApproved: stored.isApproved !== undefined ? stored.isApproved : (seed.isApproved !== undefined ? seed.isApproved : true),
          voiceRecords: (stored.voiceRecords && stored.voiceRecords.length > 0) ? stored.voiceRecords : (seed.voiceRecords || []),
          interviewAttempts: (stored.interviewAttempts && stored.interviewAttempts.length > 0) ? stored.interviewAttempts : (seed.interviewAttempts || [])
        };
      });

      // Synchronize active logged in user profile if exists
      if (user?.email) {
        const uEmail = user.email.toLowerCase().trim();
        const existing = updatedDb[uEmail] || {};
        updatedDb[uEmail] = {
          fullName: user.fullName || existing.fullName || 'Candidate Member',
          email: uEmail,
          targetCareerRole: user.targetCareerRole || existing.targetCareerRole || 'Full Stack Java Developer',
          experienceLevel: user.experienceLevel || existing.experienceLevel || 'ENTRY_LEVEL',
          bio: user.bio || existing.bio || 'Enterprise candidate undergoing skill gap and competency evaluation.',
          resumeName: user.resumeName || existing.resumeName || 'Candidate_Resume_Submission.pdf',
          isProfileLocked: user.isProfileLocked !== undefined ? user.isProfileLocked : Boolean(existing.isProfileLocked),
          approvalStatus: user.approvalStatus || existing.approvalStatus || (user.role === 'ROLE_USER' ? 'PENDING_APPROVAL' : 'APPROVED'),
          isApproved: user.isApproved !== undefined ? user.isApproved : (existing.isApproved !== undefined ? existing.isApproved : true),
          atsScore: existing.atsScore || 91,
          skillMatchScore: existing.skillMatchScore || 89,
          interviewScore: existing.interviewScore || 88,
          voiceScore: existing.voiceScore || 90,
          voiceRecords: (existing.voiceRecords && existing.voiceRecords.length > 0) ? existing.voiceRecords : [],
          interviewAttempts: (existing.interviewAttempts && existing.interviewAttempts.length > 0) ? existing.interviewAttempts : [],
          skills: user.skills && user.skills.length > 0 ? user.skills : (existing.skills || [
            { skillName: 'Java 21', category: 'Backend', proficiencyLevel: 'ADVANCED', yearsExperience: 3 }
          ]),
          submissionDate: existing.submissionDate || new Date().toISOString(),
          certStatus: existing.certStatus || 'PENDING_APPROVAL'
        };
      }

      localStorage.setItem('skillgap_profiles_db', JSON.stringify(updatedDb));
      const candList = Object.values(updatedDb);
      setCandidates(candList);
    } catch (e) {
      console.warn('Failed loading candidates', e);
    }
  };

  const handleUpdateApprovalStatus = async (candidateEmail, newStatus) => {
    try {
      const emailKey = candidateEmail.toLowerCase().trim();
      if (isProtectedMainAdmin(emailKey) && newStatus !== 'APPROVED') {
        showToast(`Action Prohibited: Primary system administrator account (${candidateEmail}) is permanently protected and cannot be revoked.`, 'error');
        return;
      }
      const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
      if (db[emailKey]) {
        db[emailKey].approvalStatus = newStatus;
        db[emailKey].isApproved = (newStatus === 'APPROVED');
        localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
      }

      updateCandidateApprovalStatus(emailKey, newStatus);

      setCandidates(prev => prev.map(c => {
        if (c.email.toLowerCase().trim() === emailKey) {
          return {
            ...c,
            approvalStatus: newStatus,
            isApproved: (newStatus === 'APPROVED')
          };
        }
        return c;
      }));

      if (selectedCandidate && selectedCandidate.email.toLowerCase().trim() === emailKey) {
        setSelectedCandidate(prev => ({
          ...prev,
          approvalStatus: newStatus,
          isApproved: (newStatus === 'APPROVED')
        }));
      }

      // Backend API sync if candidate has an ID
      const targetUser = candidates.find(c => c.email.toLowerCase().trim() === emailKey);
      if (targetUser?.id) {
        try {
          await userService.setUserApproval(targetUser.id, newStatus === 'APPROVED');
        } catch (apiErr) {
          console.warn('Backend approval sync fallback:', apiErr);
        }
      }

      if (newStatus === 'APPROVED') {
        showToast(`Candidate ${targetUser?.fullName || candidateEmail} approved! Candidate can now sign in to the website.`, 'success');
      } else if (newStatus === 'REJECTED') {
        showToast(`Candidate ${targetUser?.fullName || candidateEmail} access rejected.`, 'info');
      } else {
        showToast(`Candidate status updated to ${newStatus}.`, 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update candidate approval status', 'error');
    }
  };


  const loadSkillRequests = () => {
    try {
      const stored = localStorage.getItem('skillgap_skill_requests');
      if (stored) {
        setSkillRequests(JSON.parse(stored));
      } else {
        const seed = [
          {
            id: 'skill_req_101',
            candidateEmail: 'devansh.verma@example.com',
            candidateName: 'Devansh Verma',
            targetCareerRole: 'Full Stack Java Developer',
            skillName: 'Apache Kafka Event Streams',
            category: 'Messaging',
            proficiencyLevel: 'ADVANCED',
            yearsExperience: 2.5,
            justification: 'Architected distributed event messaging with Kafka clusters and Spring Cloud Stream in high-throughput telemetry.',
            status: 'PENDING_APPROVAL',
            requestedAt: new Date(Date.now() - 3600000 * 24).toISOString()
          },
          {
            id: 'skill_req_102',
            candidateEmail: 'user@skillgap.com',
            candidateName: 'Alex Vance',
            targetCareerRole: 'Full Stack Java Developer',
            skillName: 'GraphQL & Apollo Federation',
            category: 'API',
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
            approvedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
            requestedAt: new Date(Date.now() - 3600000 * 72).toISOString()
          }
        ];
        localStorage.setItem('skillgap_skill_requests', JSON.stringify(seed));
        setSkillRequests(seed);
      }
    } catch (e) {
      console.warn('Failed loading skill requests', e);
    }
  };

  const handleApproveSkillRequest = async (reqId) => {
    try {
      const stored = JSON.parse(localStorage.getItem('skillgap_skill_requests') || '[]');
      const req = stored.find(r => r.id === reqId);
      if (!req) return;

      const reviewerTitle = isAdmin ? 'Administrator Review Board' : 'Talent Acquisition Team';

      const updatedStored = stored.map(r => {
        if (r.id === reqId) {
          return {
            ...r,
            status: 'APPROVED',
            approvedBy: user?.fullName ? `${user.fullName} (${reviewerTitle})` : reviewerTitle,
            approvedDate: new Date().toISOString()
          };
        }
        return r;
      });

      localStorage.setItem('skillgap_skill_requests', JSON.stringify(updatedStored));
      setSkillRequests(updatedStored);

      const candEmail = (req.candidateEmail || '').toLowerCase().trim();
      let db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
      let targetCand = db[candEmail] || candidates.find(c => (c.email || '').toLowerCase().trim() === candEmail);

      const newSkillObj = {
        id: Date.now(),
        skillId: Date.now(),
        name: req.skillName,
        skillName: req.skillName,
        category: req.category || 'TECHNICAL',
        proficiencyLevel: req.proficiencyLevel || 'ADVANCED',
        yearsExperience: req.yearsExperience || 2.0
      };

      if (targetCand) {
        const existingSkills = targetCand.skills || [];
        const alreadyHas = existingSkills.some(s => (s.skillName || s.name || '').toLowerCase() === req.skillName.toLowerCase());
        const updatedSkills = alreadyHas ? existingSkills : [...existingSkills, newSkillObj];
        targetCand = { ...targetCand, skills: updatedSkills };
        db[candEmail] = targetCand;
        localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));

        setCandidates(prev => prev.map(c => (c.email || '').toLowerCase().trim() === candEmail ? targetCand : c));
      }

      try {
        await userService.addCandidateSkill(candEmail, {
          skillName: req.skillName,
          category: req.category,
          level: req.proficiencyLevel,
          years: req.yearsExperience
        });
      } catch (err) {
        console.warn('Backend skill sync skipped:', err);
      }

      showToast(`Skill "${req.skillName}" approved and added to ${req.candidateName}'s verified profile!`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to approve skill request', 'error');
    }
  };

  const handleRejectSkillRequest = (reqId) => {
    try {
      const stored = JSON.parse(localStorage.getItem('skillgap_skill_requests') || '[]');
      const reviewerTitle = isAdmin ? 'Administrator' : 'Recruiter';
      const updatedStored = stored.map(r => {
        if (r.id === reqId) {
          return {
            ...r,
            status: 'REJECTED',
            rejectedBy: user?.fullName ? `${user.fullName} (${reviewerTitle})` : reviewerTitle,
            rejectedDate: new Date().toISOString()
          };
        }
        return r;
      });

      localStorage.setItem('skillgap_skill_requests', JSON.stringify(updatedStored));
      setSkillRequests(updatedStored);
      showToast('Skill request rejected.', 'info');
    } catch (e) {
      console.error(e);
      showToast('Failed to reject skill request', 'error');
    }
  };

  const handleRemoveSkillRequest = (reqId) => {
    try {
      const stored = JSON.parse(localStorage.getItem('skillgap_skill_requests') || '[]');
      const updated = stored.filter(r => r.id !== reqId);
      localStorage.setItem('skillgap_skill_requests', JSON.stringify(updated));
      setSkillRequests(updated);
      showToast('Skill request dismissed and removed from interface.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCandidatePosition = async (candidateEmail, newRole) => {
    if (!candidateEmail) return;
    const emailKey = candidateEmail.toLowerCase().trim();

    // INFOSYS ENTERPRISE STANDARD: PROTECTED ROOT / MAIN ADMIN
    if (isProtectedMainAdmin(emailKey)) {
      showToast(`Action Prohibited: ${candidateEmail} is the protected primary system administrator. Root authority cannot be altered or demoted.`, 'error');
      return;
    }

    if (newRole === 'ROLE_ADMIN' && !isAdmin) {
      showToast('Access Denied: Only System Administrators can grant Admin privileges.', 'error');
      return;
    }

    try {
      const updatedList = candidates.map(c => {
        if ((c.email || '').toLowerCase().trim() === emailKey) {
          return { ...c, role: newRole };
        }
        return c;
      });
      setCandidates(updatedList);

      if (selectedCandidate && (selectedCandidate.email || '').toLowerCase().trim() === emailKey) {
        setSelectedCandidate({ ...selectedCandidate, role: newRole });
      }

      const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
      if (db[emailKey]) {
        db[emailKey].role = newRole;
        localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
      }

      if (user?.email && user.email.toLowerCase().trim() === emailKey) {
        updateUserProfile({ ...user, role: newRole });
      }

      try {
        await userService.setUserRole(emailKey, newRole);
      } catch (err) {
        console.warn('Backend role sync skipped:', err);
      }

      const roleLabel = newRole === 'ROLE_RECRUITER' || newRole === 'ROLE_MANAGER' 
        ? 'Recruiter' 
        : newRole === 'ROLE_ADMIN' 
        ? 'Administrator' 
        : 'Candidate';

      const candName = candidates.find(c => (c.email || '').toLowerCase().trim() === emailKey)?.fullName || candidateEmail;
      showToast(`Position updated! ${candName} is now appointed as ${roleLabel}.`, 'success');
    } catch (err) {
      console.error('Failed to update candidate position:', err);
      showToast('Failed to update position. Please try again.', 'error');
    }
  };

  const loadCertificateRequests = () => {
    try {
      const stored = localStorage.getItem('skillgap_cert_requests');
      if (stored) {
        setCertRequests(JSON.parse(stored));
      } else {
        const seedRequests = [
          {
            id: 'cert-req-101',
            candidateName: 'John Doe',
            candidateEmail: 'user@skillgap.com',
            careerRole: 'Full Stack Java Developer',
            certTitle: 'Certified Skill Gap & Market Competency Certificate',
            skills: [
              { name: 'Java 21', category: 'TECHNICAL', proficiency: 'ADVANCED', years: 3.5 },
              { name: 'Spring Boot 3', category: 'TECHNICAL', proficiency: 'INTERMEDIATE', years: 2.0 },
              { name: 'ReactJS', category: 'TECHNICAL', proficiency: 'ADVANCED', years: 3.0 },
            ],
            themeStyle: 'gold',
            status: 'PENDING_APPROVAL',
            requestDate: new Date(Date.now() - 3600000 * 4).toISOString(),
            approvedDate: null,
            approvedBy: 'Pending Administrator Review',
            verificationCode: 'SKG-2026-PENDING-REVIEW',
            remarks: 'Submitted for verification of core microservices & cloud competency.'
          },
          {
            id: 'cert-req-102',
            candidateName: 'Sarah Jenkins',
            candidateEmail: 'sarah.jenkins@talentcorp.io',
            careerRole: 'Cloud Native DevOps Engineer',
            certTitle: 'Enterprise Kubernetes & Cloud Infrastructure Credential',
            skills: [
              { name: 'Kubernetes', category: 'TECHNICAL', proficiency: 'EXPERT', years: 4.0 },
              { name: 'AWS Cloud', category: 'TECHNICAL', proficiency: 'ADVANCED', years: 3.5 },
              { name: 'Terraform', category: 'TECHNICAL', proficiency: 'ADVANCED', years: 2.5 },
            ],
            themeStyle: 'emerald',
            status: 'PENDING_APPROVAL',
            requestDate: new Date(Date.now() - 3600000 * 18).toISOString(),
            approvedDate: null,
            approvedBy: 'Pending Administrator Review',
            verificationCode: 'SKG-2026-PENDING-REVIEW',
            remarks: 'Requires admin audit for multi-cluster production deployment credential.'
          }
        ];
        localStorage.setItem('skillgap_cert_requests', JSON.stringify(seedRequests));
        setCertRequests(seedRequests);
      }
    } catch (e) {
      console.warn('Failed loading cert requests', e);
    }
  };

  const fetchData = async () => {
    try {
      const [jRes, sRes] = await Promise.all([
        jobService.getJobs({ page: 0, size: 50 }).catch(() => ({ content: [] })),
        jobService.getAllSkills().catch(() => []),
      ]);

      const storedSkills = localStorage.getItem('skillgap_admin_skills');
      const customSkills = storedSkills ? JSON.parse(storedSkills) : [];
      const combinedSkills = [...(sRes || [])];
      customSkills.forEach(cs => {
        if (!combinedSkills.some(s => s.name?.toLowerCase() === cs.name?.toLowerCase())) {
          combinedSkills.push(cs);
        }
      });

      setJobs(jRes?.content || []);
      setSkills(combinedSkills);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    loadCertificateRequests();
    loadSkillRequests();
    loadCandidates();
  }, []);

  // Admin Toggle Lock/Unlock Candidate Profile
  const handleToggleLock = (candidate) => {
    const newLockState = !candidate.isProfileLocked;
    const updatedCandidates = candidates.map(c => {
      if (c.email.toLowerCase() === candidate.email.toLowerCase()) {
        return { ...c, isProfileLocked: newLockState };
      }
      return c;
    });
    setCandidates(updatedCandidates);

    // Save in persistent db
    try {
      const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
      const key = candidate.email.toLowerCase().trim();
      db[key] = {
        ...(db[key] || candidate),
        isProfileLocked: newLockState
      };
      localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));

      // If active user is this candidate, update active context
      if (user?.email && user.email.toLowerCase().trim() === key) {
        updateUserProfile({ ...user, isProfileLocked: newLockState });
      }
    } catch (err) {
      console.warn('Failed saving lock status', err);
    }

    showToast(
      newLockState 
        ? `Profile locked for ${candidate.fullName}. Candidate editing disabled.` 
        : `Administrator unlocked profile for ${candidate.fullName}. Candidate can now edit.`,
      'info'
    );
  };

  // Open Admin Edit Modal
  const handleOpenEditModal = (candidate) => {
    if (!candidate) return;
    setEditingCandidate(candidate);
    const rawSkills = Array.isArray(candidate.skills) ? candidate.skills : [];
    const normalizedSkills = rawSkills.map((sk, idx) => {
      if (typeof sk === 'string') {
        return {
          id: `sk-${idx}`,
          skillName: sk,
          name: sk,
          category: 'TECHNICAL',
          proficiencyLevel: 'INTERMEDIATE',
          yearsExperience: 2.0
        };
      }
      return {
        ...sk,
        skillName: sk.skillName || sk.name || 'Technical Competency',
        name: sk.skillName || sk.name || 'Technical Competency',
        category: sk.category || 'TECHNICAL',
        proficiencyLevel: sk.proficiencyLevel || sk.level || 'INTERMEDIATE',
        yearsExperience: sk.yearsExperience || sk.years || 2.0
      };
    });

    setEditForm({
      fullName: candidate.fullName || '',
      email: candidate.email || '',
      targetCareerRole: candidate.targetCareerRole || '',
      experienceLevel: candidate.experienceLevel || 'ENTRY_LEVEL',
      bio: candidate.bio || '',
      role: candidate.role || 'ROLE_USER',
      atsScore: candidate.atsScore || 90,
      interviewScore: candidate.interviewScore || 85,
      voiceScore: candidate.voiceScore || 88,
      skills: normalizedSkills
    });
    setNewSkillItem({
      skillName: '',
      category: 'TECHNICAL',
      proficiencyLevel: 'ADVANCED',
      yearsExperience: 2.0
    });
  };

  // Save Admin / Recruiter Candidate Edit
  const handleSaveCandidateEdit = async (e) => {
    e.preventDefault();
    if (!editForm.fullName.trim()) {
      showToast('Candidate name is required', 'error');
      return;
    }

    // Auto-capture typed skill if user didn't hit Add Skill button
    let finalSkills = [...editForm.skills];
    if (newSkillItem.skillName.trim()) {
      finalSkills.push({
        skillName: newSkillItem.skillName.trim(),
        name: newSkillItem.skillName.trim(),
        category: newSkillItem.category || 'TECHNICAL',
        proficiencyLevel: newSkillItem.proficiencyLevel || 'ADVANCED',
        yearsExperience: parseFloat(newSkillItem.yearsExperience) || 2.0
      });
      setNewSkillItem({
        skillName: '',
        category: 'TECHNICAL',
        proficiencyLevel: 'ADVANCED',
        yearsExperience: 2.0
      });
    }

    // Strict Role Permission: Only Admin can grant Admin role!
    if (editForm.role === 'ROLE_ADMIN' && !isAdmin) {
      showToast('Access Denied: Only System Administrators can grant Admin privileges.', 'error');
      return;
    }

    const updatedCand = {
      ...editingCandidate,
      fullName: editForm.fullName.trim(),
      targetCareerRole: editForm.targetCareerRole.trim(),
      experienceLevel: editForm.experienceLevel,
      role: editForm.role || editingCandidate.role || 'ROLE_USER',
      bio: editForm.bio.trim(),
      atsScore: parseInt(editForm.atsScore) || 90,
      interviewScore: parseInt(editForm.interviewScore) || 85,
      voiceScore: parseInt(editForm.voiceScore) || 88,
      skills: finalSkills
    };

    const targetEmail = (editingCandidate.email || '').toLowerCase().trim();
    const updatedList = candidates.map(c => 
      (c.email || '').toLowerCase().trim() === targetEmail ? updatedCand : c
    );
    setCandidates(updatedList);

    // Sync with backend API
    try {
      const candidateId = editingCandidate.id || editingCandidate.email;
      // 1. Update candidate basic profile
      try {
        await userService.updateCandidateProfile(candidateId, {
          fullName: updatedCand.fullName,
          targetCareerRole: updatedCand.targetCareerRole,
          experienceLevel: updatedCand.experienceLevel,
          bio: updatedCand.bio
        });
      } catch (profErr) {
        console.warn('Backend updateCandidateProfile fallback:', profErr);
      }

      // 2. Sync candidate skills
      for (const sk of finalSkills) {
        try {
          await userService.addCandidateSkill(candidateId, {
            skillName: sk.skillName || sk.name,
            category: sk.category || 'TECHNICAL',
            level: sk.proficiencyLevel || 'INTERMEDIATE',
            years: sk.yearsExperience || 1.0
          });
        } catch {
          // ignore individual sync failure
        }
      }
    } catch (apiErr) {
      console.warn('Backend candidate skill sync fallback:', apiErr);
    }

    // Persist in localStorage DB
    try {
      const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
      db[targetEmail] = {
        ...(db[targetEmail] || {}),
        ...updatedCand
      };
      localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));

      // If active user is this candidate, update context as well
      if (user?.email && user.email.toLowerCase().trim() === targetEmail) {
        updateUserProfile({ ...user, ...updatedCand });
      }
    } catch (err) {
      console.warn('Failed saving candidate profile edit', err);
    }

    setEditingCandidate(null);
    showToast(`Candidate skills & profile for ${updatedCand.fullName} updated successfully!`, 'success');
  };

  // Add skill in Edit modal
  const handleAddSkillInEdit = () => {
    if (!newSkillItem.skillName.trim()) return;
    const item = {
      skillName: newSkillItem.skillName.trim(),
      name: newSkillItem.skillName.trim(),
      category: newSkillItem.category || 'TECHNICAL',
      proficiencyLevel: newSkillItem.proficiencyLevel || 'ADVANCED',
      yearsExperience: parseFloat(newSkillItem.yearsExperience) || 2.0
    };
    setEditForm(prev => ({
      ...prev,
      skills: [...prev.skills, item]
    }));
    setNewSkillItem({
      skillName: '',
      category: 'TECHNICAL',
      proficiencyLevel: 'ADVANCED',
      yearsExperience: 2.0
    });
  };

  // Remove skill in Edit modal
  const handleRemoveSkillInEdit = async (idx) => {
    const skillToRemove = editForm.skills[idx];
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx)
    }));

    if (editingCandidate && (skillToRemove?.skillId || skillToRemove?.id)) {
      try {
        const candidateId = editingCandidate.id || editingCandidate.email;
        const sId = skillToRemove.skillId || skillToRemove.id;
        if (typeof sId === 'number') {
          await userService.deleteCandidateSkill(candidateId, sId);
        }
      } catch (delErr) {
        console.warn('Backend deleteCandidateSkill skipped/fallback:', delErr);
      }
    }
  };


  // Horizontal & Vertical Scroll Helpers so users don't have to scroll to bottom
  const scrollApprovals = (left = true) => {
    if (approvalsTableRef.current) {
      approvalsTableRef.current.scrollBy({ left: left ? -280 : 280, behavior: 'smooth' });
    }
  };

  const scrollCertificates = (left = true) => {
    if (certApprovalsTableRef.current) {
      certApprovalsTableRef.current.scrollBy({ left: left ? -280 : 280, behavior: 'smooth' });
    }
  };

  // Inspect Document Handler: Look up submitted PDF/DOCX resume
  const handleInspectDocument = (cand) => {
    if (!cand) return;
    const clean = (cand.email || '').toLowerCase().trim();
    let doc = cand.resumeDocument || null;

    if (!doc) {
      try {
        const store = JSON.parse(localStorage.getItem('skillgap_resumes_store') || '{}');
        doc = store[clean] || JSON.parse(localStorage.getItem('skillgap_resume_doc_' + clean) || 'null');
      } catch (e) {
        console.warn('Error reading resume doc', e);
      }
    }

    if (!doc) {
      // Create benchmark synthesized document representation for standard roster
      doc = {
        fileName: cand.resumeName || `${cand.fullName.replace(/\s+/g, '_')}_Official_Resume.pdf`,
        fileType: 'application/pdf',
        fileSize: 49200,
        uploadedAt: cand.submissionDate || new Date().toISOString(),
        rawText: `${cand.fullName}\nTarget Role: ${cand.targetCareerRole}\nEmail: ${cand.email}\nSeniority: ${cand.experienceLevel}\n\nExecutive Summary:\n${cand.bio || 'Verified enterprise candidate with proven engineering capabilities.'}\n\nVerified Technical Competencies:\n${(cand.skills || []).map(s => `- ${s.skillName || s.name} (${s.proficiencyLevel || 'ADVANCED'}, ${s.yearsExperience || 2} yrs)`).join('\n')}`,
        extractedSkills: (cand.skills || []).map(s => s.skillName || s.name),
        candidateName: cand.fullName,
        candidateEmail: cand.email
      };
    }

    setInspectingDocument(doc);
  };

  // Admin submit password change for specific candidate
  const handleAdminSetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!adminResetCandidate?.email) return;
    if (!adminNewPassword || adminNewPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }
    const clean = adminResetCandidate.email.toLowerCase().trim();
    setUserPassword(clean, adminNewPassword);
    showToast(`Password successfully updated for ${adminResetCandidate.fullName} (${clean})!`, 'success');
    setAdminResetCandidate(null);
    setAdminNewPassword('');
  };

  // Remove candidate registration request from interface
  const handleRemoveCandidateRequest = (candEmail) => {
    if (!candEmail) return;
    const clean = candEmail.toLowerCase().trim();
    if (isProtectedMainAdmin(clean)) {
      showToast(`Action Prohibited: Primary system administrator account (${candEmail}) is permanently protected and cannot be deleted.`, 'error');
      return;
    }
    setCandidates(prev => prev.filter(c => (c.email || '').toLowerCase().trim() !== clean));
    try {
      const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
      delete db[clean];
      localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
    } catch (e) {
      console.warn('Failed to delete candidate', e);
    }
    showToast('Registration request permanently removed from interface.', 'info');
  };

  // Remove completed or rejected certificate request from interface
  const handleRemoveCertRequest = (reqId) => {
    const updated = certRequests.filter(r => r.id !== reqId);
    setCertRequests(updated);
    localStorage.setItem('skillgap_cert_requests', JSON.stringify(updated));
    showToast('Certificate request dismissed and removed from interface.', 'info');
  };

  const handleSyncEnterpriseMasterData = async () => {
    setIsSyncingData(true);
    try {
      const res = syncEnterpriseMasterData({ force: true });
      loadCandidates();
      loadSkillRequests();
      loadCertificateRequests();
      await fetchData();
      window.dispatchEvent(new Event('skillgap_data_synced'));
      showToast(
        `Enterprise Data Synchronized! Recovered ${res.accountsCount} user accounts, ${res.candidatesCount} candidate dossiers, and ${res.jobsCount} job requisitions.`,
        'success'
      );
    } catch (err) {
      console.error('Master data sync failed', err);
      showToast('Failed to sync master data. Please try again.', 'error');
    } finally {
      setIsSyncingData(false);
    }
  };

  // Safe reset directory with confirmation
  const handleConfirmResetDirectory = () => {
    localStorage.removeItem('skillgap_profiles_db');
    loadCandidates();
    setShowResetDirectoryModal(false);
    showToast('Candidate directory safely reset to enterprise benchmarks.', 'success');
  };

  // Admin approves certificate and automatically updates candidate profile skills
  const handleApproveCert = (reqId) => {
    const code = `SKG-2026-AUTH-${Math.floor(1000 + Math.random() * 9000)}`;
    let targetEmail = null;
    let certifiedSkills = [];

    const updated = certRequests.map(r => {
      if (r.id === reqId) {
        targetEmail = (r.candidateEmail || '').toLowerCase().trim();
        certifiedSkills = r.skills || [];
        return {
          ...r,
          status: 'APPROVED',
          approvedDate: new Date().toISOString(),
          approvedBy: user?.fullName ? `${user.fullName} (${isAdmin ? 'System Administrator' : 'Talent Acquisition Lead'})` : 'Platform Administrator (Official Board)',
          verificationCode: code,
          remarks: 'Officially validated and authenticated by Platform Administrator.'
        };
      }
      return r;
    });

    setCertRequests(updated);
    localStorage.setItem('skillgap_cert_requests', JSON.stringify(updated));

    // CRITICAL: Automatically add approved skills into candidate profile!
    if (targetEmail && certifiedSkills.length > 0) {
      try {
        const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
        const cand = db[targetEmail] || candidates.find(c => (c.email || '').toLowerCase().trim() === targetEmail) || {};
        const existingSkills = [...(cand.skills || [])];

        for (const sk of certifiedSkills) {
          const sName = sk.name || sk.skillName;
          const idx = existingSkills.findIndex(item => (item.skillName || item.name || '').toLowerCase() === sName.toLowerCase());
          if (idx >= 0) {
            existingSkills[idx] = {
              ...existingSkills[idx],
              proficiencyLevel: sk.proficiency || sk.proficiencyLevel || 'ADVANCED',
              yearsExperience: parseFloat(sk.years || sk.yearsExperience) || 2.5
            };
          } else {
            existingSkills.push({
              id: `sk-cert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              skillName: sName,
              category: sk.category || 'TECHNICAL',
              proficiencyLevel: sk.proficiency || sk.proficiencyLevel || 'ADVANCED',
              yearsExperience: parseFloat(sk.years || sk.yearsExperience) || 2.5
            });
          }
        }

        const updatedCand = {
          ...cand,
          skills: existingSkills,
          certStatus: 'APPROVED',
          lastUpdated: new Date().toISOString()
        };

        db[targetEmail] = updatedCand;
        localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));

        setCandidates(prev => prev.map(c => (c.email || '').toLowerCase().trim() === targetEmail ? { ...c, ...updatedCand } : c));

        if (user?.email && user.email.toLowerCase().trim() === targetEmail) {
          updateUserProfile({ ...user, ...updatedCand });
        }
      } catch (err) {
        console.warn('Error syncing approved certificate skills to candidate:', err);
      }
    }

    showToast(`Certificate officially approved! ${certifiedSkills.length} competencies added to candidate profile. Code: ${code}`, 'success');
  };

  // Admin rejects certificate
  const handleRejectCert = (reqId) => {
    const updated = certRequests.map(r => {
      if (r.id === reqId) {
        return {
          ...r,
          status: 'REJECTED',
          approvedDate: null,
          approvedBy: 'Platform System Administrator (Declined)',
          remarks: 'Declined during administrative audit. Requires assessment re-evaluation.'
        };
      }
      return r;
    });

    setCertRequests(updated);
    localStorage.setItem('skillgap_cert_requests', JSON.stringify(updated));
    showToast('Certificate request rejected.', 'warning');
  };

  // Create Skill
  const handleCreateSkill = (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    const skillItem = {
      id: `skill-${Date.now()}`,
      name: newSkill.name.trim(),
      category: newSkill.category,
      description: newSkill.description || `${newSkill.name} competency specification`,
      marketDemandScore: parseInt(newSkill.marketDemandScore) || 80,
    };

    const updatedSkills = [skillItem, ...skills];
    setSkills(updatedSkills);

    const stored = localStorage.getItem('skillgap_admin_skills');
    const custom = stored ? JSON.parse(stored) : [];
    localStorage.setItem('skillgap_admin_skills', JSON.stringify([skillItem, ...custom]));

    showToast(`Skill '${skillItem.name}' added to competency registry!`, 'success');
    setNewSkill({ name: '', category: 'TECHNICAL', description: '', marketDemandScore: 85 });
  };

  // Delete Skill
  const handleDeleteSkill = (skillId) => {
    const updated = skills.filter(s => s.id !== skillId);
    setSkills(updated);
    const stored = localStorage.getItem('skillgap_admin_skills');
    if (stored) {
      const custom = JSON.parse(stored).filter(s => s.id !== skillId);
      localStorage.setItem('skillgap_admin_skills', JSON.stringify(custom));
    }
    showToast('Competency removed from catalog', 'info');
  };

  // Create Job
  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await jobService.createJob(newJob);
      showToast('Enterprise requisition published!', 'success');
      setNewJob({ title: '', company: '', location: 'Remote', experienceLevel: 'ENTRY_LEVEL', salaryRange: '$100,000 - $120,000', description: '' });
      fetchData();
    } catch (err) {
      showToast('Requisition published in local workspace mode!', 'success');
      const fallbackJob = {
        id: `job-${Date.now()}`,
        ...newJob
      };
      setJobs([fallbackJob, ...jobs]);
      setNewJob({ title: '', company: '', location: 'Remote', experienceLevel: 'ENTRY_LEVEL', salaryRange: '$100,000 - $120,000', description: '' });
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await jobService.deleteJob(id);
      showToast('Job posting removed', 'info');
      fetchData();
    } catch (err) {
      setJobs(jobs.filter(j => j.id !== id));
      showToast('Job posting removed', 'info');
    }
  };

  // Filtered and sorted candidate ranking list
  const rankedCandidates = candidates
    .map(c => ({
      ...c,
      compositeScore: calculateCompositeScore(c)
    }))
    .filter(c => {
      const matchesSearch = 
        c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.targetCareerRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.skills?.some(s => (s.skillName || s.name)?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === 'ALL' || c.targetCareerRole?.toLowerCase().includes(roleFilter.toLowerCase());
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === 'ATS') return (b.atsScore || 0) - (a.atsScore || 0);
      if (sortBy === 'INTERVIEW') return (b.interviewScore || 0) - (a.interviewScore || 0);
      if (sortBy === 'VOICE') return (b.voiceScore || 0) - (a.voiceScore || 0);
      return b.compositeScore - a.compositeScore;
    });

  const getCandidateVoiceRecords = (cand) => {
    if (!cand) return [];
    if (cand.voiceRecords && Array.isArray(cand.voiceRecords) && cand.voiceRecords.length > 0) {
      return cand.voiceRecords;
    }
    try {
      const allVoice = JSON.parse(localStorage.getItem('skillgap_voice_records') || '[]');
      return allVoice.filter(v => v.candidateEmail?.toLowerCase() === cand.email?.toLowerCase() || (v.userId && v.userId === cand.id));
    } catch {
      return [];
    }
  };

  const getCandidateInterviewAttempts = (cand) => {
    if (!cand) return [];
    if (cand.interviewAttempts && Array.isArray(cand.interviewAttempts) && cand.interviewAttempts.length > 0) {
      return cand.interviewAttempts;
    }
    try {
      const allAttempts = JSON.parse(localStorage.getItem('skillgap_interview_attempts') || '[]');
      return allAttempts.filter(a => a.candidateEmail?.toLowerCase() === cand.email?.toLowerCase() || (a.userId && a.userId === cand.id));
    } catch {
      return [];
    }
  };

  const pendingApprovalsCount = certRequests.filter(r => r.status === 'PENDING_APPROVAL').length;
  const pendingRegistrationsCount = candidates.filter(c => c.approvalStatus === 'PENDING_APPROVAL').length;
  const pendingSkillRequestsCount = skillRequests.filter(r => (r.status || 'PENDING_APPROVAL') === 'PENDING_APPROVAL').length;
  const lockedCount = candidates.filter(c => c.isProfileLocked).length;
  const avgReadiness = candidates.length 
    ? Math.round(candidates.reduce((acc, c) => acc + calculateCompositeScore(c), 0) / candidates.length)
    : 88;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        <Breadcrumb items={[{ label: 'Executive Dashboard', to: '/dashboard' }, { label: isAdmin ? 'System Administration Console' : 'Talent & Recruiter Console' }]} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 ${
              isAdmin 
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                : 'bg-indigo-50 dark:bg-emerald-950/40 text-indigo-700 dark:text-emerald-300 border border-indigo-200 dark:border-emerald-500/30'
            }`}>
              <Shield className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{isAdmin ? 'System Administrator Governance Console' : 'Talent Acquisition & Recruiter Access'}</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span>{isAdmin ? 'System Administration & Candidate Approvals' : 'Candidate Leaderboard & Talent Acquisition'}</span>
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {isAdmin 
                ? 'Candidate registration access verification, skill & certificate approvals, audit telemetry, and system governance.'
                : 'Multi-dimensional candidate ranking leaderboard, candidate competency profiles, and technical interview evaluations.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            {/* Tab 1: Candidate Rankings */}
            <button
              onClick={() => setActiveTab('rankings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'rankings'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>Candidate Rankings ({candidates.length})</span>
            </button>

            {/* Tab 2: Candidate Registrations & Approvals */}
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'approvals'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Registration Approvals</span>
              {pendingRegistrationsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white font-mono text-[10px] flex items-center justify-center font-black animate-pulse">
                  {pendingRegistrationsCount}
                </span>
              )}
            </button>


            {/* Tab 3: Candidate Skill Requests */}
            <button
              onClick={() => setActiveTab('skill_requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'skill_requests'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Skill Requests</span>
              {pendingSkillRequestsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-mono text-[10px] flex items-center justify-center font-black animate-pulse">
                  {pendingSkillRequestsCount}
                </span>
              )}
            </button>
            {/* Tab 3: Certificate Approvals */}
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'certificates'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Certificates</span>
              {pendingApprovalsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-mono text-[10px] flex items-center justify-center font-black">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            {/* Tab 4: Requisitions */}
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'jobs'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Requisitions ({jobs.length})</span>
            </button>

            {/* Tab 5: Skills Registry */}
            <button
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'skills'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Skills Registry ({skills.length})</span>
            </button>
          </div>
        </div>

        {/* Particular Candidate Inspection Studio Selector Banner */}
        <div className="glass p-5 rounded-3xl border border-indigo-200/80 dark:border-indigo-800/40 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <span>Particular Candidate Inspection Studio</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  Privileged Recruiter Telemetry
                </span>
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Select any candidate to inspect their voice screening transcripts, 10-question technical interview breakdown, and access status.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              id="candidate-inspector-select"
              className="w-full md:w-80 px-4 py-2.5 rounded-xl text-xs font-bold border border-indigo-200 dark:border-gray-700 bg-white dark:bg-darkcard text-gray-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => {
                const found = candidates.find(c => c.email.toLowerCase() === e.target.value.toLowerCase());
                if (found) {
                  setSelectedCandidate(found);
                  setDossierSubTab('voice');
                }
              }}
              value={selectedCandidate?.email || ''}
            >
              <option value="">-- Choose Candidate to Inspect --</option>
              {candidates.map(c => (
                <option key={c.email} value={c.email}>
                  {c.fullName} ({c.targetCareerRole || 'Candidate'}) - {c.approvalStatus === 'PENDING_APPROVAL' ? '⚠️ PENDING' : (c.approvalStatus === 'REJECTED' ? '❌ REJECTED' : '✅ APPROVED')}
                </option>
              ))}
            </select>

            {selectedCandidate && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(selectedCandidate)}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="Recruiter: Add or update candidate skills and profile"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Candidate & Skills</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="px-3 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TAB: CANDIDATE REGISTRATIONS & APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="space-y-6 mb-8">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
                <UserCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  <strong>Gated Registration Enforcement Active:</strong> Newly registered candidates are prevented from entering the website until you approve their account. Only authorized candidates can sign in.
                </span>
              </div>
              <div className="shrink-0 font-black text-amber-700 dark:text-amber-300">
                {pendingRegistrationsCount} Pending Review
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'ALL', label: `All Candidates (${candidates.length})` },
                { id: 'PENDING_APPROVAL', label: `Pending Approval (${pendingRegistrationsCount})` },
                { id: 'APPROVED', label: `Approved (${candidates.filter(c => c.approvalStatus === 'APPROVED').length})` },
                { id: 'REJECTED', label: `Rejected (${candidates.filter(c => c.approvalStatus === 'REJECTED').length})` },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setApprovalFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    approvalFilter === f.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Top Horizontal & Vertical Navigation Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-2 px-1">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-500" />
                <span>Scroll table horizontally to review telemetry, passwords, and actions:</span>
              </div>
              <div className="flex items-center gap-1.5 font-tech">
                <button
                  type="button"
                  onClick={() => scrollApprovals(true)}
                  className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-gray-200 bg-white dark:bg-darkcard hover:bg-slate-100 rounded-lg border border-slate-200 dark:border-gray-700 transition flex items-center gap-1 cursor-pointer shadow-xs"
                  title="Scroll table left"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Left</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollApprovals(false)}
                  className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-gray-200 bg-white dark:bg-darkcard hover:bg-slate-100 rounded-lg border border-slate-200 dark:border-gray-700 transition flex items-center gap-1 cursor-pointer shadow-xs"
                  title="Scroll table right"
                >
                  <span>Right</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => approvalsTableRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-2 py-1 text-xs font-bold text-slate-700 dark:text-gray-200 bg-white dark:bg-darkcard hover:bg-slate-100 rounded-lg border border-slate-200 dark:border-gray-700 transition cursor-pointer shadow-xs"
                  title="Scroll to top of table"
                >
                  Top
                </button>
                <button
                  type="button"
                  onClick={() => approvalsTableRef.current?.scrollTo({ top: 99999, behavior: 'smooth' })}
                  className="px-2 py-1 text-xs font-bold text-slate-700 dark:text-gray-200 bg-white dark:bg-darkcard hover:bg-slate-100 rounded-lg border border-slate-200 dark:border-gray-700 transition cursor-pointer shadow-xs"
                  title="Scroll to bottom of table"
                >
                  Bottom
                </button>
              </div>
            </div>

            {/* Approvals Table Container */}
            <div className="glass rounded-3xl border border-gray-200/60 dark:border-gray-800/60 overflow-hidden shadow-sm">
              <div ref={approvalsTableRef} className="overflow-x-auto max-h-[520px] overflow-y-auto scroll-smooth">
                <table className="w-full text-left border-collapse text-xs min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-slate-900/60 font-black text-gray-500 uppercase tracking-wider">
                      <th className="p-4">Candidate</th>
                      <th className="p-4">Target Career Role</th>
                      <th className="p-4 text-center text-slate-800 dark:text-slate-100 font-extrabold">Appointed Position</th>
                      <th className="p-4">Registered Date</th>
                      <th className="p-4">Website Access Status</th>
                      <th className="p-4 text-center">Inspect Telemetry</th>
                      <th className="p-4 text-right">Approval Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/60 dark:divide-gray-800/60">
                    {candidates
                      .filter(c => approvalFilter === 'ALL' || (c.approvalStatus || 'APPROVED') === approvalFilter)
                      .map((c) => {
                        const st = c.approvalStatus || 'APPROVED';
                        return (
                          <tr key={c.email} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                            <td className="p-4">
                              <div className="font-extrabold text-sm text-gray-900 dark:text-white">{c.fullName}</div>
                              <div className="text-gray-500 font-mono text-[11px]">{c.email}</div>
                            </td>
                            <td className="p-4">
                              <span className="font-bold text-gray-700 dark:text-gray-300">{c.targetCareerRole || 'Full Stack Java Developer'}</span>
                            </td>
                            {/* Appointed Position / Role Cell */}
                            <td className="p-4 text-center">
                              {isProtectedMainAdmin(c.email) ? (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-400 text-slate-950 border border-amber-300 shadow-sm" title="Infosys Enterprise Standard: Root Primary System Administrator">
                                  <Shield className="w-3.5 h-3.5 text-slate-950" />
                                  <span>Protected Main Admin</span>
                                  <Lock className="w-3 h-3 text-slate-950" />
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1 font-tech">
                                  <select
                                    value={c.role || 'ROLE_USER'}
                                    onChange={(e) => handleUpdateCandidatePosition(c.email, e.target.value)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer shadow-sm ${
                                      c.role === 'ROLE_ADMIN'
                                        ? 'bg-amber-100 dark:bg-slate-900 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-600 ring-1 ring-amber-400/30'
                                        : c.role === 'ROLE_RECRUITER' || c.role === 'ROLE_MANAGER'
                                        ? 'bg-indigo-100 dark:bg-slate-900 text-indigo-900 dark:text-indigo-300 border-indigo-400 dark:border-indigo-600 ring-1 ring-indigo-400/30'
                                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 ring-1 ring-slate-400/20'
                                    }`}
                                    title="Appoint position: Candidate, Recruiter, Administrator"
                                  >
                                    <option value="ROLE_USER" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium">Candidate</option>
                                    <option value="ROLE_RECRUITER" className="bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-300 font-medium">Appoint as Recruiter</option>
                                    {isAdmin && <option value="ROLE_ADMIN" className="bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 font-medium">Appoint as Administrator</option>}
                                  </select>
                                  <span className="text-[10px] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                                    {c.role === 'ROLE_RECRUITER' || c.role === 'ROLE_MANAGER' ? 'Talent Recruiter' : c.role === 'ROLE_ADMIN' ? 'Platform Admin' : 'Job Seeker'}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="p-4 text-gray-500">
                              {new Date(c.submissionDate || Date.now()).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              {st === 'APPROVED' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px] font-black border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Approved (Can Enter Website)
                                </span>
                              )}
                              {st === 'PENDING_APPROVAL' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[11px] font-black border border-amber-300 animate-pulse">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  Pending Admin Approval
                                </span>
                              )}
                              {st === 'REJECTED' && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[11px] font-black border border-rose-300">
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  Access Blocked
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCandidate(c);
                                    setDossierSubTab('voice');
                                  }}
                                  className="px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200 transition inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Answers</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(c)}
                                  className="px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-1 cursor-pointer"
                                  title="Recruiter: Edit candidate profile & skills"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>Edit Skills</span>
                                </button>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Inspect Resume Document */}
                                <button
                                  type="button"
                                  onClick={() => handleInspectDocument(c)}
                                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-300 transition cursor-pointer"
                                  title="Inspect submitted PDF / DOCX resume file to verify credentials"
                                >
                                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                                </button>

                                {/* Admin Set Password */}
                                {isAdmin && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAdminResetCandidate(c);
                                      setAdminNewPassword('');
                                    }}
                                    className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition cursor-pointer"
                                    title="Admin: Set or reset login password for this account"
                                  >
                                    <Key className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {isProtectedMainAdmin(c.email) ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 shadow-xs" title="Protected Main Admin - Permanent Access">
                                    <Lock className="w-3 h-3 text-emerald-600" />
                                    <span>Permanent Access</span>
                                  </span>
                                ) : st !== 'APPROVED' ? (
                                  <button
                                    onClick={() => handleUpdateApprovalStatus(c.email, 'APPROVED')}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-sm transition inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Approve</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateApprovalStatus(c.email, 'REJECTED')}
                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 rounded-xl font-bold text-xs transition inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Revoke</span>
                                  </button>
                                )}

                                {/* Remove request completely from interface */}
                                {isProtectedMainAdmin(c.email) ? (
                                  <span className="p-1.5 rounded-xl text-gray-300 dark:text-gray-700 cursor-not-allowed" title="Protected Main Admin cannot be deleted">
                                    <Lock className="w-3.5 h-3.5" />
                                  </span>
                                ) : (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCandidateRequest(c.email)}
                                  className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 transition cursor-pointer"
                                  title="Remove this registration request completely from the interface"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: CANDIDATE RANKINGS & LEADERBOARD */}
        {activeTab === 'rankings' && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Evaluated Candidates"
                value={candidates.length}
                icon={Users}
                color="indigo"
                subtitle="Active candidate dossiers"
              />
              <StatCard
                title="Avg Composite Readiness"
                value={`${avgReadiness}%`}
                icon={Trophy}
                color="emerald"
                subtitle="Across ATS, skills, interview, voice"
              />
              <StatCard
                title="Locked / Submitted"
                value={lockedCount}
                icon={Lock}
                color="purple"
                subtitle="Profiles sealed from candidate edit"
              />
              <StatCard
                title="Pending Certifications"
                value={pendingApprovalsCount}
                icon={Award}
                color="amber"
                subtitle="Awaiting administrative audit"
              />
            </div>

            {/* Privacy notice banner */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-emerald-950/20 border border-indigo-200/80 dark:border-emerald-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-900 dark:text-emerald-300 font-medium">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>Recruiter Data Privacy Boundary Active:</strong> Standard candidates can strictly view only their own profile & credentials. Administrative users and recruiters hold cross-candidate talent access, scoring overrides, and profile lock controls.
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="glass p-5 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by candidate name, email, or skill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Role Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs font-bold"
                  >
                    <option value="ALL">All Engineering Disciplines</option>
                    <option value="Full Stack Java">Full Stack Java</option>
                    <option value="DevOps">DevOps & Cloud</option>
                    <option value="Machine Learning">Machine Learning / AI</option>
                    <option value="Frontend">Frontend React</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs font-bold"
                  >
                    <option value="COMPOSITE">Sort: Highest Composite Rank</option>
                    <option value="ATS">Sort: ATS Resume Score</option>
                    <option value="INTERVIEW">Sort: Technical Interview Score</option>
                    <option value="VOICE">Sort: Voice Articulation Score</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Candidates Leaderboard Table / Cards */}
            <div className="space-y-4">
              {rankedCandidates.length === 0 ? (
                <div className="glass p-12 text-center rounded-3xl border border-gray-200/50 dark:border-gray-800/50">
                  <p className="text-gray-500 text-sm">No candidate matches the specified search filter criteria.</p>
                </div>
              ) : (
                rankedCandidates.map((cand, index) => {
                  const rank = index + 1;
                  const isTop1 = rank === 1;
                  const isTop2 = rank === 2;
                  const isTop3 = rank === 3;

                  return (
                    <div
                      key={cand.email}
                      className={`p-6 rounded-3xl glass border transition-all hover:shadow-lg space-y-5 ${
                        isTop1
                          ? 'border-amber-400/60 dark:border-amber-500/40 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent'
                          : isTop2
                          ? 'border-slate-300/80 dark:border-slate-600/60'
                          : isTop3
                          ? 'border-amber-700/40 dark:border-amber-600/40'
                          : 'border-gray-200/60 dark:border-gray-800/60'
                      }`}
                    >
                      {/* Top Row: Rank Badge + Candidate Information + Composite Score + Action Buttons */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                          {/* Rank Medallion */}
                          <div
                            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-md ${
                              isTop1
                                ? 'bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-slate-950 font-black'
                                : isTop2
                                ? 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 font-black'
                                : isTop3
                                ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white font-black'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {isTop1 ? (
                              <>
                                <Trophy className="w-5 h-5 text-slate-950" />
                                <span className="text-[10px] uppercase font-black tracking-wider">#1</span>
                              </>
                            ) : isTop2 ? (
                              <>
                                <Medal className="w-5 h-5 text-slate-900" />
                                <span className="text-[10px] uppercase font-black tracking-wider">#2</span>
                              </>
                            ) : isTop3 ? (
                              <>
                                <Award className="w-5 h-5 text-white" />
                                <span className="text-[10px] uppercase font-black tracking-wider">#3</span>
                              </>
                            ) : (
                              <span className="font-mono text-base font-extrabold">#{rank}</span>
                            )}
                          </div>

                          {/* Candidate Identity */}
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                                {cand.fullName}
                              </h3>
                              {/* Lock status pill */}
                              {cand.isProfileLocked ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                                  <Lock className="w-3 h-3" />
                                  <span>Locked Profile (Submitted)</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300">
                                  <Unlock className="w-3 h-3" />
                                  <span>Pre-Submission (Editable)</span>
                                </span>
                              )}

                              {cand.approvalStatus === 'PENDING_APPROVAL' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 animate-pulse">
                                  <Clock className="w-3 h-3" />
                                  <span>Pending Approval</span>
                                </span>
                              ) : cand.approvalStatus === 'REJECTED' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300">
                                  <XCircle className="w-3 h-3" />
                                  <span>Access Blocked</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Approved Access</span>
                                </span>
                              )}

                              {isTop1 && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-sm uppercase tracking-wider">
                                  Top Recommendation
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                              {cand.targetCareerRole} &bull; <span className="text-gray-500 font-normal">{cand.email}</span>
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1 max-w-2xl">
                              {cand.bio || 'Full stack competency evaluation with certified technical proficiencies.'}
                            </p>
                          </div>
                        </div>

                        {/* Composite Score & Actions */}
                        <div className="flex flex-wrap items-center gap-4 lg:self-center">
                          {/* Composite Score Circle / Badge */}
                          <div className="text-right">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">
                              Composite Score
                            </span>
                            <span className={`text-2xl font-black ${
                              cand.compositeScore >= 90 
                                ? 'text-emerald-600 dark:text-emerald-400' 
                                : cand.compositeScore >= 80 
                                ? 'text-indigo-600 dark:text-indigo-400' 
                                : 'text-amber-600 dark:text-amber-400'
                            }`}>
                              {cand.compositeScore}%
                            </span>
                          </div>

                          {/* Action Toolbar */}
                          <div className="flex items-center gap-2">
                            {/* Quick Approve Access Button if pending */}
                            {cand.approvalStatus === 'PENDING_APPROVAL' && (
                              <button
                                onClick={() => handleUpdateApprovalStatus(cand.email, 'APPROVED')}
                                className="px-3 py-2 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition"
                                title="Approve candidate registration and allow login"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            )}


                            {/* Appoint Position Quick Action with Protected Main Admin */}
                            {isProtectedMainAdmin(cand.email) ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black bg-amber-400 text-slate-950 border border-amber-300 shadow-xs" title="Root Super Administrator - Protected Account">
                                <Shield className="w-3.5 h-3.5 text-slate-950" />
                                <span>Protected Main Admin</span>
                              </span>
                            ) : (
                              <select
                                value={cand.role || 'ROLE_USER'}
                                onChange={(e) => handleUpdateCandidatePosition(cand.email, e.target.value)}
                                className={`px-3 py-2 rounded-xl text-xs font-black border transition cursor-pointer shadow-sm ${
                                  cand.role === 'ROLE_ADMIN'
                                    ? 'bg-amber-100 dark:bg-slate-900 text-amber-900 dark:text-amber-300 border-amber-400 dark:border-amber-600 ring-1 ring-amber-400/30'
                                    : cand.role === 'ROLE_RECRUITER' || cand.role === 'ROLE_MANAGER'
                                    ? 'bg-indigo-100 dark:bg-slate-900 text-indigo-900 dark:text-indigo-300 border-indigo-400 dark:border-indigo-600 ring-1 ring-indigo-400/30'
                                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-600 ring-1 ring-slate-400/20'
                                }`}
                                title="Appoint candidate position: Candidate, Recruiter, Administrator"
                              >
                                <option value="ROLE_USER" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold">Position: Candidate</option>
                                <option value="ROLE_RECRUITER" className="bg-white dark:bg-slate-900 text-indigo-900 dark:text-indigo-300 font-semibold">Make Recruiter</option>
                                {isAdmin && <option value="ROLE_ADMIN" className="bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-300 font-semibold">Make Administrator</option>}
                              </select>
                            )}
                            {/* View Dossier */}
                            <button
                              onClick={() => {
                                setSelectedCandidate(cand);
                                setDossierSubTab('voice');
                              }}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition"
                              title="View full candidate telemetry dossier"
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Inspect Dossier</span>
                            </button>

                            {/* Lock / Unlock Toggle */}
                            <button
                              onClick={() => handleToggleLock(cand)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                                cand.isProfileLocked
                                  ? 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300'
                                  : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                              }`}
                              title={cand.isProfileLocked ? "Admin: Unlock profile to permit candidate changes" : "Admin: Lock profile to freeze candidate submissions"}
                            >
                              {cand.isProfileLocked ? (
                                <>
                                  <Unlock className="w-3.5 h-3.5" />
                                  <span>Unlock Profile</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  <span>Lock Profile</span>
                                </>
                              )}
                            </button>

                            {/* Inspect Resume Document */}
                            <button
                              type="button"
                              onClick={() => handleInspectDocument(cand)}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-300 border border-slate-300 dark:border-gray-700 transition flex items-center gap-1.5 cursor-pointer"
                              title="Inspect submitted PDF/DOCX resume file to check if skills are real"
                            >
                              <FileText className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Inspect Resume</span>
                            </button>

                            {/* Admin Reset Password */}
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAdminResetCandidate(cand);
                                  setAdminNewPassword('');
                                }}
                                className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition flex items-center gap-1.5 cursor-pointer"
                                title="Admin: Set or reset login password for this account"
                              >
                                <Key className="w-3.5 h-3.5" />
                                <span>Set Password</span>
                              </button>
                            )}

                            {/* Edit Candidate Profile & Skills (Recruiter & Admin) */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(cand)}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow flex items-center gap-1.5 transition cursor-pointer"
                              title="Recruiter/Admin: Add skills, update competencies, or adjust candidate role"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Candidate & Skills</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Multi-Dimensional Metrics Breakdown Bar */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-200/50 dark:border-gray-800/50">
                        {/* ATS Score */}
                        <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                            <span className="flex items-center gap-1">
                              <FileText className="w-3 h-3 text-indigo-500" />
                              <span>ATS Parse Match</span>
                            </span>
                            <span className="font-black text-gray-800 dark:text-gray-200">{cand.atsScore || 90}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${cand.atsScore || 90}%` }} />
                          </div>
                        </div>

                        {/* Skill Match */}
                        <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-500" />
                              <span>Competency Align</span>
                            </span>
                            <span className="font-black text-gray-800 dark:text-gray-200">{cand.skillMatchScore || 88}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cand.skillMatchScore || 88}%` }} />
                          </div>
                        </div>

                        {/* AI Technical Interview */}
                        <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                            <span className="flex items-center gap-1">
                              <Bot className="w-3 h-3 text-purple-500" />
                              <span>AI Tech Interview</span>
                            </span>
                            <span className="font-black text-gray-800 dark:text-gray-200">{cand.interviewScore || 85}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${cand.interviewScore || 85}%` }} />
                          </div>
                        </div>

                        {/* AI Voice Articulation */}
                        <div className="p-3 rounded-2xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40">
                          <div className="flex items-center justify-between text-[11px] font-bold text-gray-500 mb-1">
                            <span className="flex items-center gap-1">
                              <Mic className="w-3 h-3 text-amber-500" />
                              <span>Voice Articulation</span>
                            </span>
                            <span className="font-black text-gray-800 dark:text-gray-200">{cand.voiceScore || 88}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${cand.voiceScore || 88}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Technical Skills Inventory Pills */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-gray-400 mr-1">Verified Skills:</span>
                        {cand.skills && cand.skills.length > 0 ? (
                          cand.skills.slice(0, 6).map((s, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                            >
                              {s.skillName || s.name} {s.proficiencyLevel ? `(${s.proficiencyLevel.slice(0, 3)})` : ''}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No skills registered</span>
                        )}
                        {cand.skills && cand.skills.length > 6 && (
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            +{cand.skills.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CERTIFICATE APPROVALS */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-indigo-300/40 dark:border-indigo-800/50 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200/50 dark:border-gray-800/50">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-amber-500" />
                    <span>Candidate Competency Certificate Approval Queue</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Candidate certificates can only be officially validated upon administrator review and cryptographic seal approval.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300">
                    {pendingApprovalsCount} Awaiting Review
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                    {certRequests.filter(r => r.status === 'APPROVED').length} Authenticated
                  </span>
                </div>
              </div>

              {certRequests.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No certificate requests submitted at this time.
                </div>
              ) : (
                <div className="space-y-4">
                  {certRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-white/60 dark:bg-darkcard/60 border border-gray-200/50 dark:border-gray-800/60 shadow-sm hover:shadow transition space-y-4"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-gray-900 dark:text-white">
                              {req.candidateName}
                            </h4>
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                              req.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                                : req.status === 'REJECTED'
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 animate-pulse'
                            }`}>
                              {req.status === 'APPROVED' ? 'Approved & Validated' : req.status === 'REJECTED' ? 'Rejected' : 'Pending Admin Approval'}
                            </span>
                          </div>
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                            {req.careerRole} &bull; <span className="text-gray-500 font-normal">{req.candidateEmail}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Requested: {req.requestDate ? new Date(req.requestDate).toLocaleString() : 'Recent'} &bull; Verification Code: <strong className="font-mono text-gray-800 dark:text-gray-200">{req.verificationCode || 'PENDING'}</strong>
                          </p>
                        </div>

                        {/* Approval Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Inspect Candidate Resume Document */}
                          <button
                            type="button"
                            onClick={() => {
                              const found = candidates.find(c => (c.email || '').toLowerCase().trim() === (req.candidateEmail || '').toLowerCase().trim());
                              handleInspectDocument(found || { fullName: req.candidateName, email: req.candidateEmail, targetCareerRole: req.careerRole });
                            }}
                            className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-300 border border-slate-300 dark:border-gray-700 transition flex items-center gap-1.5 cursor-pointer"
                            title="Inspect submitted PDF / DOCX resume file to verify if claimed skills are authentic"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-500" />
                            <span>Inspect Resume</span>
                          </button>

                          {req.status !== 'APPROVED' ? (
                            <button
                              onClick={() => handleApproveCert(req.id)}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Authorize & Add Skills to Profile</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-300">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Skills Approved in Profile</span>
                            </div>
                          )}

                          {req.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleRejectCert(req.id)}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}

                          {/* Dismiss / Remove completed request from interface */}
                          <button
                            type="button"
                            onClick={() => handleRemoveCertRequest(req.id)}
                            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 transition cursor-pointer"
                            title="Dismiss & Remove Completed Request from Interface"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Display Requested Skills */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/40">
                        {req.skills?.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                          >
                            {s.name} &bull; <strong className="text-indigo-600 dark:text-indigo-400">{s.proficiency}</strong> ({s.years} yrs)
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}


        {/* TAB: CANDIDATE SKILL REQUESTS (ADMIN & RECRUITER) */}
        {activeTab === 'skill_requests' && (
          <div className="space-y-6">
            <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/60 dark:border-gray-800/60">
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-600 dark:text-emerald-400" />
                    <span>Candidate Skill Requests & Endorsement Audit</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-mono">
                      {skillRequests.length} Total
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Review candidate-submitted requests for newly acquired competencies, frameworks, and technical credentials. Authorize to append to verified candidate profiles.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-tech">
                  {['ALL', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'].map((filterVal) => (
                    <button
                      key={filterVal}
                      type="button"
                      onClick={() => setSkillRequestFilter(filterVal)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        skillRequestFilter === filterVal
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200'
                      }`}
                    >
                      {filterVal === 'ALL' ? 'All Requests' : filterVal === 'PENDING_APPROVAL' ? 'Pending Review' : filterVal === 'APPROVED' ? 'Approved' : 'Rejected'}
                    </button>
                  ))}
                </div>
              </div>

              {skillRequests.filter(r => skillRequestFilter === 'ALL' || (r.status || 'PENDING_APPROVAL') === skillRequestFilter).length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">No Skill Requests Matching Selected Filter</h4>
                  <p className="text-xs text-gray-500">All submitted candidate competencies have been processed.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skillRequests
                    .filter(r => skillRequestFilter === 'ALL' || (r.status || 'PENDING_APPROVAL') === skillRequestFilter)
                    .map((req) => (
                      <div
                        key={req.id}
                        className="p-5 rounded-2xl bg-white/60 dark:bg-darkcard/60 border border-gray-200/60 dark:border-gray-800/60 shadow-xs space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                <span>{req.candidateName}</span>
                                <span className="text-xs font-normal text-gray-400 font-mono">({req.candidateEmail})</span>
                              </h4>
                              <p className="text-xs text-indigo-600 dark:text-emerald-400 font-bold">
                                {req.targetCareerRole || 'Engineering Candidate'}
                              </p>
                            </div>

                            <div>
                              {req.status === 'APPROVED' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  Approved in Profile
                                </span>
                              ) : req.status === 'REJECTED' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                  Rejected
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 animate-pulse">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  Pending Review
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Skill Card Details */}
                          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                                <Cpu className="w-4 h-4 text-indigo-500" />
                                <span>{req.skillName}</span>
                              </span>
                              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                                <span className="px-2 py-0.5 rounded bg-white dark:bg-darkcard border border-gray-200 dark:border-gray-700 font-bold">
                                  {req.category}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200">
                                  {req.proficiencyLevel}
                                </span>
                                <span className="text-gray-500">{req.yearsExperience} yrs</span>
                              </div>
                            </div>

                            {req.justification && (
                              <p className="text-xs text-gray-600 dark:text-gray-300 italic pt-1 border-t border-gray-200/60 dark:border-gray-800">
                                &ldquo;{req.justification}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 flex-wrap gap-2">
                          <span className="text-[10px] text-gray-400">
                            Requested: {new Date(req.requestedAt).toLocaleDateString()}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Inspect Resume */}
                            <button
                              type="button"
                              onClick={() => {
                                const found = candidates.find(c => (c.email || '').toLowerCase().trim() === (req.candidateEmail || '').toLowerCase().trim());
                                handleInspectDocument(found || { fullName: req.candidateName, email: req.candidateEmail, targetCareerRole: req.targetCareerRole });
                              }}
                              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-gray-300 border border-slate-300 dark:border-gray-700 transition flex items-center gap-1 cursor-pointer"
                              title="Inspect resume to verify candidate skill credentials"
                            >
                              <FileText className="w-3.5 h-3.5 text-indigo-500" />
                              <span>Inspect</span>
                            </button>

                            {req.status !== 'APPROVED' ? (
                              <button
                                type="button"
                                onClick={() => handleApproveSkillRequest(req.id)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve & Add Skill</span>
                              </button>
                            ) : (
                              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Cataloged in Profile</span>
                              </span>
                            )}

                            {req.status !== 'REJECTED' && (
                              <button
                                type="button"
                                onClick={() => handleRejectSkillRequest(req.id)}
                                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition flex items-center gap-1 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveSkillRequest(req.id)}
                              className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 transition cursor-pointer"
                              title="Dismiss request"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ENTERPRISE REQUISITIONS */}
        {activeTab === 'jobs' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Job Form */}
            <div className="glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                <span>Publish Enterprise Requisition</span>
              </h3>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Position Title</label>
                  <input
                    type="text"
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g. Senior Full Stack Java Developer"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      required
                      value={newJob.company}
                      onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      placeholder="TechCorp Solutions"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Work Location</label>
                    <input
                      type="text"
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Seniority Level</label>
                    <select
                      value={newJob.experienceLevel}
                      onChange={(e) => setNewJob({ ...newJob, experienceLevel: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                    >
                      {EXPERIENCE_LEVELS.map((l) => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Compensation Range</label>
                    <input
                      type="text"
                      value={newJob.salaryRange}
                      onChange={(e) => setNewJob({ ...newJob, salaryRange: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Requisition Description & Core Competencies</label>
                  <textarea
                    rows="3"
                    required
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder="Detailed position responsibilities, architectural duties, and core skills..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-darkcard text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-sm font-bold text-white gradient-btn rounded-xl shadow-md flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Authorize & Publish Requisition</span>
                </button>
              </form>
            </div>

            {/* Active Job Postings List */}
            <div className="glass p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Enterprise Requisitions ({jobs.length})</h3>

              {loading ? (
                <SkeletonLoader count={3} />
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {jobs.map((j) => (
                    <div key={j.id} className="p-4 rounded-2xl bg-white/40 dark:bg-darkcard/40 border border-gray-200/30 dark:border-gray-800/30 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{j.title}</h4>
                        <p className="text-xs text-gray-500">{j.company} &bull; {j.location} &bull; {j.experienceLevel}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteJob(j.id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MASTER SKILLS REGISTRY */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add New Master Skill */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-500" />
                <span>Register Technical Competency</span>
              </h3>
              <p className="text-xs text-gray-500">
                Skills registered here become available in candidate profiles, assessment simulations, and verified certificate audits.
              </p>

              <form onSubmit={handleCreateSkill} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Skill Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js 15, Rust, Apache Kafka"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <select
                      value={newSkill.category}
                      onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-xs"
                    >
                      {SKILL_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Demand Index (1-100)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={newSkill.marketDemandScore}
                      onChange={(e) => setNewSkill({ ...newSkill, marketDemandScore: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-darkcard text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white gradient-btn rounded-xl shadow flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Competency</span>
                </button>
              </form>
            </div>

            {/* List of Registered Competencies */}
            <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                Active Master Skills Taxonomy ({skills.length})
              </h3>
              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {skills.map((s) => (
                  <div
                    key={s.id || s.name}
                    className="p-3 rounded-xl bg-white/50 dark:bg-darkcard/50 border border-gray-200/40 dark:border-gray-800/40 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 dark:text-white">{s.name}</h4>
                      <p className="text-[11px] text-gray-500">{s.category} &bull; Demand Score: {s.marketDemandScore || 85}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteSkill(s.id)}
                      className="text-rose-500 hover:text-rose-700 p-1.5 transition"
                      title="Delete competency"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: COMPREHENSIVE CANDIDATE TELEMETRY & APPROVAL DOSSIER */}
        {selectedCandidate && (() => {
          const candidateVoiceRecords = getCandidateVoiceRecords(selectedCandidate);
          const candidateInterviewAttempts = getCandidateInterviewAttempts(selectedCandidate);
          const compScore = calculateCompositeScore(selectedCandidate);

          return (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
              <div className="glass max-w-4xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
                
                {/* Header: Candidate Identity & Approval Status Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/60 dark:border-gray-800/60">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                      {selectedCandidate.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                        <span>{selectedCandidate.fullName}</span>
                        {/* Approval status badge */}
                        {(selectedCandidate.approvalStatus === 'PENDING_APPROVAL') ? (
                          <span className="text-[11px] font-black px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 animate-pulse">
                            Pending Admin Approval
                          </span>
                        ) : (selectedCandidate.approvalStatus === 'REJECTED') ? (
                          <span className="text-[11px] font-black px-3 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300">
                            Access Rejected
                          </span>
                        ) : (
                          <span className="text-[11px] font-black px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                            Approved Access
                          </span>
                        )}

                        {/* Position Role Badge & Action with Protected Main Admin */}
                        {isProtectedMainAdmin(selectedCandidate.email) ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 border border-amber-300 shadow-sm">
                            <Shield className="w-3.5 h-3.5 text-slate-950" />
                            <span>Protected Main Admin (Locked)</span>
                            <Lock className="w-3 h-3 text-slate-950" />
                          </span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-xs ${
                              selectedCandidate.role === 'ROLE_ADMIN'
                                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-400 dark:border-amber-600'
                                : selectedCandidate.role === 'ROLE_RECRUITER' || selectedCandidate.role === 'ROLE_MANAGER'
                                ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-950 dark:text-indigo-200 border-indigo-400 dark:border-indigo-600'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600'
                            }`}>
                              Position: {selectedCandidate.role === 'ROLE_ADMIN' ? 'Administrator' : selectedCandidate.role === 'ROLE_RECRUITER' || selectedCandidate.role === 'ROLE_MANAGER' ? 'Recruiter' : 'Candidate'}
                            </span>

                            {/* One-click Action to Appoint as Recruiter or Admin */}
                            {selectedCandidate.role === 'ROLE_USER' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCandidatePosition(selectedCandidate.email, 'ROLE_RECRUITER')}
                                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1 cursor-pointer shadow-xs"
                                  title="Appoint this candidate to Recruiter position"
                                >
                                  <Briefcase className="w-3 h-3" />
                                  <span>Make Recruiter</span>
                                </button>
                                {isAdmin && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCandidatePosition(selectedCandidate.email, 'ROLE_ADMIN')}
                                    className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition flex items-center gap-1 cursor-pointer shadow-xs border border-white/20"
                                    title="Elevate this candidate to Platform Administrator"
                                  >
                                    <Shield className="w-3 h-3 text-amber-400 dark:text-white" />
                                    <span>Make Admin</span>
                                  </button>
                                )}
                              </>
                            )}

                            {(selectedCandidate.role === 'ROLE_RECRUITER' || selectedCandidate.role === 'ROLE_MANAGER') && (
                              <>
                                {isAdmin && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateCandidatePosition(selectedCandidate.email, 'ROLE_ADMIN')}
                                    className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition flex items-center gap-1 cursor-pointer shadow-xs border border-white/20"
                                    title="Elevate Recruiter to Platform Administrator"
                                  >
                                    <Shield className="w-3 h-3 text-amber-400 dark:text-white" />
                                    <span>Make Admin</span>
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCandidatePosition(selectedCandidate.email, 'ROLE_USER')}
                                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-950 dark:text-purple-300 transition flex items-center gap-1 cursor-pointer"
                                  title="Reassign to Candidate position"
                                >
                                  <User className="w-3 h-3" />
                                  <span>Reassign as Candidate</span>
                                </button>
                              </>
                            )}

                            {selectedCandidate.role === 'ROLE_ADMIN' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCandidatePosition(selectedCandidate.email, 'ROLE_RECRUITER')}
                                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1 cursor-pointer"
                                  title="Reassign to Recruiter position"
                                >
                                  <Briefcase className="w-3 h-3" />
                                  <span>Reassign as Recruiter</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateCandidatePosition(selectedCandidate.email, 'ROLE_USER')}
                                  className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 hover:bg-purple-200 text-purple-800 dark:bg-purple-950 dark:text-purple-300 transition flex items-center gap-1 cursor-pointer"
                                  title="Reassign to Candidate position"
                                >
                                  <User className="w-3 h-3" />
                                  <span>Reassign as Candidate</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}

                        {selectedCandidate.isProfileLocked && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300">
                            Profile Locked
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                        {selectedCandidate.targetCareerRole} &bull; <span className="text-gray-500 font-normal font-mono">{selectedCandidate.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Action buttons for approval right in the modal */}
                    {selectedCandidate.approvalStatus !== 'APPROVED' ? (
                      <button
                        onClick={() => handleUpdateApprovalStatus(selectedCandidate.email, 'APPROVED')}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-sm transition inline-flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve Access</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateApprovalStatus(selectedCandidate.email, 'REJECTED')}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 rounded-xl font-bold text-xs transition inline-flex items-center gap-1.5"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Revoke Access</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Sub-Tabs Navigation */}
                <div className="flex flex-wrap gap-2 border-b border-gray-200/60 dark:border-gray-800/60 pb-3">
                  <button
                    onClick={() => setDossierSubTab('voice')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      dossierSubTab === 'voice'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span>AI Voice Screening Telemetry ({candidateVoiceRecords.length})</span>
                  </button>

                  <button
                    onClick={() => setDossierSubTab('interview')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      dossierSubTab === 'interview'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Bot className="w-4 h-4 text-indigo-400" />
                    <span>Technical Interview (10 Questions) ({candidateInterviewAttempts.length})</span>
                  </button>

                  <button
                    onClick={() => setDossierSubTab('profile')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      dossierSubTab === 'profile'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <span>Skills & Portfolio Overview</span>
                  </button>
                </div>

                {/* SUB-TAB 1: VOICE SCREENING TELEMETRY */}
                {dossierSubTab === 'voice' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                      <span className="font-semibold">
                        Verbal screening recordings captured via acoustic speech-to-text. Visible strictly to reviewing admins and recruiters.
                      </span>
                      <span className="font-black text-emerald-700 dark:text-emerald-300 text-xs font-mono">
                        Voice Score: {selectedCandidate.voiceScore || 90}%
                      </span>
                    </div>

                    {candidateVoiceRecords.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-xs">
                        <Mic className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                        <p className="font-bold">No voice screening recordings on file for {selectedCandidate.fullName}.</p>
                        <p>Once the candidate records responses in the AI Voice Screening Studio, their spoken transcripts will appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {candidateVoiceRecords.map((vr, idx) => (
                          <div key={vr.id || idx} className="p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                  Voice Prompt #{idx + 1}
                                </span>
                                <h4 className="font-black text-sm text-gray-900 dark:text-white">
                                  {vr.question}
                                </h4>
                                <p className="text-[11px] text-gray-500">
                                  Recorded on {new Date(vr.timestamp || Date.now()).toLocaleDateString()} &bull; Duration: {vr.durationSeconds || 45}s
                                </p>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] font-bold text-gray-500 block uppercase">Overall Voice Score</span>
                                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                                  {vr.overall || 85}%
                                </span>
                              </div>
                            </div>

                            {/* Word-for-word Transcript */}
                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 block">
                                Spoken Word-for-Word Transcript:
                              </span>
                              <p className="text-xs text-slate-800 dark:text-gray-200 leading-relaxed italic">
                                "{vr.transcript}"
                              </p>
                            </div>

                            {/* Metrics Row */}
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/50">
                                <span className="text-gray-500 text-[10px] block font-bold">Clarity</span>
                                <span className="font-extrabold text-gray-900 dark:text-white">{vr.clarity || 88}%</span>
                              </div>
                              <div className="p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/50">
                                <span className="text-gray-500 text-[10px] block font-bold">Fluency</span>
                                <span className="font-extrabold text-gray-900 dark:text-white">{vr.fluency || 85}%</span>
                              </div>
                              <div className="p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/50">
                                <span className="text-gray-500 text-[10px] block font-bold">Technical Depth</span>
                                <span className="font-extrabold text-gray-900 dark:text-white">{vr.technicalDepth || 90}%</span>
                              </div>
                            </div>

                            {/* Keywords */}
                            {vr.detectedKeywords && vr.detectedKeywords.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Keywords Detected:</span>
                                {vr.detectedKeywords.map(kw => (
                                  <span key={kw} className="px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-bold text-[10px] border border-sky-300/50">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Evaluator Feedback */}
                            {vr.feedback && (
                              <p className="text-[11px] text-gray-700 dark:text-gray-300 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/20">
                                <strong>AI Evaluator Assessment:</strong> {vr.feedback}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-TAB 2: TECHNICAL INTERVIEW BREAKDOWN (10 QUESTIONS) */}
                {dossierSubTab === 'interview' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
                      <span className="font-semibold">
                        Full question-by-question candidate responses across 10 evaluation questions (5 Objective MCQs + 5 Descriptive Scenarios).
                      </span>
                      <span className="font-black text-indigo-700 dark:text-indigo-300 text-xs font-mono">
                        Interview Score: {selectedCandidate.interviewScore || 85}%
                      </span>
                    </div>

                    {candidateInterviewAttempts.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-xs">
                        <Bot className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                        <p className="font-bold">No technical interview simulations on file for {selectedCandidate.fullName}.</p>
                        <p>When the candidate takes the 10-question Technical Interview Simulation, their question-by-question responses will be recorded here.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {candidateInterviewAttempts.map((att, attIdx) => (
                          <div key={att.id || attIdx} className="space-y-4">
                            {/* Attempt Summary Banner */}
                            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-black text-[10px] mb-1">
                                  Attempt #{att.attemptNumber || attIdx + 1} &bull; {att.role || selectedCandidate.targetCareerRole}
                                </div>
                                <h4 className="font-black text-sm text-gray-900 dark:text-white">
                                  Simulation Completed on {new Date(att.timestamp || Date.now()).toLocaleDateString()}
                                </h4>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <span className="text-[10px] font-bold text-gray-500 block uppercase">Overall Attempt Score</span>
                                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                                    {att.overallScore || 88}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* 10 Questions Breakdown */}
                            <div className="space-y-3">
                              {(att.responses || []).map((resp, qIdx) => (
                                <div
                                  key={qIdx}
                                  className={`p-4 rounded-2xl border transition-all text-xs space-y-2.5 ${
                                    resp.questionType === 'objective'
                                      ? (resp.isCorrect
                                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700/50'
                                        : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-700/50')
                                      : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-0.5">
                                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                                        Question {qIdx + 1} &bull; {resp.questionType === 'objective' ? 'Objective MCQ' : 'Descriptive Architectural Scenario'}
                                      </span>
                                      <h5 className="font-extrabold text-xs text-gray-900 dark:text-white">
                                        {resp.question}
                                      </h5>
                                    </div>

                                    {resp.questionType === 'objective' ? (
                                      resp.isCorrect ? (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-black text-[10px] shrink-0 border border-emerald-400 inline-flex items-center gap-1">
                                          <CheckCircle2 className="w-3 h-3" /> Correct Choice (+100 Pts)
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-black text-[10px] shrink-0 border border-rose-400 inline-flex items-center gap-1">
                                          <XCircle className="w-3 h-3" /> Incorrect Choice
                                        </span>
                                      )
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-black text-[10px] shrink-0 border border-indigo-400">
                                        Score: {resp.overall || Math.round((resp.clarity + resp.relevance) / 2)}%
                                      </span>
                                    )}
                                  </div>

                                  {/* Candidate's submitted answer */}
                                  <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-950/60 border border-gray-200/80 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                                      Candidate's Answer:
                                    </span>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200 text-xs">
                                      {resp.answer}
                                    </p>
                                  </div>

                                  {/* Feedback / Explanation */}
                                  {resp.feedback && (
                                    <p className="text-[11px] text-gray-600 dark:text-gray-300 italic pt-0.5">
                                      <strong>AI Evaluator Note:</strong> {resp.feedback}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-TAB 3: SKILLS & PORTFOLIO OVERVIEW */}
                {dossierSubTab === 'profile' && (
                  <div className="space-y-5">
                    {/* Composite Score Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-gray-500">Talent Acquisition Composite Readiness</span>
                        <div className="text-2xl font-black text-indigo-600 dark:text-emerald-400">
                          {compScore}% Overall Alignment
                        </div>
                      </div>
                      <div className="text-right text-xs text-gray-500 space-y-0.5">
                        <p>ATS Match: <strong className="text-gray-900 dark:text-white">{selectedCandidate.atsScore || 90}%</strong></p>
                        <p>Tech Interview: <strong className="text-gray-900 dark:text-white">{selectedCandidate.interviewScore || 85}%</strong></p>
                        <p>Voice Articulation: <strong className="text-gray-900 dark:text-white">{selectedCandidate.voiceScore || 88}%</strong></p>
                      </div>
                    </div>

                    {/* Bio & Document metadata */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Professional Dossier Overview</h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-white/40 dark:bg-darkcard/40 p-3.5 rounded-xl border border-gray-200/40 dark:border-gray-800/40">
                        {selectedCandidate.bio || 'Enterprise candidate undergoing skill gap and competency evaluation.'}
                      </p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1.5 pt-1">
                        <FileText className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Resume Ingestion File: <strong>{selectedCandidate.resumeName || 'Candidate_Resume.pdf'}</strong></span>
                      </p>
                    </div>

                    {/* Technical Skills Inventory */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Technical Skills & Competency Metrics</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {selectedCandidate.skills?.map((s, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-white/60 dark:bg-darkcard/60 border border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between text-xs"
                          >
                            <span className="font-extrabold text-gray-900 dark:text-white">{s.skillName || s.name}</span>
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-emerald-400 bg-indigo-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-emerald-500/30">
                              {s.proficiencyLevel || 'ADVANCED'} ({s.yearsExperience || 2} yrs)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer controls */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200/60 dark:border-gray-800/60">
                  <button
                    onClick={() => {
                      handleToggleLock(selectedCandidate);
                      setSelectedCandidate(prev => ({ ...prev, isProfileLocked: !prev.isProfileLocked }));
                    }}
                    className="px-4 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5"
                  >
                    {selectedCandidate.isProfileLocked ? (
                      <>
                        <Unlock className="w-4 h-4 text-amber-500" />
                        <span>Unlock Candidate Profile</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-emerald-500" />
                        <span>Lock Candidate Profile</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const c = selectedCandidate;
                        setSelectedCandidate(null);
                        handleOpenEditModal(c);
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow transition flex items-center gap-1.5 cursor-pointer"
                      title="Recruiter: Add or update candidate skills"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Add / Edit Skills</span>
                    </button>
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="px-5 py-2 text-xs font-black text-white gradient-btn rounded-xl shadow cursor-pointer"
                    >
                      Close Dossier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* MODAL 2: ADMIN & RECRUITER EDIT CANDIDATE PROFILE MODAL */}
        {editingCandidate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-indigo-300/60 dark:border-indigo-800/60 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-4 border-b border-gray-200/60 dark:border-gray-800/60">
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>Recruiter & Administrator Profile Override: {editingCandidate.fullName}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    As an authorized recruiter or administrator, you have privileged authority to add candidate skills, adjust proficiency levels, and update career benchmarks.
                  </p>
                </div>
                <button
                  onClick={() => setEditingCandidate(null)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCandidateEdit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={editForm.email}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-slate-900 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Target Engineering Role</label>
                    <input
                      type="text"
                      required
                      value={editForm.targetCareerRole}
                      onChange={(e) => setEditForm({ ...editForm, targetCareerRole: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Seniority Experience Level</label>
                    <select
                      value={editForm.experienceLevel}
                      onChange={(e) => setEditForm({ ...editForm, experienceLevel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs font-bold"
                    >
                      {EXPERIENCE_LEVELS.map(l => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Score Adjustments */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/40 border border-indigo-100 dark:border-slate-700">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">ATS Score (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={editForm.atsScore}
                      onChange={(e) => setEditForm({ ...editForm, atsScore: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkcard text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Interview Score (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={editForm.interviewScore}
                      onChange={(e) => setEditForm({ ...editForm, interviewScore: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkcard text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">Voice Score (%)</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={editForm.voiceScore}
                      onChange={(e) => setEditForm({ ...editForm, voiceScore: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-darkcard text-xs"
                    />
                  </div>
                </div>


                {/* System Role Tier - Only Admins can grant Admin role */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    System Role Tier (Security & Access Level)
                  </label>
                  <div className="grid grid-cols-3 gap-2 font-tech">
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, role: 'ROLE_USER' })}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        editForm.role === 'ROLE_USER'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white dark:bg-darkcard text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      Candidate
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, role: 'ROLE_RECRUITER' })}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        editForm.role === 'ROLE_RECRUITER' || editForm.role === 'ROLE_MANAGER'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-darkcard text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      Recruiter
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!isAdmin) {
                          showToast('Access Denied: Only System Administrators can grant Admin privileges.', 'error');
                          return;
                        }
                        setEditForm({ ...editForm, role: 'ROLE_ADMIN' });
                      }}
                      className={`p-2 rounded-xl text-xs font-bold border transition ${
                        editForm.role === 'ROLE_ADMIN'
                          ? 'bg-slate-900 dark:bg-emerald-600 text-white border-slate-900 shadow-sm'
                          : 'bg-white dark:bg-darkcard text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                      } ${!isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                      title={!isAdmin ? 'Only System Administrators can grant Admin privileges' : 'Grant Administrator privileges'}
                    >
                      Admin {!isAdmin && '(Locked)'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Executive Recruiter Notes & Bio</label>
                  <textarea
                    rows="2"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs"
                  />
                </div>

                {/* Candidate Skills Management */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 dark:text-gray-200">
                      Candidate Verified Skills ({editForm.skills.length})
                    </label>
                  </div>

                  {/* Skills pill list with remove button */}
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                    {editForm.skills.length === 0 ? (
                      <p className="text-xs text-gray-400 italic p-1">No verified skills cataloged yet. Type below and click Add Skill.</p>
                    ) : (
                      editForm.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-darkcard text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 shadow-sm"
                        >
                          <span>{typeof s === 'string' ? s : (s.skillName || s.name || 'Competency')}</span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400">({typeof s === 'object' ? (s.proficiencyLevel || s.level || 'ADVANCED') : 'ADVANCED'})</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkillInEdit(idx)}
                            className="text-rose-500 hover:text-rose-700 ml-1 cursor-pointer"
                            title="Remove skill"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Add skill row */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add technical skill (e.g. AWS, Python, Kubernetes)..."
                      value={newSkillItem.skillName}
                      onChange={(e) => setNewSkillItem({ ...newSkillItem, skillName: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkillInEdit();
                        }
                      }}
                      className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs sm:col-span-2"
                    />
                    <select
                      value={newSkillItem.proficiencyLevel}
                      onChange={(e) => setNewSkillItem({ ...newSkillItem, proficiencyLevel: e.target.value })}
                      className="px-2 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs"
                    >
                      {PROFICIENCY_LEVELS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddSkillInEdit}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Skill</span>
                    </button>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200/60 dark:border-gray-800/60">
                  <button
                    type="button"
                    onClick={() => setEditingCandidate(null)}
                    className="px-4 py-2.5 text-xs font-bold rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-black text-white gradient-btn rounded-xl shadow-lg flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Candidate Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* ================= DOCUMENT INSPECTOR / RESUME PREVIEW MODAL ================= */}
      {inspectingDocument && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-darkcard max-w-3xl w-full p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <span>Document Inspector & Credential Audit</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200">
                      {inspectingDocument.fileName?.endsWith('.docx') ? 'DOCX DOCUMENT' : 'PDF RESUME'}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">
                    Candidate: <strong>{inspectingDocument.candidateName}</strong> ({inspectingDocument.candidateEmail})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingDocument(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block">FILE NAME</span>
                <span className="font-bold text-gray-900 dark:text-gray-200 truncate block">{inspectingDocument.fileName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block">SUBMITTED DATE</span>
                <span className="font-bold text-gray-900 dark:text-gray-200">{new Date(inspectingDocument.uploadedAt || Date.now()).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block">FILE SIZE</span>
                <span className="font-bold text-gray-900 dark:text-gray-200">{Math.round((inspectingDocument.fileSize || 45000) / 1024)} KB</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block">AUDIT STATUS</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Payload Stored</span>
                </span>
              </div>
            </div>

            {/* Extracted Skills Claim Badges */}
            {inspectingDocument.extractedSkills?.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Extracted Competency Claims ({inspectingDocument.extractedSkills.length})
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2.5 rounded-2xl bg-slate-50 dark:bg-darkbg border border-slate-200 dark:border-gray-800">
                  {inspectingDocument.extractedSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Document Text Preview */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Original Resume Text Content & Structure
              </label>
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto leading-relaxed border border-slate-800 whitespace-pre-wrap select-text">
                {inspectingDocument.rawText || 'No plain-text preview available. Document payload verified cryptographically.'}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setInspectingDocument(null)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Close Document Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADMIN SET / RESET USER PASSWORD MODAL ================= */}
      {adminResetCandidate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-darkcard max-w-md w-full p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-gray-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200 dark:border-amber-800">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Admin: Reset Password</h3>
                  <p className="text-xs text-gray-500 font-mono">{adminResetCandidate.fullName} ({adminResetCandidate.email})</p>
                </div>
              </div>
              <button
                onClick={() => setAdminResetCandidate(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminSetPasswordSubmit} className="space-y-4 font-tech">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
                  Assign New Login Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminNewPassword}
                    onChange={(e) => setAdminNewPassword(e.target.value)}
                    placeholder="Enter new account password"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-darkbg text-gray-900 dark:text-gray-100 text-xs font-sans focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  This overrides the password immediately across the login portal and account sessions.
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setAdminResetCandidate(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= RESET DIRECTORY CONFIRMATION MODAL ================= */}
      {showResetDirectoryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-darkcard max-w-md w-full p-6 sm:p-8 rounded-3xl border border-rose-200 dark:border-rose-900/60 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 font-sans">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-900">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">Confirm Directory Reset</h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">Safe Protection Warning</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
              Are you sure you want to reset the candidate directory? All candidate roster entries will be restored to enterprise benchmark presets. This prevents accidental data loss from unintentional clicks.
            </p>

            <div className="flex gap-2 justify-end pt-2 font-tech">
              <button
                type="button"
                onClick={() => setShowResetDirectoryModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition cursor-pointer"
              >
                Cancel Keep Data
              </button>
              <button
                type="button"
                onClick={handleConfirmResetDirectory}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Yes, Reset Directory</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
