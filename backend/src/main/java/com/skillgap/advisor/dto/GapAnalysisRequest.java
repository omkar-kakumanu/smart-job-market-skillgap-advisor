package com.skillgap.advisor.dto;

import lombok.Data;

@Data
public class GapAnalysisRequest {
    private Long jobPostingId;
    private String targetJobTitle;
}
