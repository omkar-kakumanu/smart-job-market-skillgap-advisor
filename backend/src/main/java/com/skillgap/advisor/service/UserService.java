package com.skillgap.advisor.service;

import com.skillgap.advisor.dto.UserProfileDto;
import com.skillgap.advisor.dto.UserSkillDto;
import com.skillgap.advisor.entity.ProficiencyLevel;
import com.skillgap.advisor.entity.Skill;
import com.skillgap.advisor.entity.SkillCategory;
import com.skillgap.advisor.entity.User;
import com.skillgap.advisor.entity.UserSkill;
import com.skillgap.advisor.exception.BadRequestException;
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
    public UserSkillDto addSkillToCandidate(String userIdentifier, Long skillId, String skillName, String category, String level, BigDecimal years) {
        User user;
        if (userIdentifier != null && userIdentifier.contains("@")) {
            user = userRepository.findByEmail(userIdentifier.trim().toLowerCase())
                    .orElseThrow(() -> new ResourceNotFoundException("Candidate User", "email", userIdentifier));
        } else {
            try {
                Long uid = Long.parseLong(userIdentifier);
                user = userRepository.findById(uid)
                        .orElseThrow(() -> new ResourceNotFoundException("Candidate User", "id", uid));
            } catch (NumberFormatException e) {
                user = userRepository.findByEmail(userIdentifier.trim().toLowerCase())
                        .orElseThrow(() -> new ResourceNotFoundException("Candidate User", "identifier", userIdentifier));
            }
        }

        Skill skill = null;
        if (skillId != null) {
            skill = skillRepository.findById(skillId)
                    .orElseThrow(() -> new ResourceNotFoundException("Skill", "id", skillId));
        } else if (skillName != null && !skillName.trim().isEmpty()) {
            final String cleanName = skillName.trim();
            skill = skillRepository.findByNameIgnoreCase(cleanName)
                    .orElseGet(() -> {
                        SkillCategory cat = SkillCategory.TECHNICAL;
                        try {
                            if (category != null && !category.isBlank()) {
                                cat = SkillCategory.valueOf(category.trim().toUpperCase());
                            }
                        } catch (Exception ignored) {}
                        Skill newSkill = Skill.builder()
                                .name(cleanName)
                                .category(cat)
                                .description("Recruiter-verified candidate competency: " + cleanName)
                                .marketDemandScore(85)
                                .build();
                        return skillRepository.save(newSkill);
                    });
        } else {
            throw new BadRequestException("Either skillId or skillName must be provided to add a skill to the candidate.");
        }

        ProficiencyLevel proficiencyLevel = ProficiencyLevel.INTERMEDIATE;
        try {
            if (level != null && !level.isBlank()) {
                proficiencyLevel = ProficiencyLevel.valueOf(level.trim().toUpperCase());
            }
        } catch (IllegalArgumentException ignored) {}

        UserSkill userSkill = userSkillRepository.findByUserIdAndSkillId(user.getId(), skill.getId())
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
    public void deleteCandidateSkill(String userIdentifier, Long skillId) {
        User user;
        if (userIdentifier != null && userIdentifier.contains("@")) {
            user = userRepository.findByEmail(userIdentifier.trim().toLowerCase())
                    .orElseThrow(() -> new ResourceNotFoundException("Candidate User", "email", userIdentifier));
        } else {
            try {
                Long uid = Long.parseLong(userIdentifier);
                user = userRepository.findById(uid)
                        .orElseThrow(() -> new ResourceNotFoundException("Candidate User", "id", uid));
            } catch (NumberFormatException e) {
                user = userRepository.findByEmail(userIdentifier.trim().toLowerCase())
                        .orElseThrow(() -> new ResourceNotFoundException("Candidate User", "identifier", userIdentifier));
            }
        }
        userSkillRepository.deleteByUserIdAndSkillId(user.getId(), skillId);
    }

    public static boolean isProtectedMainAdmin(String email) {
        if (email == null) return false;
        String clean = email.toLowerCase().trim();
        return clean.equals("admin@skillgap.com") ||
               clean.equals("admin@smartjobadvisor.com") ||
               clean.equals("admin@copilot.com") ||
               clean.equals("j.manju.raghvin@gmail.com");
    }

    @Transactional
    public UserProfileDto setUserApproval(Long userId, boolean approved) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        if (isProtectedMainAdmin(user.getEmail()) && !approved) {
            throw new BadRequestException("Action Prohibited: The primary system administrator account is protected and cannot have access revoked.");
        }
        user.setIsApproved(approved);
        User saved = userRepository.save(user);
        return mapToProfileDto(saved);
    }


    @Transactional
    public UserProfileDto setUserRole(String userIdentifier, String roleStr) {
        User user;
        if (userIdentifier != null && userIdentifier.contains("@")) {
            user = userRepository.findByEmail(userIdentifier.trim().toLowerCase())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", userIdentifier));
        } else {
            try {
                Long uid = Long.parseLong(userIdentifier);
                user = userRepository.findById(uid)
                        .orElseThrow(() -> new ResourceNotFoundException("User", "id", uid));
            } catch (NumberFormatException e) {
                user = userRepository.findByEmail(userIdentifier.trim().toLowerCase())
                        .orElseThrow(() -> new ResourceNotFoundException("User", "identifier", userIdentifier));
            }
        }

        Role newRole = Role.ROLE_USER;
        String r = roleStr != null ? roleStr.trim().toUpperCase() : "ROLE_USER";
        if (r.contains("ADMIN")) {
            newRole = Role.ROLE_ADMIN;
        } else if (r.contains("RECRUITER")) {
            newRole = Role.ROLE_RECRUITER;
        } else if (r.contains("MANAGER")) {
            newRole = Role.ROLE_MANAGER;
        } else {
            newRole = Role.ROLE_USER;
        }

                if (isProtectedMainAdmin(user.getEmail()) && newRole != Role.ROLE_ADMIN) {
            throw new BadRequestException("Action Prohibited: The primary system administrator account is protected and cannot be demoted.");
        }
        user.setRole(newRole);
        User saved = userRepository.save(user);
        return mapToProfileDto(saved);
    }

    @Transactional
    public UserProfileDto updateCandidateProfile(String userIdentifier, UserProfileDto dto) {
        User user;
        if (userIdentifier != null && userIdentifier.contains("@")) {
            user = userRepository.findByEmail(userIdentifier.trim().toLowerCase())
                    .orElseThrow(() -> new ResourceNotFoundException("Candidate User", "email", userIdentifier));
        } else {
            try {
                Long uid = Long.parseLong(userIdentifier);
                user = userRepository.findById(uid)
                        .orElseThrow(() -> new ResourceNotFoundException("Candidate User", "id", uid));
            } catch (NumberFormatException e) {
                user = userRepository.findByEmail(userIdentifier.trim().toLowerCase())
                        .orElseThrow(() -> new ResourceNotFoundException("Candidate User", "identifier", userIdentifier));
            }
        }

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
