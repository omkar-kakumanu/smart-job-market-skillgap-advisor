package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.ApiResponse;
import com.skillgap.advisor.dto.GapAnalysisRequest;
import com.skillgap.advisor.dto.GapAnalysisResultDto;
import com.skillgap.advisor.security.UserPrincipal;
import com.skillgap.advisor.service.SkillGapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/advisor")
@RequiredArgsConstructor
@Tag(name = "Skill Gap Advisor", description = "Core AI Skill Gap Analysis Engine and History")
public class SkillGapController {

    private final SkillGapService skillGapService;

    @PostMapping("/analyze")
    @Operation(summary = "Perform real-time skill gap analysis for a target job role or job posting ID")
    public ResponseEntity<ApiResponse<GapAnalysisResultDto>> analyzeGap(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody GapAnalysisRequest request) {
        GapAnalysisResultDto result = skillGapService.performSkillGapAnalysis(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(result, "Skill gap analysis completed successfully"));
    }

    @GetMapping("/history")
    @Operation(summary = "Get user's past skill gap analysis reports")
    public ResponseEntity<ApiResponse<List<GapAnalysisResultDto>>> getHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<GapAnalysisResultDto> history = skillGapService.getUserAnalysisHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(history, "Gap analysis history retrieved"));
    }
}
