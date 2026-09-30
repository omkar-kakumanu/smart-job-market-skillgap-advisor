package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponseDetailDto {
    private Integer questionIndex;
    private String question;
    private String questionType;
    private String answer;
    private Integer selectedOptionIndex;
    private Boolean isCorrect;
    private Integer clarity;
    private Integer relevance;
    private Integer overall;
    private String feedback;
}
