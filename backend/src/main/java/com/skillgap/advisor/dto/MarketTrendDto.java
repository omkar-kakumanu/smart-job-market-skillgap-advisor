package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketTrendDto {
    private List<SkillDto> topDemandedSkills;
    private Map<String, Long> jobsByExperienceLevel;
    private long totalActiveJobs;
    private long totalRegisteredCandidates;
    private long totalSkillsTracked;
}
