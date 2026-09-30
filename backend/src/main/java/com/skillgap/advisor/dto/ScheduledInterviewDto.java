package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduledInterviewDto {
    private String id;
    private String jobTitle;
    private String interviewerName;
    private String scheduledDate;
    private String scheduledTime;
    private Integer durationMinutes;
    private String interviewType;
    private String meetingLink;
    private String status;
    private String notes;
}
