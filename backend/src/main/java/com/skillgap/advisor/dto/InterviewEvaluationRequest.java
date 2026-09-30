package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewEvaluationRequest {
    private Long questionId;
    private String questionText;
    private String questionType;
    private String candidateAnswer;
    private Integer selectedOptionIndex;
    private Integer correctOptionIndex;
    private String correctExplanation;
    private String category;
}
