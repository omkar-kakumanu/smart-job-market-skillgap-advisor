package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.*;
import com.skillgap.advisor.security.UserPrincipal;
import com.skillgap.advisor.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
@Tag(name = "AI Interview Simulation", description = "Role-specific question generation, objective/descriptive grading, and attempt management")
public class InterviewController {

    private final InterviewService interviewService;

    @GetMapping("/questions")
    @Operation(summary = "Get 10 role-specific questions (descriptive + objective MCQs)")
    public ResponseEntity<ApiResponse<List<InterviewQuestionDto>>> getQuestions(
            @RequestParam(required = false, defaultValue = "Full Stack Java Developer") String role,
            @RequestParam(required = false, defaultValue = "ALL") String category) {
        List<InterviewQuestionDto> list = interviewService.getQuestionsForRole(role, category);
        return ResponseEntity.ok(ApiResponse.success(list, "10 role-specific interview questions generated successfully"));
    }

    @PostMapping("/evaluate")
    @Operation(summary = "Evaluate candidate question response in real-time")
    public ResponseEntity<ApiResponse<InterviewEvaluationResponse>> evaluate(
            @RequestBody InterviewEvaluationRequest request) {
        InterviewEvaluationResponse response = interviewService.evaluateResponse(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Response evaluated successfully"));
    }

    @PostMapping("/attempt")
    @Operation(summary = "Save an interview simulation attempt session (Attempt 1, 2...)")
    public ResponseEntity<ApiResponse<InterviewAttemptDto>> saveAttempt(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody InterviewAttemptDto attempt) {
        Long userId = principal != null ? principal.getId() : 1L;
        String name = principal != null ? principal.getFullName() : "Candidate";
        InterviewAttemptDto saved = interviewService.saveAttempt(userId, name, attempt);
        return ResponseEntity.ok(ApiResponse.success(saved, "Interview attempt saved successfully"));
    }

    @GetMapping("/history")
    @Operation(summary = "Get user's past interview attempts")
    public ResponseEntity<ApiResponse<List<InterviewAttemptDto>>> getHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal != null ? principal.getId() : 1L;
        List<InterviewAttemptDto> history = interviewService.getUserAttempts(userId);
        return ResponseEntity.ok(ApiResponse.success(history, "Interview attempt history retrieved"));
    }

    @GetMapping("/candidate/{targetUserId}")
    @Operation(summary = "Get specific candidate interview simulation attempts (Admin/Recruiter)")
    public ResponseEntity<ApiResponse<List<InterviewAttemptDto>>> getCandidateAttempts(
            @PathVariable Long targetUserId) {
        List<InterviewAttemptDto> history = interviewService.getUserAttempts(targetUserId);
        return ResponseEntity.ok(ApiResponse.success(history, "Candidate interview attempts retrieved"));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all candidate interview simulation attempts (Admin/Recruiter)")
    public ResponseEntity<ApiResponse<List<InterviewAttemptDto>>> getAllAttempts() {
        List<InterviewAttemptDto> history = interviewService.getAllAttempts();
        return ResponseEntity.ok(ApiResponse.success(history, "All candidate interview attempts retrieved"));
    }
}
