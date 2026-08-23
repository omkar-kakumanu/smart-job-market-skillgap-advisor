package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.ApiResponse;
import com.skillgap.advisor.dto.JobPostingDto;
import com.skillgap.advisor.service.JobPostingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Tag(name = "Job Postings", description = "Endpoints for market job postings, searching, and filtering")
public class JobPostingController {

    private final JobPostingService jobPostingService;

    @GetMapping
    @Operation(summary = "Get active job postings with pagination, search, and sorting")
    public ResponseEntity<ApiResponse<Page<JobPostingDto>>> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "postedDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        Page<JobPostingDto> jobs = jobPostingService.getActiveJobs(search, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success(jobs, "Job postings retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed job posting by ID with required skills breakdown")
    public ResponseEntity<ApiResponse<JobPostingDto>> getJobById(@PathVariable Long id) {
        JobPostingDto job = jobPostingService.getJobById(id);
        return ResponseEntity.ok(ApiResponse.success(job, "Job details retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Post new job description with required skills (Admin/Manager only)")
    public ResponseEntity<ApiResponse<JobPostingDto>> createJob(@RequestBody JobPostingDto dto) {
        JobPostingDto created = jobPostingService.createJob(dto);
        return new ResponseEntity<>(ApiResponse.success(created, "Job posting created"), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Remove job posting (Admin/Manager only)")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        jobPostingService.deleteJob(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Job posting deleted"));
    }
}
