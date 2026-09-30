package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.ApiResponse;
import com.skillgap.advisor.dto.AtsPipelineDto;
import com.skillgap.advisor.dto.ScheduleInterviewRequest;
import com.skillgap.advisor.dto.ScheduledInterviewDto;
import com.skillgap.advisor.security.UserPrincipal;
import com.skillgap.advisor.service.AtsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ats")
@RequiredArgsConstructor
@Tag(name = "ATS Integration Hub", description = "Application tracking across recruitment stages and interview coordination")
public class AtsController {

    private final AtsService atsService;

    @GetMapping("/pipeline")
    @Operation(summary = "Get candidate application hiring pipeline status and ATS sync records")
    public ResponseEntity<ApiResponse<AtsPipelineDto>> getPipeline(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String targetRole) {
        Long userId = principal != null ? principal.getId() : 1L;
        AtsPipelineDto pipeline = atsService.getCandidatePipeline(userId, targetRole);
        return ResponseEntity.ok(ApiResponse.success(pipeline, "ATS pipeline status retrieved"));
    }

    @PostMapping("/schedule")
    @Operation(summary = "Schedule interview video call session")
    public ResponseEntity<ApiResponse<ScheduledInterviewDto>> schedule(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody ScheduleInterviewRequest request) {
        Long userId = principal != null ? principal.getId() : 1L;
        ScheduledInterviewDto scheduled = atsService.scheduleInterview(userId, request);
        return ResponseEntity.ok(ApiResponse.success(scheduled, "Interview scheduled successfully"));
    }

    @DeleteMapping("/interviews/{id}")
    @Operation(summary = "Cancel a scheduled interview")
    public ResponseEntity<ApiResponse<Void>> cancel(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String id) {
        Long userId = principal != null ? principal.getId() : 1L;
        atsService.cancelInterview(userId, id);
        return ResponseEntity.ok(ApiResponse.success(null, "Interview cancelled"));
    }
}
