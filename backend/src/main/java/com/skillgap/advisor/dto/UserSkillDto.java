package com.skillgap.advisor.dto;

import com.skillgap.advisor.entity.ProficiencyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSkillDto {
    private Long id;
    private Long skillId;
    private String skillName;
    private String category;
    private ProficiencyLevel proficiencyLevel;
    private BigDecimal yearsExperience;
}
