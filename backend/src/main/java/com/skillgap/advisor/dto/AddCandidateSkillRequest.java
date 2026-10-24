package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddCandidateSkillRequest {
    private Long skillId;
    private String skillName;
    private String category;
    private String level;
    private BigDecimal years;
}
