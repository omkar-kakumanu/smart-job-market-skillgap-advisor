package com.skillgap.advisor.service;

import com.skillgap.advisor.dto.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class InterviewService {

    private final Map<Long, List<InterviewAttemptDto>> userAttempts = new ConcurrentHashMap<>();

    public List<InterviewQuestionDto> getQuestionsForRole(String role, String category) {
        String normalizedRole = (role != null ? role.toLowerCase() : "java");
        List<InterviewQuestionDto> questions = new ArrayList<>();

        if (normalizedRole.contains("machine learning") || normalizedRole.contains("ai") || normalizedRole.contains("data science")) {
            questions = getMlQuestions();
        } else if (normalizedRole.contains("frontend") || normalizedRole.contains("react") || normalizedRole.contains("ui")) {
            questions = getFrontendQuestions();
        } else if (normalizedRole.contains("devops") || normalizedRole.contains("cloud") || normalizedRole.contains("kubernetes")) {
            questions = getDevOpsQuestions();
        } else {
            questions = getJavaBackendQuestions();
        }

        if ("TECHNICAL".equalsIgnoreCase(category)) {
            return questions.stream()
                    .filter(q -> !"Behavioral & Culture".equalsIgnoreCase(q.getCategory()))
                    .toList();
        } else if ("BEHAVIORAL".equalsIgnoreCase(category)) {
            return questions.stream()
                    .filter(q -> "Behavioral & Culture".equalsIgnoreCase(q.getCategory()) || "System Leadership".equalsIgnoreCase(q.getCategory()))
                    .toList();
        }
        return questions;
    }

    public InterviewEvaluationResponse evaluateResponse(InterviewEvaluationRequest request) {
        if ("objective".equalsIgnoreCase(request.getQuestionType())) {
            boolean isCorrect = request.getSelectedOptionIndex() != null && 
                               request.getCorrectOptionIndex() != null && 
                               request.getSelectedOptionIndex().equals(request.getCorrectOptionIndex());

            int score = isCorrect ? 100 : 45;
            String feedback = isCorrect 
                ? "Excellent! Correct answer selected. " + (request.getCorrectExplanation() != null ? request.getCorrectExplanation() : "")
                : "Incorrect selection. " + (request.getCorrectExplanation() != null ? request.getCorrectExplanation() : "Review the underlying concepts.");

            return InterviewEvaluationResponse.builder()
                    .clarity(score)
                    .relevance(score)
                    .overall(score)
                    .isCorrect(isCorrect)
                    .feedback(feedback)
                    .suggestion(isCorrect ? "Strong conceptual command demonstrated." : "Review standard system architecture specifications.")
                    .build();
        }

        // Descriptive Evaluation
        String text = request.getCandidateAnswer() != null ? request.getCandidateAnswer().trim() : "";
        int wordCount = text.isEmpty() ? 0 : text.split("\\s+").length;

        int clarity = Math.min(96, Math.max(55, 60 + (int)(wordCount * 0.4)));
        int relevance = Math.min(95, Math.max(50, 65 + (int)(wordCount * 0.35)));
        int overall = (clarity + relevance) / 2;

        String feedback = wordCount > 25
                ? "Structured response covering key engineering tradeoffs and clear architectural reasoning."
                : "Succinct answer. Consider expanding with concrete production metrics, latency targets, and edge cases.";

        return InterviewEvaluationResponse.builder()
                .clarity(clarity)
                .relevance(relevance)
                .overall(overall)
                .isCorrect(null)
                .feedback(feedback)
                .suggestion("Practice framing answers with the STAR method (Situation, Task, Action, Result).")
                .build();
    }

    public InterviewAttemptDto saveAttempt(Long userId, String candidateName, InterviewAttemptDto attempt) {
        if (attempt.getId() == null || attempt.getId().trim().isEmpty()) {
            attempt.setId("att-" + System.currentTimeMillis());
        }
        attempt.setUserId(userId);
        attempt.setCandidateName(candidateName);
        attempt.setTimestamp(LocalDateTime.now());

        userAttempts.computeIfAbsent(userId, k -> new ArrayList<>()).add(attempt);
        return attempt;
    }

    public List<InterviewAttemptDto> getUserAttempts(Long userId) {
        return userAttempts.getOrDefault(userId, Collections.emptyList());
    }

    private List<InterviewQuestionDto> getJavaBackendQuestions() {
        return List.of(
            // 5 Descriptive
            InterviewQuestionDto.builder().id(1L).type("descriptive").category("Core Java & Concurrency").difficulty("Medium")
                .question("Explain how Java 21 Virtual Threads differ from traditional platform threads, and describe how they impact high-throughput web server performance.")
                .tags("Core Java • Project Loom").build(),
            InterviewQuestionDto.builder().id(2L).type("descriptive").category("Spring Framework Architecture").difficulty("Hard")
                .question("Describe the lifecycle of a Spring Bean and how Spring Security filters intercept requests before reaching controller handlers.")
                .tags("Spring Boot • Spring Security").build(),
            InterviewQuestionDto.builder().id(3L).type("descriptive").category("Database & JPA Optimization").difficulty("Hard")
                .question("How do you detect and resolve the Hibernate N+1 query problem in Spring Data JPA? Compare JOIN FETCH vs EntityGraph approaches.")
                .tags("Hibernate • SQL Performance").build(),
            InterviewQuestionDto.builder().id(4L).type("descriptive").category("Distributed Systems & Caching").difficulty("Hard")
                .question("How do you design a distributed caching layer using Redis alongside MySQL to avoid cache stampede and ensure eventual consistency?")
                .tags("Distributed Systems • Redis").build(),
            InterviewQuestionDto.builder().id(5L).type("descriptive").category("Behavioral & Culture").difficulty("Medium")
                .question("Describe a high-severity production incident you debugged. How did you triage root causes, communicate with stakeholders, and implement guardrails?")
                .tags("Incident Management • Communication").build(),

            // 5 Objective MCQs
            InterviewQuestionDto.builder().id(6L).type("objective").category("JVM Internals").difficulty("Medium")
                .question("In standard JVM Garbage Collection, in which memory region are newly created Java objects initially allocated?")
                .options(List.of("A) Tenured / Old Generation", "B) Eden Space in Young Generation", "C) Metaspace", "D) Code Cache"))
                .correctOptionIndex(1)
                .correctExplanation("New objects are instantiated in Eden space within the Young Generation. Surviving objects get promoted over minor GCs to Tenured generation.")
                .tags("Objective MCQ • Memory Management").build(),
            InterviewQuestionDto.builder().id(7L).type("objective").category("Distributed Systems").difficulty("Hard")
                .question("According to Brewer's CAP Theorem, in the presence of a network partition (P), what trade-off must a distributed database system make?")
                .options(List.of("A) Trade between Consistency and Latency", "B) Choose between Consistency (CP) and Availability (AP)", "C) Deliver all three: C, A, and P simultaneously", "D) Sacrifice Partition Tolerance"))
                .correctOptionIndex(1)
                .correctExplanation("When partitions occur, a distributed system can either reject inconsistent operations (CP) or proceed with potentially stale data (AP).")
                .tags("Objective MCQ • CAP Theorem").build(),
            InterviewQuestionDto.builder().id(8L).type("objective").category("API Design").difficulty("Easy")
                .question("Which HTTP status code is designated by RFC 6585 when a client has exceeded its allowed rate limit quota?")
                .options(List.of("A) 400 Bad Request", "B) 403 Forbidden", "C) 429 Too Many Requests", "D) 503 Service Unavailable"))
                .correctOptionIndex(2)
                .correctExplanation("HTTP 429 Too Many Requests informs the client that rate-limiting thresholds have been exceeded, often paired with a Retry-After header.")
                .tags("Objective MCQ • REST APIs").build(),
            InterviewQuestionDto.builder().id(9L).type("objective").category("Databases").difficulty("Medium")
                .question("Which ANSI SQL transaction isolation level guarantees complete prevention of dirty reads, non-repeatable reads, and phantom reads?")
                .options(List.of("A) Read Committed", "B) Repeatable Read", "C) Serializable", "D) Read Uncommitted"))
                .correctOptionIndex(2)
                .correctExplanation("Serializable is the highest isolation level, executing transactions with serial equivalence to eliminate phantom reads and inconsistencies.")
                .tags("Objective MCQ • ACID Transactions").build(),
            InterviewQuestionDto.builder().id(10L).type("objective").category("Message Brokers").difficulty("Medium")
                .question("In Apache Kafka distributed event streaming, what mechanism guarantees strict message ordering?")
                .options(List.of("A) Global timestamp synchronization across brokers", "B) Publishing messages with the same partition key within a single partition", "C) Consumer group leader reelection", "D) ZooKeeper/KRaft quorum consensus"))
                .correctOptionIndex(1)
                .correctExplanation("Kafka strictly guarantees append-order preservation per partition. Messages sharing the same partition key are guaranteed ordered delivery.")
                .tags("Objective MCQ • Kafka Streaming").build()
        );
    }

    private List<InterviewQuestionDto> getMlQuestions() {
        return List.of(
            InterviewQuestionDto.builder().id(1L).type("descriptive").category("Machine Learning Fundamentals").difficulty("Medium")
                .question("Explain the bias-variance tradeoff and how L1 (Lasso) and L2 (Ridge) regularization help prevent overfitting in deep neural networks.")
                .tags("Machine Learning • Optimization").build(),
            InterviewQuestionDto.builder().id(2L).type("descriptive").category("Deep Learning & LLMs").difficulty("Hard")
                .question("Describe the scaled dot-product self-attention mechanism in Transformer architectures and how multi-head attention captures varied semantic relationships.")
                .tags("Transformers • LLMs • Attention").build(),
            InterviewQuestionDto.builder().id(3L).type("descriptive").category("MLOps & Model Serving").difficulty("Hard")
                .question("How do you design an automated model retraining pipeline with drift detection (KS-test / PSI) and low-latency Triton or TorchServe deployment?")
                .tags("MLOps • Drift Detection • Latency").build(),
            InterviewQuestionDto.builder().id(4L).type("descriptive").category("Data Pipeline Engineering").difficulty("Medium")
                .question("How do you handle severe class imbalance in tabular datasets? Compare synthetic oversampling (SMOTE) with Focal Loss.")
                .tags("Imbalanced Data • Sampling").build(),
            InterviewQuestionDto.builder().id(5L).type("descriptive").category("Behavioral & Culture").difficulty("Medium")
                .question("How do you explain ML model hallucinations or prediction uncertainty to non-technical business stakeholders?")
                .tags("AI Safety • Communication").build(),

            InterviewQuestionDto.builder().id(6L).type("objective").category("Deep Learning").difficulty("Medium")
                .question("Which activation function was specifically designed to mitigate the vanishing gradient problem in deep neural networks?")
                .options(List.of("A) Sigmoid", "B) Tanh", "C) ReLU (Rectified Linear Unit)", "D) Softmax"))
                .correctOptionIndex(2)
                .correctExplanation("ReLU produces a constant gradient of 1 for positive inputs, preventing the exponential vanishing gradient common in Sigmoid and Tanh.")
                .tags("Objective MCQ • Deep Learning").build(),
            InterviewQuestionDto.builder().id(7L).type("objective").category("Model Evaluation").difficulty("Easy")
                .question("When evaluating an imbalanced fraud detection classifier where false negatives are critical, which metric should be prioritized?")
                .options(List.of("A) Accuracy", "B) Precision", "C) Recall / Sensitivity", "D) Specificity"))
                .correctOptionIndex(2)
                .correctExplanation("Recall measures the proportion of actual positive cases detected. High recall minimizes false negatives in fraud and medical diagnosis.")
                .tags("Objective MCQ • Metrics").build(),
            InterviewQuestionDto.builder().id(8L).type("objective").category("Natural Language Processing").difficulty("Medium")
                .question("What is the primary architectural difference between BERT and GPT language models?")
                .options(List.of("A) BERT is autoregressive; GPT is bi-directional", "B) BERT is an encoder-only model; GPT is a decoder-only model", "C) BERT uses convolution; GPT uses self-attention", "D) BERT does not use self-attention"))
                .correctOptionIndex(1)
                .correctExplanation("BERT utilizes the Transformer encoder for bi-directional context, while GPT uses a causal decoder for left-to-right text generation.")
                .tags("Objective MCQ • NLP").build(),
            InterviewQuestionDto.builder().id(9L).type("objective").category("Optimization").difficulty("Medium")
                .question("What hyperparameter in the Adam optimizer balances historical squared gradients (RMSProp component)?")
                .options(List.of("A) Beta-1 (momentum)", "B) Beta-2 (squared gradient decay)", "C) Epsilon (numerical stability)", "D) Learning Rate"))
                .correctOptionIndex(1)
                .correctExplanation("Beta-2 controls the exponential moving average of squared gradients (typically 0.999), maintaining adaptive per-parameter learning rates.")
                .tags("Objective MCQ • Optimization").build(),
            InterviewQuestionDto.builder().id(10L).type("objective").category("Model Ensemble").difficulty("Medium")
                .question("What fundamental training strategy differentiates Random Forests (Bagging) from Gradient Boosted Decision Trees (Boosting)?")
                .options(List.of("A) Bagging trains trees sequentially; Boosting trains trees in parallel", "B) Bagging trains trees in parallel on bootstrap samples; Boosting trains trees sequentially on residual errors", "C) Bagging only works on regression problems", "D) Boosting does not use decision trees"))
                .correctOptionIndex(1)
                .correctExplanation("Random Forest independently averages parallel trees to reduce variance, whereas Boosting iteratively fits new trees to the residual errors.")
                .tags("Objective MCQ • Ensemble").build()
        );
    }

    private List<InterviewQuestionDto> getFrontendQuestions() {
        return List.of(
            InterviewQuestionDto.builder().id(1L).type("descriptive").category("React Core Architecture").difficulty("Medium")
                .question("Explain how the React Reconciliation algorithm and Fiber tree work under the hood during state updates.")
                .tags("React • Fiber • Virtual DOM").build(),
            InterviewQuestionDto.builder().id(2L).type("descriptive").category("Web Performance").difficulty("Hard")
                .question("How do you optimize Core Web Vitals (LCP, INP, CLS) in a modern single-page React application?")
                .tags("Performance • Core Web Vitals").build(),
            InterviewQuestionDto.builder().id(3L).type("descriptive").category("State Management").difficulty("Medium")
                .question("Compare Redux Toolkit, Zustand, and React Context. In what scenarios would you choose lightweight Zustand over Context?")
                .tags("State Management • Zustand").build(),
            InterviewQuestionDto.builder().id(4L).type("descriptive").category("Browser & Networking").difficulty("Medium")
                .question("How do browser service workers, HTTP/2 multiplexing, and prefetching improve offline capabilities and perceived load speed?")
                .tags("Browsers • Service Workers").build(),
            InterviewQuestionDto.builder().id(5L).type("descriptive").category("Behavioral & Culture").difficulty("Medium")
                .question("How do you navigate design critiques and bridge disagreements between UX design specifications and frontend technical feasibility?")
                .tags("Design Collaboration • Communication").build(),

            InterviewQuestionDto.builder().id(6L).type("objective").category("React Hooks").difficulty("Easy")
                .question("In React's useEffect hook, when does the returned cleanup function execute?")
                .options(List.of("A) Only when the component first mounts", "B) Before the component unmounts and before re-running the effect on dependency change", "C) Synchronously before DOM mutation", "D) At a random browser idle interval"))
                .correctOptionIndex(1)
                .correctExplanation("The cleanup function runs prior to component unmounting and right before subsequent executions of the effect when dependencies change.")
                .tags("Objective MCQ • React Hooks").build(),
            InterviewQuestionDto.builder().id(7L).type("objective").category("JavaScript Internals").difficulty("Medium")
                .question("In the JavaScript Event Loop, which queue is processed first upon completion of the current synchronous call stack frame?")
                .options(List.of("A) Macrotask Queue (setTimeout)", "B) Microtask Queue (Promise callbacks, queueMicrotask)", "C) RequestAnimationFrame Queue", "D) UI Render Paint Queue"))
                .correctOptionIndex(1)
                .correctExplanation("Microtasks (Promises, MutationObservers) are always drained to completion before the event loop advances to the next macrotask.")
                .tags("Objective MCQ • Event Loop").build(),
            InterviewQuestionDto.builder().id(8L).type("objective").category("CSS Architecture").difficulty("Easy")
                .question("In CSS Flexbox layout, which property aligns items along the cross axis?")
                .options(List.of("A) justify-content", "B) align-items", "C) flex-direction", "D) flex-wrap"))
                .correctOptionIndex(1)
                .correctExplanation("justify-content aligns along the main axis, while align-items aligns items perpendicular to the main axis (the cross axis).")
                .tags("Objective MCQ • CSS").build(),
            InterviewQuestionDto.builder().id(9L).type("objective").category("React Optimization").difficulty("Medium")
                .question("What is the primary purpose of React.memo higher-order component?")
                .options(List.of("A) To mutate the component state directly", "B) To memoize calculation results across entire application", "C) To prevent unnecessary re-renders of a functional component when props have not changed", "D) To register service workers"))
                .correctOptionIndex(2)
                .correctExplanation("React.memo performs shallow comparison on incoming props to skip re-rendering if props are identical.")
                .tags("Objective MCQ • React Performance").build(),
            InterviewQuestionDto.builder().id(10L).type("objective").category("TypeScript").difficulty("Medium")
                .question("In TypeScript, what does the 'unknown' type represent compared to 'any'?")
                .options(List.of("A) 'unknown' allows executing any property without type checking", "B) 'unknown' is type-safe; you cannot perform arbitrary operations without narrowing or casting first", "C) 'unknown' is identical to 'null'", "D) 'unknown' can only represent primitive types"))
                .correctOptionIndex(1)
                .correctExplanation("'unknown' represents any value safely, requiring explicit type narrowing or checking before invoking methods or accessing properties.")
                .tags("Objective MCQ • TypeScript").build()
        );
    }

    private List<InterviewQuestionDto> getDevOpsQuestions() {
        return List.of(
            InterviewQuestionDto.builder().id(1L).type("descriptive").category("Kubernetes Orchestration").difficulty("Hard")
                .question("Explain how Kubernetes Service discovery and kube-proxy implement internal load balancing across Pod replicas.")
                .tags("Kubernetes • Networking").build(),
            InterviewQuestionDto.builder().id(2L).type("descriptive").category("CI/CD Automation").difficulty("Medium")
                .question("Describe a zero-downtime deployment pipeline strategy (Blue/Green vs Canary) and how automated rollback triggers work.")
                .tags("CI/CD • Deployment Strategies").build(),
            InterviewQuestionDto.builder().id(3L).type("descriptive").category("Cloud Security & IAM").difficulty("Hard")
                .question("How do you enforce least-privilege access in AWS with IAM Roles, Service Accounts (IRSA in EKS), and KMS encryption keys?")
                .tags("AWS • Security • IAM").build(),
            InterviewQuestionDto.builder().id(4L).type("descriptive").category("Infrastructure as Code").difficulty("Medium")
                .question("How do you manage state files and avoid drift in multi-environment Terraform deployments?")
                .tags("Terraform • IaC").build(),
            InterviewQuestionDto.builder().id(5L).type("descriptive").category("Behavioral & Culture").difficulty("Medium")
                .question("How do you balance rapid release velocity requests from product development against strict production reliability and compliance standards?")
                .tags("DevOps Culture • Collaboration").build(),

            InterviewQuestionDto.builder().id(6L).type("objective").category("Docker Containers").difficulty("Easy")
                .question("What Linux kernel features provide resource limitation (CPU, memory) and process isolation for Docker containers?")
                .options(List.of("A) systemd and cron", "B) cgroups (control groups) and namespaces", "C) iptables and SELinux only", "D) glibc and udev"))
                .correctOptionIndex(1)
                .correctExplanation("Namespaces provide process/network isolation, while cgroups (control groups) meter and throttle CPU and memory consumption.")
                .tags("Objective MCQ • Linux & Docker").build(),
            InterviewQuestionDto.builder().id(7L).type("objective").category("Kubernetes").difficulty("Medium")
                .question("Which Kubernetes controller object is specifically designed for running background daemon tasks on every node in the cluster?")
                .options(List.of("A) Deployment", "B) StatefulSet", "C) DaemonSet", "D) CronJob"))
                .correctOptionIndex(2)
                .correctExplanation("A DaemonSet ensures that all (or eligible) nodes run a copy of a specified Pod, typically used for log collectors or monitoring agents.")
                .tags("Objective MCQ • Kubernetes").build(),
            InterviewQuestionDto.builder().id(8L).type("objective").category("Cloud Architecture").difficulty("Easy")
                .question("In AWS, which service provides distributed multi-region DNS routing and health checking with latency-based routing?")
                .options(List.of("A) CloudFront", "B) Route 53", "C) Elastic Load Balancing (ALB)", "D) AWS Direct Connect"))
                .correctOptionIndex(1)
                .correctExplanation("Amazon Route 53 is a highly available and scalable Cloud DNS web service with health checking and latency-based routing.")
                .tags("Objective MCQ • AWS").build(),
            InterviewQuestionDto.builder().id(9L).type("objective").category("Observability").difficulty("Medium")
                .question("In Prometheus monitoring, what metric type tracks an ever-increasing numeric value that can only reset to zero upon application restart?")
                .options(List.of("A) Gauge", "B) Counter", "C) Histogram", "D) Summary"))
                .correctOptionIndex(1)
                .correctExplanation("A Counter represents a cumulative metric that monotonically increases over time, typically used for tracking request counts and errors.")
                .tags("Objective MCQ • Prometheus").build(),
            InterviewQuestionDto.builder().id(10L).type("objective").category("Continuous Delivery").difficulty("Medium")
                .question("What GitOps tool synchronizes desired Kubernetes cluster states defined in Git repositories using automated pull-based reconciliation?")
                .options(List.of("A) Jenkins", "B) ArgoCD / Flux", "C) Docker Compose", "D) Ansible"))
                .correctOptionIndex(1)
                .correctExplanation("ArgoCD and Flux continuously reconcile live cluster state with Git declarative specifications, embodying GitOps principles.")
                .tags("Objective MCQ • GitOps").build()
        );
    }
}
