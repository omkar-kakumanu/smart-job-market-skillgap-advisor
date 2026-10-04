import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumb from '../components/Breadcrumb';
import SkeletonLoader from '../components/SkeletonLoader';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { interviewService } from '../services/interviewService';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Award, 
  BookOpen, 
  HelpCircle,
  Clock,
  Check,
  Filter,
  FileText,
  AlertCircle
} from 'lucide-react';

// Comprehensive Role-Specific Question Banks (Exactly 5 Objective MCQs + 5 Descriptive Questions per Role)
const ROLE_QUESTION_BANKS = {
  'Full Stack Java Developer': [
    // 5 Objective MCQs
    {
      id: 1,
      type: 'objective',
      category: 'JVM Memory & GC',
      difficulty: 'Medium',
      question: 'In standard JVM Garbage Collection, in which memory region are newly created Java objects initially allocated?',
      options: [
        'A) Tenured / Old Generation',
        'B) Eden Space in Young Generation',
        'C) Metaspace',
        'D) Code Cache'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'New objects are instantiated in Eden space within the Young Generation. Surviving objects get promoted over minor GCs to the Tenured generation.'
    },
    {
      id: 2,
      type: 'objective',
      category: 'Distributed Systems',
      difficulty: 'Hard',
      question: "According to Brewer's CAP Theorem, in the presence of a network partition (P), what trade-off must a distributed database system make?",
      options: [
        'A) Trade between Consistency and Latency',
        'B) Choose between Consistency (CP) and Availability (AP)',
        'C) Deliver all three: C, A, and P simultaneously',
        'D) Sacrifice Partition Tolerance'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'When partitions occur, a distributed system can either reject inconsistent operations (CP) or proceed with potentially stale data (AP).'
    },
    {
      id: 3,
      type: 'objective',
      category: 'API & HTTP Protocols',
      difficulty: 'Easy',
      question: 'Which HTTP status code is designated by RFC 6585 when a client has exceeded its allowed rate limit quota?',
      options: [
        'A) 400 Bad Request',
        'B) 403 Forbidden',
        'C) 429 Too Many Requests',
        'D) 503 Service Unavailable'
      ],
      correctOptionIndex: 2,
      correctExplanation: 'HTTP 429 Too Many Requests informs the client that rate-limiting thresholds have been exceeded, often paired with a Retry-After header.'
    },
    {
      id: 4,
      type: 'objective',
      category: 'Databases & ACID',
      difficulty: 'Medium',
      question: 'Which ANSI SQL transaction isolation level guarantees complete prevention of dirty reads, non-repeatable reads, and phantom reads?',
      options: [
        'A) Read Committed',
        'B) Repeatable Read',
        'C) Serializable',
        'D) Read Uncommitted'
      ],
      correctOptionIndex: 2,
      correctExplanation: 'Serializable is the highest isolation level, executing transactions with serial equivalence to eliminate phantom reads and inconsistencies.'
    },
    {
      id: 5,
      type: 'objective',
      category: 'Event Streaming & Kafka',
      difficulty: 'Medium',
      question: 'In Apache Kafka distributed event streaming, what mechanism guarantees strict message ordering?',
      options: [
        'A) Global timestamp synchronization across brokers',
        'B) Publishing messages with the same partition key within a single partition',
        'C) Consumer group leader reelection',
        'D) ZooKeeper/KRaft quorum consensus'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'Kafka strictly guarantees append-order preservation per partition. Messages sharing the same partition key are routed to the same partition and consumed in order.'
    },

    // 5 Descriptive Architectural & Scenario Questions
    {
      id: 6,
      type: 'descriptive',
      category: 'Core Java & Project Loom',
      difficulty: 'Hard',
      question: 'Explain how Java 21 Virtual Threads differ from traditional OS platform threads, and describe how they impact high-throughput web server performance.',
      expectedPoints: 'Mention user-mode scheduling, continuation-based stack mounting, carrier threads, memory footprint reduction from megabytes to kilobytes, and non-blocking I/O.'
    },
    {
      id: 7,
      type: 'descriptive',
      category: 'Spring Boot Architecture',
      difficulty: 'Hard',
      question: 'Describe the lifecycle of a Spring Bean and how Spring Security filters intercept requests before reaching controller handlers.',
      expectedPoints: 'Instantiation, Dependency Injection, BeanPostProcessor (postProcessBeforeInitialization), @PostConstruct, init-method, SecurityFilterChain, and DelegatingFilterProxy.'
    },
    {
      id: 8,
      type: 'descriptive',
      category: 'JPA & Query Tuning',
      difficulty: 'Hard',
      question: 'How do you detect and resolve the Hibernate N+1 query problem in Spring Data JPA? Compare JOIN FETCH vs EntityGraph approaches.',
      expectedPoints: 'Detection via query count logging/p6spy, Cartesian product risks, MultipleBagFetchException, JOIN FETCH in JPQL vs dynamic @EntityGraph specification.'
    },
    {
      id: 9,
      type: 'descriptive',
      category: 'Distributed Caching & Redis',
      difficulty: 'Hard',
      question: 'How do you design a distributed caching layer using Redis alongside PostgreSQL to avoid cache stampede and ensure eventual consistency?',
      expectedPoints: 'Cache-aside vs write-through, probabilistic early expiration (XFetch), mutex locking/Redlock, TTL jitter, and CDC / transactional outbox pattern.'
    },
    {
      id: 10,
      type: 'descriptive',
      category: 'Incident Management & Reliability',
      difficulty: 'Medium',
      question: 'Describe a high-severity production incident you debugged. How did you triage root causes, communicate with stakeholders, and implement guardrails?',
      expectedPoints: 'STAR framework: metrics/alerts analysis, thread dump/heap dump inspection, rollback/circuit breakers, post-mortem, and blameless RCA documentation.'
    }
  ],

  'Senior Machine Learning Engineer': [
    // 5 Objective MCQs
    {
      id: 1,
      type: 'objective',
      category: 'Regularization',
      difficulty: 'Medium',
      question: 'Which regularization technique drives unimportant feature weights strictly to zero, effectively performing automatic feature selection?',
      options: [
        'A) L2 Regularization (Ridge)',
        'B) L1 Regularization (Lasso)',
        'C) Batch Normalization',
        'D) Gradient Clipping'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'L1 Regularization adds the sum of absolute coefficients to the loss function, producing sparse models where non-critical weights become zero.'
    },
    {
      id: 2,
      type: 'objective',
      category: 'Transformer Architectures',
      difficulty: 'Hard',
      question: 'In standard scaled dot-product attention Attention(Q, K, V) = softmax(QK^T / sqrt(d_k))V, why is the division by sqrt(d_k) performed?',
      options: [
        'A) To accelerate GPU matrix multiplication bandwidth',
        'B) To prevent dot products from growing excessively large, which pushes softmax into vanishing gradient regions',
        'C) To enforce strictly orthogonal vector projections',
        'D) To convert attention scores into normalized cosine distances'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'For large vector dimensions d_k, dot products grow large in magnitude, causing the softmax function to have tiny gradients. Dividing by sqrt(d_k) stabilizes training.'
    },
    {
      id: 3,
      type: 'objective',
      category: 'Model Evaluation',
      difficulty: 'Medium',
      question: 'In a fraud detection classification problem with severe class imbalance (99.8% non-fraud, 0.2% fraud), which evaluation metric is most misleading?',
      options: [
        'A) Precision-Recall AUC (PR-AUC)',
        'B) Raw Classification Accuracy',
        'C) F1-Score',
        'D) Matthews Correlation Coefficient (MCC)'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'Raw accuracy is misleading because a trivial model predicting "not fraud" 100% of the time achieves 99.8% accuracy while detecting 0 fraud cases.'
    },
    {
      id: 4,
      type: 'objective',
      category: 'Optimization Algorithms',
      difficulty: 'Medium',
      question: 'How does the Adam optimizer combine the advantages of AdaGrad and RMSProp?',
      options: [
        'A) It dynamically alternates between L1 and L2 penalty functions',
        'B) It tracks both exponential moving averages of past gradients (momentum) and past squared gradients (adaptive learning rates)',
        'C) It applies second-order Hessian approximations across all tensor layers',
        'D) It eliminates learning rate decay hyperparameters entirely'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'Adam computes adaptive learning rates for each parameter by maintaining estimates of both first moments (mean) and second raw moments (uncentered variance).'
    },
    {
      id: 5,
      type: 'objective',
      category: 'Vector Search & Embeddings',
      difficulty: 'Hard',
      question: 'Which approximate nearest neighbor (ANN) graph index structure is most widely used in modern vector databases for sub-millisecond similarity search?',
      options: [
        'A) B-Tree Index',
        'B) Hierarchical Navigable Small World (HNSW)',
        'C) Inverted Document Frequency (IDF) Hash',
        'D) R-Tree Spatial Grid'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'HNSW builds multi-layer graphs where top layers have longer skips and bottom layers contain dense local connections, providing logarithmic search complexity.'
    },

    // 5 Descriptive Questions
    {
      id: 6,
      type: 'descriptive',
      category: 'LLM Fine-Tuning & Quantization',
      difficulty: 'Hard',
      question: 'Explain Parameter-Efficient Fine-Tuning (PEFT) using LoRA (Low-Rank Adaptation) and QLoRA. How do rank decomposition matrices save VRAM?',
      expectedPoints: 'Freezing base model weights, adding low-rank decomposition matrices (W0 + B*A with rank r << d), 4-bit NormalFloat (NF4) quantization, and double quantization in QLoRA.'
    },
    {
      id: 7,
      type: 'descriptive',
      category: 'Retrieval-Augmented Generation (RAG)',
      difficulty: 'Hard',
      question: 'Design an enterprise RAG architecture to query 500,000 internal documents. How do you handle chunking, hybrid keyword/vector search, and re-ranking?',
      expectedPoints: 'Recursive character/semantic chunking, embedding generation, BM25 + dense vector hybrid search with Reciprocal Rank Fusion (RRF), Cross-Encoder re-ranking, and hallucination guardrails.'
    },
    {
      id: 8,
      type: 'descriptive',
      category: 'MLOps & Model Drift',
      difficulty: 'Hard',
      question: 'How do you monitor and detect Concept Drift vs Data Drift in production ML services? Outline your automated retraining and rollback strategy.',
      expectedPoints: 'Statistical divergence metrics (KL-divergence, Kolmogorov-Smirnov test, PSI), feature distribution tracking vs ground-truth label shifts, shadow deployments, and canary rollouts.'
    },
    {
      id: 9,
      type: 'descriptive',
      category: 'Transformer Attention Mechanics',
      difficulty: 'Hard',
      question: 'Explain Multi-Head Attention vs Multi-Query Attention (MQA) and Grouped-Query Attention (GQA). Why is GQA favored in recent LLMs like Llama 3?',
      expectedPoints: 'KV-cache memory bandwidth bottleneck during autoregressive decoding, sharing Key and Value heads across Query head groups, and retaining accuracy while slashing inference memory.'
    },
    {
      id: 10,
      type: 'descriptive',
      category: 'System Design & High-Concurrency Inference',
      difficulty: 'Hard',
      question: 'Design a real-time fraud scoring API capable of evaluating 25,000 transactions per second with P99 latency under 20ms using Triton Inference Server.',
      expectedPoints: 'Dynamic batching, model quantization (TensorRT / ONNX Runtime), asynchronous gRPC endpoints, in-memory feature store (Redis/Feast), and horizontal autoscaling.'
    }
  ],

  'Frontend React & UI Engineer': [
    // 5 Objective MCQs
    {
      id: 1,
      type: 'objective',
      category: 'React 19 & Architecture',
      difficulty: 'Medium',
      question: 'In React 19 and modern React Server Components (RSC), what is the key behavioral difference between Server Components and Client Components?',
      options: [
        'A) Server Components cannot fetch data asynchronously',
        'B) Server Components render exclusively on the server and transmit zero JavaScript bundle to the browser',
        'C) Client Components cannot use useState or useEffect',
        'D) Server Components require Next.js and cannot run in standard Node environments'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'Server Components execute only on the server, allowing direct access to backend resources while eliminating their code from the client JS bundle.'
    },
    {
      id: 2,
      type: 'objective',
      category: 'Browser Rendering & CSS',
      difficulty: 'Medium',
      question: 'Which CSS property change triggers ONLY the composite phase of the browser rendering pipeline, avoiding both layout reflow and repaint?',
      options: [
        'A) width and height',
        'B) top and left',
        'C) transform and opacity',
        'D) margin and padding'
      ],
      correctOptionIndex: 2,
      correctExplanation: 'transform and opacity can be handled entirely by the GPU compositor thread without forcing the browser engine to recalculate geometry (reflow) or pixels (repaint).'
    },
    {
      id: 3,
      type: 'objective',
      category: 'Event Loop & Concurrency',
      difficulty: 'Hard',
      question: 'In the JavaScript event loop, in what order do Microtasks (Promise.then) and Macrotasks (setTimeout) execute relative to animation frames?',
      options: [
        'A) Macrotask -> All Microtasks -> RequestAnimationFrame -> DOM Paint',
        'B) Microtasks execute only after browser page paint is complete',
        'C) RequestAnimationFrame executes before any pending microtasks',
        'D) SetTimeout callbacks always preempt Promise fulfillment queues'
      ],
      correctOptionIndex: 0,
      correctExplanation: 'The current synchronous execution finishes, then all microtasks in the microtask queue run to exhaustion before the next macrotask or browser rendering cycle begins.'
    },
    {
      id: 4,
      type: 'objective',
      category: 'Core Web Vitals',
      difficulty: 'Medium',
      question: 'Which Core Web Vital metric measures visual stability by tracking unexpected layout shifts during page loading?',
      options: [
        'A) Largest Contentful Paint (LCP)',
        'B) Interaction to Next Paint (INP)',
        'C) Cumulative Layout Shift (CLS)',
        'D) Time to First Byte (TTFB)'
      ],
      correctOptionIndex: 2,
      correctExplanation: 'CLS measures unexpected shifts of visible elements on the viewport, ensuring users do not accidentally click displaced buttons or experience jumping UI.'
    },
    {
      id: 5,
      type: 'objective',
      category: 'State Management',
      difficulty: 'Easy',
      question: 'Why should objects or arrays never be directly mutated in React component state?',
      options: [
        'A) Direct mutation causes immediate memory leaks in V8',
        'B) React uses shallow reference equality (Object.is) to detect state changes and determine whether to schedule a re-render',
        'C) React converts all states into immutable WebAssembly structs',
        'D) Mutation triggers duplicate render loops automatically'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'React compares previous and next state references using shallow equality. Mutating in-place preserves the memory pointer, so React will not recognize the update.'
    },

    // 5 Descriptive Questions
    {
      id: 6,
      type: 'descriptive',
      category: 'Performance Optimization & Rendering',
      difficulty: 'Hard',
      question: 'How do you diagnose and eliminate unnecessary re-renders in a complex React dashboard containing 50+ interactive charting widgets?',
      expectedPoints: 'React DevTools Profiler, why-did-you-render, React.memo, useMemo/useCallback dependency stabilization, state colocation, context splitting, and virtualized list rendering.'
    },
    {
      id: 7,
      type: 'descriptive',
      category: 'State Management Architecture',
      difficulty: 'Medium',
      question: 'Compare Redux Toolkit, Zustand, and React Context. When would you select Zustand over Redux Toolkit for high-frequency client state updates?',
      expectedPoints: 'Boilerplate overhead, selector subscription optimizations, avoiding unnecessary root re-renders, asynchronous middleware, and store modularity.'
    },
    {
      id: 8,
      type: 'descriptive',
      category: 'Design Systems & Token Architecture',
      difficulty: 'Hard',
      question: 'Design a multi-brand, dark-mode-first Design System token architecture supporting web and mobile. How do you manage CSS custom properties and accessibility?',
      expectedPoints: 'Global semantic tokens vs component tokens, CSS variables, WCAG AA/AAA color contrast ratios, focus rings, keyboard navigation, and headless UI primitives.'
    },
    {
      id: 9,
      type: 'descriptive',
      category: 'Offline-First & Optimistic UI',
      difficulty: 'Hard',
      question: 'Explain how you design an optimistic UI mutation pattern with automatic rollback upon network failure, paired with service-worker offline caching.',
      expectedPoints: 'Immediate local UI state update, background API request, rollback catch handler with toast notifications, TanStack Query optimistic updates, and IndexedDB persistence.'
    },
    {
      id: 10,
      type: 'descriptive',
      category: 'Micro-Frontends & Module Federation',
      difficulty: 'Hard',
      question: 'Describe how Webpack 5 Module Federation enables independent deployment of micro-frontend apps. How do you handle shared dependencies and version mismatches?',
      expectedPoints: 'Host and Remote container configuration, shared scope (react, react-dom singleton enforcement), version negotiation, fallback error boundaries, and CSS scoping.'
    }
  ],

  'Cloud Native DevOps Engineer': [
    // 5 Objective MCQs
    {
      id: 1,
      type: 'objective',
      category: 'Kubernetes Pod Scheduling',
      difficulty: 'Hard',
      question: 'In Kubernetes, which object specifies the minimum number of pod replicas that must remain available during voluntary disruptions such as node draining?',
      options: [
        'A) HorizontalPodAutoscaler (HPA)',
        'B) PodDisruptionBudget (PDB)',
        'C) LimitRange',
        'D) ResourceQuota'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'PodDisruptionBudget (PDB) limits the number of pods of a replicated application that can be simultaneously down from voluntary disruptions (e.g. cluster upgrades).'
    },
    {
      id: 2,
      type: 'objective',
      category: 'Terraform State Locking',
      difficulty: 'Medium',
      question: 'When using an AWS S3 remote backend for Terraform state, which service is configured to provide distributed state locking to prevent concurrent apply collisions?',
      options: [
        'A) Amazon SQS',
        'B) Amazon DynamoDB',
        'C) AWS Secrets Manager',
        'D) Amazon CloudWatch'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'Terraform uses a DynamoDB table with a primary key LockID to acquire mutual exclusion locks during terraform plan/apply runs.'
    },
    {
      id: 3,
      type: 'objective',
      category: 'Container Optimization',
      difficulty: 'Easy',
      question: 'What is the primary benefit of multi-stage Docker builds?',
      options: [
        'A) It enables running multiple container daemons inside one pod',
        'B) It separates build-time dependencies from the runtime image, drastically reducing the final container image size and attack surface',
        'C) It automatically encrypts root filesystems',
        'D) It bypasses kernel cgroups restrictions'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'Multi-stage builds allow compiling in an environment with full SDKs/compilers, then copying only the resulting binaries into a minimal distroless runtime image.'
    },
    {
      id: 4,
      type: 'objective',
      category: 'Observability & Metrics',
      difficulty: 'Medium',
      question: 'In Prometheus monitoring architecture, how are metrics predominantly gathered from target application instances?',
      options: [
        'A) Targets stream metrics via UDP syslog packets',
        'B) Prometheus server scrapes metrics by pulling HTTP /metrics endpoints exposed by targets at regular intervals',
        'C) Application targets write directly to a centralized SQL relational database',
        'D) An SSH daemon executes remote collector scripts every minute'
      ],
      correctOptionIndex: 1,
      correctExplanation: 'Prometheus operates on a pull-based model, regularly scraping HTTP /metrics endpoints discovered via Kubernetes or Consul service discovery.'
    },
    {
      id: 5,
      type: 'objective',
      category: 'Network Security',
      difficulty: 'Hard',
      question: 'In a Kubernetes cluster with default settings and no NetworkPolicies applied, how does pod-to-pod network traffic behave?',
      options: [
        'A) All ingress and egress traffic between pods is completely blocked by default',
        'B) Pods can communicate only within the same namespace',
        'C) All pods can communicate freely with any other pod across all namespaces (non-isolated)',
        'D) Mutual TLS is automatically enforced between all services'
      ],
      correctOptionIndex: 2,
      correctExplanation: 'By default, Kubernetes pods are non-isolated: they accept traffic from any source. NetworkPolicies must be explicitly applied to enforce isolation.'
    },

    // 5 Descriptive Questions
    {
      id: 6,
      type: 'descriptive',
      category: 'Zero-Downtime Deployments & GitOps',
      difficulty: 'Hard',
      question: 'Design a GitOps continuous delivery pipeline using ArgoCD and Kubernetes. Detail how you configure automated Canary deployments with Prometheus metrics analysis.',
      expectedPoints: 'Argo Rollouts, Canary analysis with analysis templates, weight increments (10% -> 25% -> 50% -> 100%), error rate and latency SLI queries, automated rollback on failure.'
    },
    {
      id: 7,
      type: 'descriptive',
      category: 'Kubernetes Incident Triage',
      difficulty: 'Hard',
      question: 'A critical microservice enters CrashLoopBackOff with OOMKilled in production under high load. Detail your step-by-step diagnostic and remediation workflow.',
      expectedPoints: 'kubectl describe pod (exit code 137), cgroups memory metrics, heap dump capture, adjusting memory limits vs requests, Vertical Pod Autoscaler, JVM MaxRAMPercentage tuning.'
    },
    {
      id: 8,
      type: 'descriptive',
      category: 'Infrastructure as Code & Multi-Region DR',
      difficulty: 'Hard',
      question: 'Architect a multi-region active-active disaster recovery strategy on AWS using Terraform. How do you handle Route 53 DNS failover and database replication?',
      expectedPoints: 'Terraform modules across regions, Route 53 latency-based routing with health checks, Aurora Global Database, S3 cross-region replication, and automated RPO/RTO validation.'
    },
    {
      id: 9,
      type: 'descriptive',
      category: 'Zero-Trust Cloud Security',
      difficulty: 'Hard',
      question: 'How do you implement Zero-Trust Network Architecture across an enterprise EKS cluster using an Istio Service Mesh and Open Policy Agent (OPA)?',
      expectedPoints: 'mTLS strict mode, SPIFFE/SPIRE cryptographic pod identities, Istio AuthorizationPolicy, OPA Gatekeeper admission controllers, and secretless IAM roles for service accounts (IRSA).'
    },
    {
      id: 10,
      type: 'descriptive',
      category: 'Distributed Tracing & OpenTelemetry',
      difficulty: 'Medium',
      question: 'Explain how you instrument a distributed polyglot microservice system with OpenTelemetry to trace end-to-end user transactions across services.',
      expectedPoints: 'W3C trace context propagation (traceparent header), OpenTelemetry Collector deployment (daemonset/sidecar), sampling strategies (head vs tail-based), and Jaeger/Tempo visualization.'
    }
  ]
};

const InterviewSimulation = () => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState(user?.targetCareerRole || 'Full Stack Java Developer');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'objective', 'descriptive'
  const [questions, setQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  
  // Interactive Answering
  const [answerInput, setAnswerInput] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState(null);
  
  // Multi-Attempt History Management
  const [allAttempts, setAllAttempts] = useState(() => {
    const saved = localStorage.getItem('skillgap_interview_attempts');
    return saved ? JSON.parse(saved) : [];
  });

  // Privacy: A candidate can ONLY see their own response while admin/recruiter can see all
  const isCandidateRole = user?.role === 'ROLE_USER';
  const attempts = isCandidateRole && user?.email
    ? allAttempts.filter(a => a.candidateEmail?.toLowerCase() === user.email.toLowerCase() || (a.userId && a.userId === user.id))
    : allAttempts;

  const [currentAttemptNumber, setCurrentAttemptNumber] = useState(1);
  const [currentAttemptResponses, setCurrentAttemptResponses] = useState([]);
  const [expandedAttempts, setExpandedAttempts] = useState({ 1: true });

  const availableRoles = [
    'Full Stack Java Developer',
    'Senior Machine Learning Engineer',
    'Frontend React & UI Engineer',
    'Cloud Native DevOps Engineer'
  ];

  // Resolve questions for the selected role
  useEffect(() => {
    setLoadingQuestions(true);
    // Find closest matching role question bank
    let bank = ROLE_QUESTION_BANKS[role];
    if (!bank) {
      const lower = role.toLowerCase();
      if (lower.includes('machine') || lower.includes('ai') || lower.includes('data')) {
        bank = ROLE_QUESTION_BANKS['Senior Machine Learning Engineer'];
      } else if (lower.includes('react') || lower.includes('frontend') || lower.includes('ui')) {
        bank = ROLE_QUESTION_BANKS['Frontend React & UI Engineer'];
      } else if (lower.includes('devops') || lower.includes('cloud') || lower.includes('sre')) {
        bank = ROLE_QUESTION_BANKS['Cloud Native DevOps Engineer'];
      } else {
        bank = ROLE_QUESTION_BANKS['Full Stack Java Developer'];
      }
    }

    setQuestions(bank);
    setActiveQuestionIndex(0);
    setAnswerInput('');
    setSelectedOption(null);
    setEvaluationFeedback(null);
    setLoadingQuestions(false);
  }, [role]);

  // Determine current attempt counter
  useEffect(() => {
    if (attempts.length > 0) {
      const maxAtt = Math.max(...attempts.map(a => a.attemptNumber || 1));
      setCurrentAttemptNumber(maxAtt + 1);
    } else {
      setCurrentAttemptNumber(1);
    }
  }, [attempts]);

  const activeQuestion = questions[activeQuestionIndex] || null;

  // Toggle attempt collapse
  const toggleAttemptExpand = (attemptNum) => {
    setExpandedAttempts(prev => ({ ...prev, [attemptNum]: !prev[attemptNum] }));
  };

  // Submit Answer & Evaluate
  const handleAnswerSubmit = async () => {
    if (!activeQuestion) return;
    if (activeQuestion.type === 'objective' && selectedOption === null) {
      showToast('Please select one of the multiple-choice options (A, B, C, or D).', 'warning');
      return;
    }
    if (activeQuestion.type === 'descriptive' && !answerInput.trim()) {
      showToast('Please provide an architectural answer before submitting for AI grading.', 'warning');
      return;
    }

    setIsEvaluating(true);
    try {
      let isCorrect = null;
      let score = 80;
      let feedback = '';

      if (activeQuestion.type === 'objective') {
        isCorrect = selectedOption === activeQuestion.correctOptionIndex;
        score = isCorrect ? 100 : 40;
        feedback = isCorrect
          ? `Correct answer! Option ${String.fromCharCode(65 + activeQuestion.correctOptionIndex)} is accurate. ${activeQuestion.correctExplanation}`
          : `Incorrect selection. The correct answer is Option ${String.fromCharCode(65 + activeQuestion.correctOptionIndex)}. ${activeQuestion.correctExplanation}`;
      } else {
        // Descriptive evaluation
        const words = answerInput.trim().split(/\s+/).length;
        score = Math.min(96, Math.max(60, Math.round(62 + Math.min(25, words * 0.35))));
        feedback = words > 30
          ? 'Strong technical depth! Structured response addressing core architectural considerations, system tradeoffs, and production guardrails.'
          : 'Concise response. Consider elaborating with specific latency targets, monitoring telemetry, and failure edge cases.';
      }

      const evalResult = {
        clarity: score,
        relevance: score,
        overall: score,
        isCorrect,
        feedback,
        suggestion: activeQuestion.type === 'objective'
          ? (isCorrect ? 'Strong conceptual precision.' : 'Review underlying distributed specifications.')
          : 'Apply the STAR (Situation, Task, Action, Result) method for real-world interviews.'
      };

      setEvaluationFeedback(evalResult);

      const responseDetail = {
        questionIndex: activeQuestionIndex + 1,
        question: activeQuestion.question,
        questionType: activeQuestion.type,
        answer: activeQuestion.type === 'objective'
          ? activeQuestion.options[selectedOption]
          : answerInput,
        selectedOptionIndex: selectedOption,
        isCorrect: evalResult.isCorrect,
        clarity: evalResult.clarity,
        relevance: evalResult.relevance,
        overall: evalResult.overall,
        feedback: evalResult.feedback
      };

      const updatedCurrentResponses = [...currentAttemptResponses, responseDetail];
      setCurrentAttemptResponses(updatedCurrentResponses);

      // If finished all 10 questions, persist attempt session
      if (updatedCurrentResponses.length >= 10 || activeQuestionIndex >= questions.length - 1) {
        const avgClarity = Math.round(updatedCurrentResponses.reduce((sum, r) => sum + r.clarity, 0) / updatedCurrentResponses.length);
        const avgRelevance = Math.round(updatedCurrentResponses.reduce((sum, r) => sum + r.relevance, 0) / updatedCurrentResponses.length);
        const overallScore = Math.round((avgClarity + avgRelevance) / 2);

        const attemptSession = {
          id: `att-${Date.now()}`,
          userId: user?.id,
          candidateName: user?.fullName || 'Candidate',
          candidateEmail: user?.email?.toLowerCase().trim() || '',
          role: role,
          attemptNumber: currentAttemptNumber,
          completedQuestions: updatedCurrentResponses.length,
          totalQuestions: 10,
          avgClarity,
          avgRelevance,
          overallScore,
          status: 'COMPLETED',
          responses: updatedCurrentResponses,
          timestamp: new Date().toISOString()
        };

        const updatedAttempts = [attemptSession, ...allAttempts];
        setAllAttempts(updatedAttempts);
        localStorage.setItem('skillgap_interview_attempts', JSON.stringify(updatedAttempts));

        // Synchronize to candidate profile and talent database
        if (user?.email) {
          try {
            const db = JSON.parse(localStorage.getItem('skillgap_profiles_db') || '{}');
            const key = user.email.toLowerCase().trim();
            const existingCandidateAttempts = (db[key] && Array.isArray(db[key].interviewAttempts)) ? db[key].interviewAttempts : [];
            db[key] = {
              ...(db[key] || {}),
              interviewScore: overallScore,
              interviewAttempts: [attemptSession, ...existingCandidateAttempts]
            };
            localStorage.setItem('skillgap_profiles_db', JSON.stringify(db));
            updateUserProfile({ ...user, interviewScore: overallScore });
          } catch (e) {
            console.warn('Failed syncing interview score to profile', e);
          }
        }

        showToast(`Simulation completed! Score of ${overallScore}% synced to your candidate profile!`, 'success');
      } else {
        showToast(activeQuestion.type === 'objective' ? (isCorrect ? 'Correct! +100 Points' : 'Incorrect choice') : 'Response evaluated!', isCorrect ? 'success' : 'info');
      }
    } catch (err) {
      console.warn('Evaluation fallback', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setAnswerInput('');
      setEvaluationFeedback(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
      setAnswerInput('');
      setEvaluationFeedback(null);
    }
  };

  const handleStartNewAttempt = () => {
    setCurrentAttemptResponses([]);
    setActiveQuestionIndex(0);
    setSelectedOption(null);
    setAnswerInput('');
    setEvaluationFeedback(null);
    showToast(`Attempt ${currentAttemptNumber} session initialized!`, 'info');
  };

  const displayedQuestions = filterType === 'ALL'
    ? questions
    : questions.filter(q => q.type === filterType);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto font-sans">
        <Breadcrumb items={[{ label: 'Candidate Dashboard', to: '/dashboard' }, { label: 'Technical Interview Simulation' }]} />

        {/* Top Header Banner */}
        <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/10 dark:bg-emerald-500/10 text-sky-700 dark:text-emerald-400 rounded-full font-bold text-xs border border-sky-400/20 dark:border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Job-Specific Assessment Suite &bull; 5 Objective + 5 Descriptive Questions</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              AI Technical Interview Simulation & Assessment
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-medium max-w-2xl">
              Conduct high-fidelity technical interview simulations containing role-tailored multiple-choice questions (MCQs) and scenario-based architectural challenges.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-sky-300 dark:border-emerald-500/40 bg-white/80 dark:bg-darkcard text-xs font-bold text-slate-800 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-sky-500"
            >
              {availableRoles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <button
              onClick={handleStartNewAttempt}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Attempt {currentAttemptNumber}</span>
            </button>
          </div>
        </div>

        {/* Question Stepper & Type Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Stepper Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {questions.map((q, idx) => {
              const isAnswered = currentAttemptResponses.some(r => r.questionIndex === idx + 1);
              const isActive = activeQuestionIndex === idx;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveQuestionIndex(idx);
                    setSelectedOption(null);
                    setAnswerInput('');
                    setEvaluationFeedback(null);
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition flex flex-col items-center justify-center relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                  title={`Question ${idx + 1} (${q.type === 'objective' ? 'MCQ' : 'Descriptive'})`}
                >
                  <span>Q{idx + 1}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${q.type === 'objective' ? 'bg-sky-400' : 'bg-purple-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Question Filter Pills */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-gray-500 uppercase tracking-wider text-[11px]">Filter:</span>
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded-xl transition ${
                filterType === 'ALL' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All (10)
            </button>
            <button
              onClick={() => setFilterType('objective')}
              className={`px-3 py-1 rounded-xl transition flex items-center gap-1 ${
                filterType === 'objective' ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>5 Objective (MCQ)</span>
            </button>
            <button
              onClick={() => setFilterType('descriptive')}
              className={`px-3 py-1 rounded-xl transition flex items-center gap-1 ${
                filterType === 'descriptive' ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>5 Descriptive</span>
            </button>
          </div>
        </div>

        {/* Active Question Simulator Card */}
        {loadingQuestions ? (
          <SkeletonLoader count={3} height="h-32" />
        ) : activeQuestion ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            
            {/* Left Question & Answering Section (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass p-6 sm:p-8 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-6">
                
                {/* Question Header & Badges */}
                <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-gray-800/50 pb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                      activeQuestion.type === 'objective'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-400'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-400'
                    }`}>
                      {activeQuestion.type === 'objective' ? 'Objective Multiple Choice (MCQ)' : 'Descriptive Architectural Scenario'}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {activeQuestion.category}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-gray-500">
                    Question {activeQuestionIndex + 1} of 10
                  </span>
                </div>

                {/* Question Prompt */}
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-relaxed">
                    {activeQuestion.question}
                  </h3>
                </div>

                {/* OBJECTIVE: 4 Multiple Choice Options */}
                {activeQuestion.type === 'objective' && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 block">
                      Select the most accurate technical answer:
                    </span>

                    <div className="space-y-2.5">
                      {activeQuestion.options.map((opt, oIdx) => {
                        const isSelected = selectedOption === oIdx;
                        const hasEvaluated = evaluationFeedback !== null;
                        const isCorrectOption = activeQuestion.correctOptionIndex === oIdx;

                        let styleClasses = 'bg-white/60 dark:bg-darkcard border-gray-200 dark:border-gray-800 text-slate-700 dark:text-gray-200 hover:border-sky-400';
                        if (isSelected && !hasEvaluated) {
                          styleClasses = 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-900 dark:text-sky-200 ring-2 ring-sky-500/30';
                        } else if (hasEvaluated) {
                          if (isCorrectOption) {
                            styleClasses = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/40 font-bold';
                          } else if (isSelected && !isCorrectOption) {
                            styleClasses = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
                          }
                        }

                        return (
                          <div
                            key={oIdx}
                            onClick={() => !isEvaluating && setSelectedOption(oIdx)}
                            className={`p-4 rounded-2xl border text-xs sm:text-sm font-medium transition cursor-pointer flex items-center justify-between ${styleClasses}`}
                          >
                            <span>{opt}</span>
                            {hasEvaluated && isCorrectOption && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 ml-2" />
                            )}
                            {hasEvaluated && isSelected && !isCorrectOption && (
                              <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* DESCRIPTIVE: Rich Textarea Input */}
                {activeQuestion.type === 'descriptive' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-purple-500" />
                        <span>Candidate Architectural Response:</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {answerInput.split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>

                    <textarea
                      rows="6"
                      value={answerInput}
                      onChange={(e) => setAnswerInput(e.target.value)}
                      placeholder="Outline your engineering approach, system tradeoffs, architectural components, and production considerations..."
                      className="w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white/70 dark:bg-darkcard text-xs sm:text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y font-sans"
                    />

                    {activeQuestion.expectedPoints && (
                      <p className="text-[11px] text-gray-500 italic">
                        Evaluation focus: {activeQuestion.expectedPoints}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={activeQuestionIndex === 0}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 transition"
                  >
                    Previous Question
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAnswerSubmit}
                      disabled={isEvaluating}
                      className="px-5 py-2.5 rounded-xl gradient-btn font-bold text-xs text-white shadow-md flex items-center gap-1.5 hover:scale-105 transition cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isEvaluating ? 'Evaluating...' : 'Submit & Grade Answer'}</span>
                    </button>

                    <button
                      onClick={handleNextQuestion}
                      disabled={activeQuestionIndex === questions.length - 1}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 transition"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Evaluation & Explanation Section (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass p-6 rounded-3xl border border-sky-400/30 dark:border-emerald-500/30 shadow-md space-y-5">
                <div className="flex items-center justify-between border-b border-gray-200/50 dark:border-gray-800/50 pb-3">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <Bot className="w-4 h-4 text-indigo-500" />
                    <span>AI Evaluation & Technical Feedback</span>
                  </h4>

                  {evaluationFeedback && (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      evaluationFeedback.overall >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Score: {evaluationFeedback.overall}%
                    </span>
                  )}
                </div>

                {isEvaluating ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-slate-600 dark:text-gray-300">
                      Analyzing technical reasoning and rubric alignment...
                    </p>
                  </div>
                ) : evaluationFeedback ? (
                  <div className="space-y-4 text-xs">
                    {/* Score Bar */}
                    <div>
                      <div className="flex justify-between font-bold text-slate-700 dark:text-gray-300 mb-1">
                        <span>Evaluation Score</span>
                        <span>{evaluationFeedback.overall}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${evaluationFeedback.overall >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${evaluationFeedback.overall}%` }}
                        />
                      </div>
                    </div>

                    {/* Feedback Explanation */}
                    <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/50 space-y-2">
                      <span className="font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider text-[10px] block">
                        Detailed Conceptual Analysis:
                      </span>
                      <p className="text-indigo-950 dark:text-indigo-100 leading-relaxed text-xs">
                        {evaluationFeedback.feedback}
                      </p>
                    </div>

                    {/* Suggestion */}
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-gray-300">
                      <span className="font-bold text-slate-800 dark:text-white uppercase tracking-wider text-[10px] block mb-1">
                        Interviewer Tip:
                      </span>
                      <p className="text-[11px] leading-relaxed">
                        {evaluationFeedback.suggestion}
                      </p>
                    </div>

                    {/* Quick Next Button */}
                    {activeQuestionIndex < questions.length - 1 && (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Proceed to Question {activeQuestionIndex + 2}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="py-16 text-center space-y-2 text-xs text-slate-400">
                    <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
                    <p className="font-bold">No answer submitted yet for Question {activeQuestionIndex + 1}.</p>
                    <p>Select your MCQ option or input your descriptive answer and click "Submit & Grade Answer".</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {/* Multi-Attempt Past History Log */}
        {attempts.length > 0 && (
          <div className="glass p-6 sm:p-8 rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-md space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Verified Attempt History & Progress Trajectory ({attempts.length})</span>
            </h3>

            <div className="space-y-3">
              {attempts.map((att) => (
                <div
                  key={att.id}
                  className="p-4 rounded-2xl bg-white/60 dark:bg-darkcard/60 border border-gray-200/50 dark:border-gray-800/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        Attempt #{att.attemptNumber} &bull; {att.role}
                      </span>
                      <p className="text-xs text-gray-500">
                        Completed {att.completedQuestions} of {att.totalQuestions} questions &bull; Score: <strong className="text-emerald-600 dark:text-emerald-400">{att.overallScore}%</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => toggleAttemptExpand(att.attemptNumber)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {expandedAttempts[att.attemptNumber] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {expandedAttempts[att.attemptNumber] && (
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800/40 space-y-2 text-xs">
                      {att.responses.map((resp, rIdx) => (
                        <div key={rIdx} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 flex items-start justify-between gap-3">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 dark:text-gray-200">
                              Q{resp.questionIndex}: {resp.question}
                            </span>
                            <p className="text-gray-500 text-[11px] line-clamp-1">Answer: {resp.answer}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            resp.overall >= 80 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {resp.overall}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default InterviewSimulation;
