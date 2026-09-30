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
public class VoiceScreeningQuestionDto {
    private Long id;
    private String category;
    private String question;
    private List<String> expectedKeywords;
    private String durationEst;
}
