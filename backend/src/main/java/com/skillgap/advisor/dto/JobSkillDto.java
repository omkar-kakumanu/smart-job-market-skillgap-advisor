package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobSkillDto {
    private Long id;
    private Long skillId;
    private String skillName;
    private String category;
    private Boolean isRequired;
    private Integer importanceWeight;
}
