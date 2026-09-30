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
public class InterviewAttemptDto {
    private String id;
    private Long userId;
    private String candidateName;
    private String role;
    private Integer attemptNumber;
    private Integer completedQuestions;
    private Integer totalQuestions;
    private Integer avgClarity;
    private Integer avgRelevance;
    private Integer overallScore;
    private String status;
    private List<InterviewResponseDetailDto> responses;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
