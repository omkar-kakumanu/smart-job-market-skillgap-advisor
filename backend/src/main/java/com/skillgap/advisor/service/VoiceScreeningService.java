package com.skillgap.advisor.service;

import com.skillgap.advisor.dto.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VoiceScreeningService {

    private final Map<Long, List<VoiceScreeningRecordDto>> userRecords = new ConcurrentHashMap<>();

    public List<VoiceScreeningQuestionDto> getScreeningQuestions() {
        return List.of(
            VoiceScreeningQuestionDto.builder()
                .id(1L)
                .category("Technical Background")
                .question("Please introduce yourself, summarize your recent software engineering experience, and highlight your strengths in backend and system architecture.")
                .expectedKeywords(List.of("java", "spring boot", "react", "architecture", "microservices", "database", "scale", "performance"))
                .durationEst("60-90 sec")
                .build(),
            VoiceScreeningQuestionDto.builder()
                .id(2L)
                .category("System Design & Scaling")
                .question("Can you describe a challenging technical bottleneck you solved, and how you designed the solution for reliability, security, and low latency?")
                .expectedKeywords(List.of("scalability", "docker", "api", "database", "latency", "monitoring", "cloud", "aws", "kubernetes"))
                .durationEst("60-90 sec")
                .build(),
            VoiceScreeningQuestionDto.builder()
                .id(3L)
                .category("Communication & Leadership")
                .question("How do you articulate complex technical tradeoffs to cross-functional stakeholders, and how do you resolve engineering disagreements?")
                .expectedKeywords(List.of("stakeholders", "communication", "collaboration", "clarity", "tradeoffs", "team", "agile", "delivery"))
                .durationEst("45-60 sec")
                .build()
        );
    }

    public VoiceEvaluationResponse evaluateSpokenAnswer(VoiceEvaluationRequest request) {
        String text = request.getTranscript() != null ? request.getTranscript().trim() : "";
        String lower = text.toLowerCase();

        List<String> expected = request.getExpectedKeywords() != null && !request.getExpectedKeywords().isEmpty()
                ? request.getExpectedKeywords()
                : List.of("software", "architecture", "system", "performance", "team");

        List<String> detected = expected.stream()
                .filter(lower::contains)
                .toList();

        int wordCount = text.isEmpty() ? 0 : text.split("\\s+").length;
        int fluency = Math.min(98, Math.max(65, (int)(wordCount * 1.5 + 40)));
        int techDepth = Math.min(98, Math.max(60, detected.size() * 14 + 48));
        int clarity = Math.min(96, Math.max(70, 84 + (detected.size() > 2 ? 8 : 2)));
        int communication = (int)((fluency * 0.4) + (clarity * 0.6));
        int overall = (int)((communication * 0.35) + (techDepth * 0.45) + (clarity * 0.2));

        String recommendation = overall >= 90
                ? "Strong Pass - Advance to Final Hiring Round"
                : (overall >= 75 ? "Pass - Qualified for Hiring Manager Round" : "Borderline - Additional Technical Screening Recommended");

        String feedback = String.format("Candidate demonstrated clear verbal articulation (%d%% clarity) with relevant technical keywords (%s). Spoke at a professional pace.",
                clarity, detected.isEmpty() ? "general engineering" : String.join(", ", detected));

        return VoiceEvaluationResponse.builder()
                .communication(communication)
                .clarity(clarity)
                .fluency(fluency)
                .technicalDepth(techDepth)
                .overall(overall)
                .detectedKeywords(detected.isEmpty() ? List.of("engineering", "architecture") : detected)
                .recommendation(recommendation)
                .feedback(feedback)
                .build();
    }

    public VoiceScreeningRecordDto saveRecord(Long userId, String email, String name, VoiceScreeningRecordDto record) {
        if (record.getId() == null || record.getId().trim().isEmpty()) {
            record.setId("voice-" + System.currentTimeMillis());
        }
        record.setUserId(userId);
        record.setCandidateEmail(email);
        record.setCandidateName(name);
        record.setTimestamp(LocalDateTime.now());
        record.setIsReviewed(false);

        userRecords.computeIfAbsent(userId, k -> new ArrayList<>()).add(record);
        return record;
    }

    public List<VoiceScreeningRecordDto> getUserRecords(Long userId) {
        return userRecords.getOrDefault(userId, Collections.emptyList());
    }

    public List<VoiceScreeningRecordDto> getAllRecords() {
        List<VoiceScreeningRecordDto> all = new ArrayList<>();
        userRecords.values().forEach(all::addAll);
        return all;
    }
}
