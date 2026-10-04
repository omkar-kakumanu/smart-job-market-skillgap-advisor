package com.skillgap.advisor.service;

import com.skillgap.advisor.dto.UserProfileDto;
import com.skillgap.advisor.dto.UserSkillDto;
import com.skillgap.advisor.entity.ProficiencyLevel;
import com.skillgap.advisor.entity.Skill;
import com.skillgap.advisor.entity.User;
import com.skillgap.advisor.entity.UserSkill;
import com.skillgap.advisor.exception.ResourceNotFoundException;
import com.skillgap.advisor.repository.SkillRepository;
import com.skillgap.advisor.repository.UserRepository;
import com.skillgap.advisor.repository.UserSkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToProfileDto(user);
    }

    @Transactional
    public UserProfileDto updateProfile(Long userId, UserProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (dto.getFullName() != null && !dto.getFullName().isBlank()) {
            user.setFullName(dto.getFullName().trim());
        }
        if (dto.getTargetCareerRole() != null) user.setTargetCareerRole(dto.getTargetCareerRole());
        if (dto.getExperienceLevel() != null) user.setExperienceLevel(dto.getExperienceLevel());
        if (dto.getBio() != null) user.setBio(dto.getBio());
        if (dto.getProfileImageUrl() != null) user.setProfileImageUrl(dto.getProfileImageUrl());

        User updated = userRepository.save(user);
        return mapToProfileDto(updated);
    }

    @Transactional
    public UserSkillDto addOrUpdateUserSkill(Long userId, Long skillId, String level, BigDecimal years) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));

        ProficiencyLevel proficiencyLevel = ProficiencyLevel.INTERMEDIATE;
        try {
            if (level != null) proficiencyLevel = ProficiencyLevel.valueOf(level.toUpperCase());
        } catch (IllegalArgumentException ignored) {}

        UserSkill userSkill = userSkillRepository.findByUserIdAndSkillId(userId, skillId)
                .orElse(UserSkill.builder()
                        .user(user)
                        .skill(skill)
                        .build());

        userSkill.setProficiencyLevel(proficiencyLevel);
        userSkill.setYearsExperience(years != null ? years : BigDecimal.ONE);

        UserSkill saved = userSkillRepository.save(userSkill);
        return mapToUserSkillDto(saved);
    }

    @Transactional
    public void deleteUserSkill(Long userId, Long skillId) {
        userSkillRepository.deleteByUserIdAndSkillId(userId, skillId);
    }

    @Transactional
    public UserProfileDto setUserApproval(Long userId, boolean approved) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setIsApproved(approved);
        User saved = userRepository.save(user);
        return mapToProfileDto(saved);
    }

    public UserProfileDto mapToProfileDto(User user) {
        List<UserSkillDto> skillDtos = user.getUserSkills().stream()
                .map(this::mapToUserSkillDto)
                .collect(Collectors.toList());

        return UserProfileDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .profileImageUrl(user.getProfileImageUrl())
                .targetCareerRole(user.getTargetCareerRole())
                .experienceLevel(user.getExperienceLevel())
                .bio(user.getBio())
                .role(user.getRole())
                .isApproved(user.getIsApproved() != null ? user.getIsApproved() : true)
                .approvalStatus(Boolean.FALSE.equals(user.getIsApproved()) ? "PENDING_APPROVAL" : "APPROVED")
                .skills(skillDtos)
                .build();
    }

    public UserSkillDto mapToUserSkillDto(UserSkill us) {
        return UserSkillDto.builder()
                .id(us.getId())
                .skillId(us.getSkill().getId())
                .skillName(us.getSkill().getName())
                .category(us.getSkill().getCategory().name())
                .proficiencyLevel(us.getProficiencyLevel())
                .yearsExperience(us.getYearsExperience())
                .build();
    }
}
