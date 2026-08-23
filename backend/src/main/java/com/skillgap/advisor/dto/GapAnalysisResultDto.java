package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GapAnalysisResultDto {
    private Long id;
    private Long userId;
    private String targetJobTitle;
    private BigDecimal matchPercentage;
    private Integer matchedSkillsCount;
    private Integer missingSkillsCount;
    private List<UserSkillDto> matchedSkills;
    private List<MissingSkillDetailDto> missingSkills;
    private List<CourseDto> recommendedCourses;
    private LocalDateTime createdAt;
}
