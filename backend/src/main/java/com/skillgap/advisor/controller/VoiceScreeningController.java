package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.*;
import com.skillgap.advisor.security.UserPrincipal;
import com.skillgap.advisor.service.VoiceScreeningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/voice-screening")
@RequiredArgsConstructor
@Tag(name = "Voice Screening Studio", description = "Endpoints for audio screening questions, transcript evaluation, and reports")
public class VoiceScreeningController {

    private final VoiceScreeningService voiceScreeningService;

    @GetMapping("/questions")
    @Operation(summary = "Get standardized voice screening interview questions")
    public ResponseEntity<ApiResponse<List<VoiceScreeningQuestionDto>>> getQuestions() {
        List<VoiceScreeningQuestionDto> questions = voiceScreeningService.getScreeningQuestions();
        return ResponseEntity.ok(ApiResponse.success(questions, "Voice screening questions retrieved"));
    }

    @PostMapping("/evaluate")
    @Operation(summary = "Evaluate spoken response transcript and duration")
    public ResponseEntity<ApiResponse<VoiceEvaluationResponse>> evaluate(
            @RequestBody VoiceEvaluationRequest request) {
        VoiceEvaluationResponse response = voiceScreeningService.evaluateSpokenAnswer(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Spoken response evaluated"));
    }

    @PostMapping("/record")
    @Operation(summary = "Save candidate voice screening assessment report")
    public ResponseEntity<ApiResponse<VoiceScreeningRecordDto>> saveRecord(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody VoiceScreeningRecordDto record) {
        Long userId = principal != null ? principal.getId() : 1L;
        String email = principal != null ? principal.getEmail() : "candidate@skillgap.com";
        String name = principal != null ? principal.getFullName() : "Candidate";
        VoiceScreeningRecordDto saved = voiceScreeningService.saveRecord(userId, email, name, record);
        return ResponseEntity.ok(ApiResponse.success(saved, "Voice screening assessment report saved"));
    }

    @GetMapping("/history")
    @Operation(summary = "Get user's past voice screening recordings and scores")
    public ResponseEntity<ApiResponse<List<VoiceScreeningRecordDto>>> getHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal != null ? principal.getId() : 1L;
        List<VoiceScreeningRecordDto> records = voiceScreeningService.getUserRecords(userId);
        return ResponseEntity.ok(ApiResponse.success(records, "Voice screening records retrieved"));
    }

    @GetMapping("/candidate/{targetUserId}")
    @Operation(summary = "Get specific candidate voice screening records (Admin/Recruiter)")
    public ResponseEntity<ApiResponse<List<VoiceScreeningRecordDto>>> getCandidateRecords(
            @PathVariable Long targetUserId) {
        List<VoiceScreeningRecordDto> records = voiceScreeningService.getUserRecords(targetUserId);
        return ResponseEntity.ok(ApiResponse.success(records, "Candidate voice screening records retrieved"));
    }

    @GetMapping("/all")
    @Operation(summary = "Get all candidate voice screening records (Admin/Recruiter)")
    public ResponseEntity<ApiResponse<List<VoiceScreeningRecordDto>>> getAllCandidateRecords() {
        List<VoiceScreeningRecordDto> records = voiceScreeningService.getAllRecords();
        return ResponseEntity.ok(ApiResponse.success(records, "All candidate voice screening records retrieved"));
    }
}
