package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPostingDto {
    private Long id;
    private String title;
    private String company;
    private String location;
    private String experienceLevel;
    private String salaryRange;
    private String description;
    private String sourceUrl;
    private Boolean isActive;
    private LocalDate postedDate;
    private List<JobSkillDto> requiredSkills;
}
