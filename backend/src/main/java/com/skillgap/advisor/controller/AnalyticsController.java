package com.skillgap.advisor.controller;

import com.skillgap.advisor.dto.ApiResponse;
import com.skillgap.advisor.dto.MarketTrendDto;
import com.skillgap.advisor.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Market Analytics", description = "Endpoints for job market trends and demand distribution")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/trends")
    @Operation(summary = "Get high-demand skills, active jobs breakdown, and system stats")
    public ResponseEntity<ApiResponse<MarketTrendDto>> getMarketTrends() {
        MarketTrendDto trends = analyticsService.getMarketTrends();
        return ResponseEntity.ok(ApiResponse.success(trends, "Market trends data retrieved"));
    }
}
