package com.skillgap.advisor.dto;

import com.skillgap.advisor.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String fullName;
    private String email;
    private String profileImageUrl;
    private String targetCareerRole;
    private String experienceLevel;
    private String bio;
    private Role role;
    private Boolean isApproved;
    private String approvalStatus;
    private List<UserSkillDto> skills;
}
