package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.ApiResponse;
import com.skillgap.advisor.dto.UserProfileDto;
import com.skillgap.advisor.dto.UserSkillDto;
import com.skillgap.advisor.security.UserPrincipal;
import com.skillgap.advisor.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
}
