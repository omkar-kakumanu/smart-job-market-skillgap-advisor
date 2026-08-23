package com.skillgap.advisor.service;

import com.skillgap.advisor.dto.MarketTrendDto;
import com.skillgap.advisor.dto.SkillDto;
import com.skillgap.advisor.entity.JobPosting;
import com.skillgap.advisor.repository.JobPostingRepository;
import com.skillgap.advisor.repository.SkillRepository;
import com.skillgap.advisor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final SkillRepository skillRepository;
    private final JobPostingRepository jobPostingRepository;
    private final UserRepository userRepository;
    private final SkillService skillService;

    @Transactional(readOnly = true)
    public MarketTrendDto getMarketTrends() {
        List<SkillDto> topSkills = skillRepository.findTop10ByOrderByMarketDemandScoreDesc().stream()
                .map(skillService::mapToDto)
                .collect(Collectors.toList());

        List<JobPosting> jobs = jobPostingRepository.findAll();
        Map<String, Long> expMap = new HashMap<>();
        expMap.put("ENTRY_LEVEL", jobs.stream().filter(j -> "ENTRY_LEVEL".equalsIgnoreCase(j.getExperienceLevel())).count());
        expMap.put("MID_LEVEL", jobs.stream().filter(j -> "MID_LEVEL".equalsIgnoreCase(j.getExperienceLevel())).count());
        expMap.put("SENIOR_LEVEL", jobs.stream().filter(j -> "SENIOR_LEVEL".equalsIgnoreCase(j.getExperienceLevel())).count());
        expMap.put("LEAD", jobs.stream().filter(j -> "LEAD".equalsIgnoreCase(j.getExperienceLevel())).count());

        return MarketTrendDto.builder()
                .topDemandedSkills(topSkills)
                .jobsByExperienceLevel(expMap)
                .totalActiveJobs(jobPostingRepository.count())
                .totalRegisteredCandidates(userRepository.count())
                .totalSkillsTracked(skillRepository.count())
                .build();
    }
}
