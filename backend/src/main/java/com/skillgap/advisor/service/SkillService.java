package com.skillgap.advisor.service;

import com.skillgap.advisor.dto.SkillDto;
import com.skillgap.advisor.entity.Skill;
import com.skillgap.advisor.entity.SkillCategory;
import com.skillgap.advisor.exception.ResourceNotFoundException;
import com.skillgap.advisor.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    @Transactional(readOnly = true)
    public List<SkillDto> getAllSkills() {
        return skillRepository.findAll(Sort.by("name").ascending()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<SkillDto> searchSkills(String query, int page, int size) {
        return skillRepository.findByNameContainingIgnoreCase(query, PageRequest.of(page, size))
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public List<SkillDto> getSkillsByCategory(String category) {
        SkillCategory cat = SkillCategory.valueOf(category.toUpperCase());
        return skillRepository.findByCategory(cat).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SkillDto createSkill(SkillDto dto) {
        Skill skill = Skill.builder()
                .name(dto.getName())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .marketDemandScore(dto.getMarketDemandScore() != null ? dto.getMarketDemandScore() : 50)
                .build();
        return mapToDto(skillRepository.save(skill));
    }

    @Transactional
    public SkillDto updateSkill(Long id, SkillDto dto) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", id));
        skill.setName(dto.getName());
        skill.setCategory(dto.getCategory());
        skill.setDescription(dto.getDescription());
        if (dto.getMarketDemandScore() != null) skill.setMarketDemandScore(dto.getMarketDemandScore());
        return mapToDto(skillRepository.save(skill));
    }

    public SkillDto mapToDto(Skill skill) {
        return SkillDto.builder()
                .id(skill.getId())
                .name(skill.getName())
                .category(skill.getCategory())
                .description(skill.getDescription())
                .marketDemandScore(skill.getMarketDemandScore())
                .build();
    }
}
