package com.skillgap.advisor.service;

import com.skillgap.advisor.dto.JobPostingDto;
import com.skillgap.advisor.dto.JobSkillDto;
import com.skillgap.advisor.entity.JobPosting;
import com.skillgap.advisor.entity.JobSkill;
import com.skillgap.advisor.entity.Skill;
import com.skillgap.advisor.exception.ResourceNotFoundException;
import com.skillgap.advisor.repository.JobPostingRepository;
import com.skillgap.advisor.repository.JobSkillRepository;
import com.skillgap.advisor.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final JobSkillRepository jobSkillRepository;
    private final SkillRepository skillRepository;

    @Transactional(readOnly = true)
    public Page<JobPostingDto> getActiveJobs(String search, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        if (search != null && !search.trim().isEmpty()) {
            return jobPostingRepository.searchJobs(search.trim(), pageable).map(this::mapToDto);
        }
        return jobPostingRepository.findByIsActiveTrue(pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public JobPostingDto getJobById(Long id) {
        JobPosting job = jobPostingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job posting", "id", id));
        return mapToDto(job);
    }

    @Transactional
    public JobPostingDto createJob(JobPostingDto dto) {
        JobPosting job = JobPosting.builder()
                .title(dto.getTitle())
                .company(dto.getCompany())
                .location(dto.getLocation() != null ? dto.getLocation() : "Remote")
                .experienceLevel(dto.getExperienceLevel())
                .salaryRange(dto.getSalaryRange())
                .description(dto.getDescription())
                .sourceUrl(dto.getSourceUrl())
                .isActive(true)
                .postedDate(LocalDate.now())
                .build();

        JobPosting savedJob = jobPostingRepository.save(job);

        if (dto.getRequiredSkills() != null) {
            for (JobSkillDto skillDto : dto.getRequiredSkills()) {
                Skill skill = skillRepository.findById(skillDto.getSkillId())
                        .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillDto.getSkillId()));

                JobSkill js = JobSkill.builder()
                        .jobPosting(savedJob)
                        .skill(skill)
                        .isRequired(skillDto.getIsRequired() != null ? skillDto.getIsRequired() : true)
                        .importanceWeight(skillDto.getImportanceWeight() != null ? skillDto.getImportanceWeight() : 5)
                        .build();
                jobSkillRepository.save(js);
            }
        }

        return getJobById(savedJob.getId());
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!jobPostingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job posting", "id", id);
        }
        jobPostingRepository.deleteById(id);
    }

    public JobPostingDto mapToDto(JobPosting job) {
        List<JobSkillDto> skillDtos = job.getJobSkills().stream()
                .map(js -> JobSkillDto.builder()
                        .id(js.getId())
                        .skillId(js.getSkill().getId())
                        .skillName(js.getSkill().getName())
                        .category(js.getSkill().getCategory().name())
                        .isRequired(js.getIsRequired())
                        .importanceWeight(js.getImportanceWeight())
                        .build())
                .collect(Collectors.toList());

        return JobPostingDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .company(job.getCompany())
                .location(job.getLocation())
                .experienceLevel(job.getExperienceLevel())
                .salaryRange(job.getSalaryRange())
                .description(job.getDescription())
                .sourceUrl(job.getSourceUrl())
                .isActive(job.getIsActive())
                .postedDate(job.getPostedDate())
                .requiredSkills(skillDtos)
                .build();
    }
}
