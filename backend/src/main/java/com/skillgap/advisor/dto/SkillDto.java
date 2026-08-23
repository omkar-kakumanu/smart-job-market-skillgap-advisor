package com.skillgap.advisor.dto;

import com.skillgap.advisor.entity.SkillCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillDto {
    private Long id;
    private String name;
    private SkillCategory category;
    private String description;
    private Integer marketDemandScore;
}
