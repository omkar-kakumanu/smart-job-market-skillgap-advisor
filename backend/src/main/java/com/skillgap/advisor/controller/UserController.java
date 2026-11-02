package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.AddCandidateSkillRequest;
import com.skillgap.advisor.dto.ApiResponse;
import com.skillgap.advisor.dto.UserProfileDto;
import com.skillgap.advisor.dto.UserSkillDto;
import com.skillgap.advisor.security.UserPrincipal;
import com.skillgap.advisor.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "Endpoints for user profile and personal skill inventory management")
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    @Operation(summary = "Get current authenticated user profile and skills")
    public ResponseEntity<ApiResponse<UserProfileDto>> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserProfileDto profile = userService.getUserProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(profile, "Profile retrieved successfully"));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile details")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                                    @RequestBody UserProfileDto dto) {
        UserProfileDto updated = userService.updateProfile(principal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Profile updated successfully"));
    }

    @PostMapping("/skills")
    @Operation(summary = "Add or update a skill in user's profile")
    public ResponseEntity<ApiResponse<UserSkillDto>> addSkill(@AuthenticationPrincipal UserPrincipal principal,
                                                             @RequestParam Long skillId,
                                                             @RequestParam(required = false, defaultValue = "INTERMEDIATE") String level,
                                                             @RequestParam(required = false, defaultValue = "1.0") BigDecimal years) {
        UserSkillDto skillDto = userService.addOrUpdateUserSkill(principal.getId(), skillId, level, years);
        return ResponseEntity.ok(ApiResponse.success(skillDto, "Skill updated in user profile"));
    }

    @DeleteMapping("/skills/{skillId}")
    @Operation(summary = "Remove a skill from user profile")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(@AuthenticationPrincipal UserPrincipal principal,
                                                         @PathVariable Long skillId) {
        userService.deleteUserSkill(principal.getId(), skillId);
        return ResponseEntity.ok(ApiResponse.success(null, "Skill removed from user profile"));
    }

    @PutMapping("/{userId}/approval")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECRUITER')")
    @Operation(summary = "Approve or revoke candidate platform access (Admin & Recruiter)")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateApproval(
            @PathVariable Long userId,
            @RequestParam(required = false, defaultValue = "true") boolean approved) {
        UserProfileDto updated = userService.setUserApproval(userId, approved);
        return ResponseEntity.ok(ApiResponse.success(updated, "Candidate approval status updated"));
    }

    @PutMapping("/{userId}/role")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECRUITER')")
    @Operation(summary = "Admin/Recruiter: Update candidate position / system role (e.g. promote candidate to recruiter)")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateUserRole(
            @PathVariable String userId,
            @RequestParam String role) {
        UserProfileDto updated = userService.setUserRole(userId, role);
        return ResponseEntity.ok(ApiResponse.success(updated, "User position and system role updated successfully"));
    }

    @PutMapping("/{userId}/profile")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECRUITER')")
    @Operation(summary = "Recruiter/Admin: Update candidate profile details")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateCandidateProfile(
            @PathVariable String userId,
            @RequestBody UserProfileDto dto) {
        UserProfileDto updated = userService.updateCandidateProfile(userId, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Candidate profile updated successfully"));
    }

    @PostMapping("/{userId}/skills")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECRUITER')")
    @Operation(summary = "Recruiter/Admin: Add or update a verified skill for a candidate")
    public ResponseEntity<ApiResponse<UserSkillDto>> addCandidateSkill(
            @PathVariable String userId,
            @RequestBody(required = false) AddCandidateSkillRequest body,
            @RequestParam(required = false) Long skillId,
            @RequestParam(required = false) String skillName,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) BigDecimal years) {

        Long sId = (body != null && body.getSkillId() != null) ? body.getSkillId() : skillId;
        String sName = (body != null && body.getSkillName() != null) ? body.getSkillName() : skillName;
        String cat = (body != null && body.getCategory() != null) ? body.getCategory() : (category != null ? category : "TECHNICAL");
        String lvl = (body != null && body.getLevel() != null) ? body.getLevel() : (level != null ? level : "INTERMEDIATE");
        BigDecimal yr = (body != null && body.getYears() != null) ? body.getYears() : (years != null ? years : BigDecimal.ONE);

        UserSkillDto skillDto = userService.addSkillToCandidate(userId, sId, sName, cat, lvl, yr);
        return ResponseEntity.ok(ApiResponse.success(skillDto, "Skill successfully added to candidate profile by recruiter"));
    }

    @DeleteMapping("/{userId}/skills/{skillId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'RECRUITER')")
    @Operation(summary = "Recruiter/Admin: Remove a skill from candidate profile")
    public ResponseEntity<ApiResponse<Void>> deleteCandidateSkill(
            @PathVariable String userId,
            @PathVariable Long skillId) {
        userService.deleteCandidateSkill(userId, skillId);
        return ResponseEntity.ok(ApiResponse.success(null, "Skill removed from candidate profile by recruiter"));
    }
}
