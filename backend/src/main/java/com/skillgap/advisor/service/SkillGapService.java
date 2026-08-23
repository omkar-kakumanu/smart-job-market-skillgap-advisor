package com.skillgap.advisor.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillgap.advisor.dto.*;
import com.skillgap.advisor.entity.*;
import com.skillgap.advisor.exception.BadRequestException;
import com.skillgap.advisor.exception.ResourceNotFoundException;
import com.skillgap.advisor.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillGapService {

    private final UserRepository userRepository;
    private final JobPostingRepository jobPostingRepository;
    private final CourseRepository courseRepository;
    private final GapAnalysisResultRepository gapAnalysisResultRepository;
    private final UserService userService;
    private final CourseService courseService;
    private final ObjectMapper objectMapper;

    @Transactional
    public GapAnalysisResultDto performSkillGapAnalysis(Long userId, GapAnalysisRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        JobPosting jobPosting = null;
        List<JobSkill> requiredJobSkills = new ArrayList<>();
        String targetTitle = request.getTargetJobTitle();

        if (request.getJobPostingId() != null) {
            jobPosting = jobPostingRepository.findById(request.getJobPostingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Job Posting", "id", request.getJobPostingId()));
            requiredJobSkills = jobPosting.getJobSkills();
            targetTitle = jobPosting.getTitle();
        } else if (targetTitle != null && !targetTitle.trim().isEmpty()) {
            final String roleToMatch = targetTitle.trim();
            List<JobPosting> matchedJobs = jobPostingRepository.findByIsActiveTrue(null).getContent();
            Optional<JobPosting> matching = matchedJobs.stream()
                    .filter(j -> j.getTitle().equalsIgnoreCase(roleToMatch))
                    .findFirst();
            if (matching.isPresent()) {
                jobPosting = matching.get();
                requiredJobSkills = jobPosting.getJobSkills();
            }
        }

        if (requiredJobSkills.isEmpty()) {
            throw new BadRequestException("No required skills found for the target role: " + targetTitle);
        }

        List<UserSkill> userSkillList = user.getUserSkills() != null ? user.getUserSkills() : new ArrayList<>();
        Set<Long> userSkillIds = userSkillList.stream()
                .map(us -> us.getSkill().getId())
                .collect(Collectors.toSet());

        List<UserSkillDto> matchedSkills = new ArrayList<>();
        List<MissingSkillDetailDto> missingSkills = new ArrayList<>();

        int totalWeight = 0;
        int matchedWeight = 0;

        for (JobSkill js : requiredJobSkills) {
            int weight = js.getImportanceWeight() != null ? js.getImportanceWeight() : 5;
            totalWeight += weight;

            if (userSkillIds.contains(js.getSkill().getId())) {
                matchedWeight += weight;
                userSkillList.stream()
                        .filter(us -> us.getSkill().getId().equals(js.getSkill().getId()))
                        .findFirst()
                        .ifPresent(us -> matchedSkills.add(userService.mapToUserSkillDto(us)));
            } else {
                missingSkills.add(MissingSkillDetailDto.builder()
                        .skillId(js.getSkill().getId())
                        .skillName(js.getSkill().getName())
                        .category(js.getSkill().getCategory().name())
                        .importanceWeight(weight)
                        .recommendedAction("Complete foundational course and hands-on project in " + js.getSkill().getName())
                        .build());
            }
        }

        double matchPercentRaw = totalWeight > 0 ? ((double) matchedWeight / totalWeight) * 100.0 : 0.0;
        BigDecimal matchPercentage = BigDecimal.valueOf(matchPercentRaw).setScale(2, RoundingMode.HALF_UP);

        // Fetch Courses for missing skills
        List<Long> missingSkillIds = missingSkills.stream().map(MissingSkillDetailDto::getSkillId).collect(Collectors.toList());
        List<CourseDto> recommendedCourses = new ArrayList<>();
        if (!missingSkillIds.isEmpty()) {
            recommendedCourses = courseRepository.findByPrimarySkillIdIn(missingSkillIds).stream()
                    .map(courseService::mapToDto)
                    .collect(Collectors.toList());
        }

        // Save Gap Analysis Snapshot
        String missingJson = "";
        String recsJson = "";
        try {
            missingJson = objectMapper.writeValueAsString(missingSkills);
            recsJson = objectMapper.writeValueAsString(recommendedCourses);
        } catch (Exception e) {
            missingJson = "[]";
            recsJson = "[]";
        }

        GapAnalysisResult result = GapAnalysisResult.builder()
                .user(user)
                .targetJobTitle(targetTitle)
                .matchPercentage(matchPercentage)
                .matchedSkillsCount(matchedSkills.size())
                .missingSkillsCount(missingSkills.size())
                .missingSkillsJson(missingJson)
                .recommendationsJson(recsJson)
                .build();

        GapAnalysisResult saved = gapAnalysisResultRepository.save(result);

        return GapAnalysisResultDto.builder()
                .id(saved.getId())
                .userId(userId)
                .targetJobTitle(targetTitle)
                .matchPercentage(matchPercentage)
                .matchedSkillsCount(matchedSkills.size())
                .missingSkillsCount(missingSkills.size())
                .matchedSkills(matchedSkills)
                .missingSkills(missingSkills)
                .recommendedCourses(recommendedCourses)
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<GapAnalysisResultDto> getUserAnalysisHistory(Long userId) {
        return gapAnalysisResultRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResultDto)
                .collect(Collectors.toList());
    }

    private GapAnalysisResultDto mapToResultDto(GapAnalysisResult entity) {
        List<MissingSkillDetailDto> missing = new ArrayList<>();
        List<CourseDto> courses = new ArrayList<>();
        try {
            if (entity.getMissingSkillsJson() != null) {
                missing = objectMapper.readValue(entity.getMissingSkillsJson(), new TypeReference<List<MissingSkillDetailDto>>() {});
            }
            if (entity.getRecommendationsJson() != null) {
                courses = objectMapper.readValue(entity.getRecommendationsJson(), new TypeReference<List<CourseDto>>() {});
            }
        } catch (Exception ignored) {}

        return GapAnalysisResultDto.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .targetJobTitle(entity.getTargetJobTitle())
                .matchPercentage(entity.getMatchPercentage())
                .matchedSkillsCount(entity.getMatchedSkillsCount())
                .missingSkillsCount(entity.getMissingSkillsCount())
                .missingSkills(missing)
                .recommendedCourses(courses)
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
