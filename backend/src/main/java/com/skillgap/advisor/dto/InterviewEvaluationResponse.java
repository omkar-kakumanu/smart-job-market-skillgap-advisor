package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewEvaluationResponse {
    private Integer clarity;
    private Integer relevance;
    private Integer overall;
    private Boolean isCorrect;
    private String feedback;
    private String suggestion;
}
