package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MissingSkillDetailDto {
    private Long skillId;
    private String skillName;
    private String category;
    private Integer importanceWeight;
    private String recommendedAction;
}
