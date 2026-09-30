package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtsPipelineDto {
    private String currentStage;
    private Integer currentStageIndex;
    private String targetJobTitle;
    private String company;
    private Integer matchScore;
    private List<AtsSyncRecordDto> syncRecords;
    private List<ScheduledInterviewDto> scheduledInterviews;
}
