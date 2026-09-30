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
public class VoiceEvaluationRequest {
    private Long questionId;
    private String question;
    private String transcript;
    private Integer durationSeconds;
    private List<String> expectedKeywords;
}
