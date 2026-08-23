package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.ApiResponse;
import com.skillgap.advisor.dto.CourseDto;
import com.skillgap.advisor.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
@Tag(name = "Courses & Learning Resources", description = "Endpoints for course recommendations and skill bridge materials")
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    @Operation(summary = "Get all learning courses")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getAllCourses() {
        return ResponseEntity.ok(ApiResponse.success(courseService.getAllCourses(), "Courses retrieved"));
    }

    @GetMapping("/skill/{skillId}")
    @Operation(summary = "Get courses recommended for a specific skill ID")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getCoursesBySkill(@PathVariable Long skillId) {
        return ResponseEntity.ok(ApiResponse.success(courseService.getCoursesBySkill(skillId), "Recommended courses retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Add new course resource (Admin/Manager only)")
    public ResponseEntity<ApiResponse<CourseDto>> createCourse(@RequestBody CourseDto dto) {
        CourseDto created = courseService.createCourse(dto);
        return new ResponseEntity<>(ApiResponse.success(created, "Course created"), HttpStatus.CREATED);
    }
}
