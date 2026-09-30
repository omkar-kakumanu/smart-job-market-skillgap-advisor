package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewQuestionDto {
    private Long id;
    private String role;
    private String type; // "descriptive" or "objective"
    private String category;
    private String difficulty;
    private String question;
    private List<String> options;
    private Integer correctOptionIndex;
    private String correctExplanation;
    private String tags;
    private List<String> expectedPoints;
}
