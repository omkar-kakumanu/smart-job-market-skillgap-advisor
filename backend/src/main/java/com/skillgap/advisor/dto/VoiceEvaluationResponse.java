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
public class VoiceEvaluationResponse {
    private Integer communication;
    private Integer clarity;
    private Integer fluency;
    private Integer technicalDepth;
    private Integer overall;
    private List<String> detectedKeywords;
    private String recommendation;
    private String feedback;
}
