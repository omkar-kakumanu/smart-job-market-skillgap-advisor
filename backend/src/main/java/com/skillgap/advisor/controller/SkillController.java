package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.ApiResponse;
import com.skillgap.advisor.dto.SkillDto;
import com.skillgap.advisor.service.SkillService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/skills")
@RequiredArgsConstructor
@Tag(name = "Skills Catalog", description = "Endpoints for searching and managing global technology/soft skill definitions")
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    @Operation(summary = "Get all master skills")
    public ResponseEntity<ApiResponse<List<SkillDto>>> getAllSkills() {
        return ResponseEntity.ok(ApiResponse.success(skillService.getAllSkills(), "Skills catalog retrieved"));
    }

    @GetMapping("/search")
    @Operation(summary = "Search skills by name with pagination")
    public ResponseEntity<ApiResponse<Page<SkillDto>>> searchSkills(@RequestParam String query,
                                                                    @RequestParam(defaultValue = "0") int page,
                                                                    @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(skillService.searchSkills(query, page, size), "Search results"));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Filter skills by category (TECHNICAL, SOFT, CERTIFICATION, METHODOLOGY)")
    public ResponseEntity<ApiResponse<List<SkillDto>>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(skillService.getSkillsByCategory(category), "Category skills"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Create new skill definition (Admin/Manager only)")
    public ResponseEntity<ApiResponse<SkillDto>> createSkill(@RequestBody SkillDto dto) {
        SkillDto created = skillService.createSkill(dto);
        return new ResponseEntity<>(ApiResponse.success(created, "Skill created"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Update skill definition (Admin/Manager only)")
    public ResponseEntity<ApiResponse<SkillDto>> updateSkill(@PathVariable Long id, @RequestBody SkillDto dto) {
        SkillDto updated = skillService.updateSkill(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Skill updated"));
    }
}
