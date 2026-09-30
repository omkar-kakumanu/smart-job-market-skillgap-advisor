package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoiceScreeningRecordDto {
    private String id;
    private Long userId;
    private String candidateName;
    private String candidateEmail;
    private String role;
    private String question;
    private String transcript;
    private Integer durationSeconds;
    private Integer communication;
    private Integer clarity;
    private Integer fluency;
    private Integer technicalDepth;
    private Integer overall;
    private List<String> detectedKeywords;
    private String recommendation;
    private String feedback;
    private Boolean isReviewed;
    private String reviewedBy;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
