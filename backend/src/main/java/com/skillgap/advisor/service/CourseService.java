package com.skillgap.advisor.service;

import com.skillgap.advisor.dto.CourseDto;
import com.skillgap.advisor.entity.Course;
import com.skillgap.advisor.entity.Skill;
import com.skillgap.advisor.exception.ResourceNotFoundException;
import com.skillgap.advisor.repository.CourseRepository;
import com.skillgap.advisor.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final SkillRepository skillRepository;

    @Transactional(readOnly = true)
    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CourseDto> getCoursesBySkill(Long skillId) {
        return courseRepository.findByPrimarySkillId(skillId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CourseDto createCourse(CourseDto dto) {
        Skill skill = skillRepository.findById(dto.getPrimarySkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", dto.getPrimarySkillId()));

        Course course = Course.builder()
                .title(dto.getTitle())
                .provider(dto.getProvider())
                .courseUrl(dto.getCourseUrl())
                .durationHours(dto.getDurationHours())
                .difficulty(dto.getDifficulty() != null ? dto.getDifficulty() : "INTERMEDIATE")
                .costType(dto.getCostType() != null ? dto.getCostType() : "PAID")
                .rating(dto.getRating())
                .primarySkill(skill)
                .build();

        return mapToDto(courseRepository.save(course));
    }

    public CourseDto mapToDto(Course c) {
        return CourseDto.builder()
                .id(c.getId())
                .title(c.getTitle())
                .provider(c.getProvider())
                .courseUrl(c.getCourseUrl())
                .durationHours(c.getDurationHours())
                .difficulty(c.getDifficulty())
                .costType(c.getCostType())
                .rating(c.getRating())
                .primarySkillId(c.getPrimarySkill().getId())
                .primarySkillName(c.getPrimarySkill().getName())
                .build();
    }
}
