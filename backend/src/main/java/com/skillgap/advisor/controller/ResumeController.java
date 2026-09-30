package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.ApiResponse;
import com.skillgap.advisor.dto.ResumeParseRequest;
import com.skillgap.advisor.dto.ResumeParseResponse;
import com.skillgap.advisor.security.UserPrincipal;
import com.skillgap.advisor.service.ResumeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/resume")
@RequiredArgsConstructor
@Tag(name = "Resume Parser", description = "Resume parsing, skill extraction, and candidate profile profiling")
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/parse")
    @Operation(summary = "Parse resume text and extract candidate skills, experience, and contact info")
    public ResponseEntity<ApiResponse<ResumeParseResponse>> parseResume(
            @RequestBody ResumeParseRequest request) {
        ResumeParseResponse response = resumeService.parseResumeText(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Resume parsed successfully"));
    }
}
