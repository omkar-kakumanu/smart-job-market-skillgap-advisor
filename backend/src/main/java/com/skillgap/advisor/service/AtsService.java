package com.skillgap.advisor.service;

import com.skillgap.advisor.dto.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AtsService {

    private final Map<Long, List<ScheduledInterviewDto>> userScheduledInterviews = new ConcurrentHashMap<>();

    public AtsPipelineDto getCandidatePipeline(Long userId, String targetRole) {
        String role = targetRole != null && !targetRole.isEmpty() ? targetRole : "Full Stack Java Developer";

        List<AtsSyncRecordDto> syncRecords = List.of(
            AtsSyncRecordDto.builder().provider("Greenhouse").externalId("GH-98421").status("Synchronized").lastSynced("2 mins ago").build(),
            AtsSyncRecordDto.builder().provider("Lever").externalId("LEV-55102").status("Active Application").lastSynced("15 mins ago").build(),
            AtsSyncRecordDto.builder().provider("Workday").externalId("WD-202688").status("Shortlisted").lastSynced("1 hour ago").build()
        );

        List<ScheduledInterviewDto> interviews = userScheduledInterviews.getOrDefault(userId, new ArrayList<>());
        if (interviews.isEmpty()) {
            interviews = new ArrayList<>(List.of(
                ScheduledInterviewDto.builder()
                    .id("int-1")
                    .jobTitle(role)
                    .interviewerName("Talent Acquisition Lead")
                    .scheduledDate("Tomorrow")
                    .scheduledTime("11:00 AM IST")
                    .durationMinutes(45)
                    .interviewType("TECHNICAL_INTERVIEW")
                    .meetingLink("https://meet.google.com/tech-interview-room")
                    .status("CONFIRMED")
                    .notes("Review core Java Virtual Threads, Spring Boot architecture, and high-concurrency database optimizations.")
                    .build()
            ));
            userScheduledInterviews.put(userId, interviews);
        }

        return AtsPipelineDto.builder()
                .currentStage("INTERVIEWING")
                .currentStageIndex(2)
                .targetJobTitle(role)
                .company("Enterprise Talent Partner")
                .matchScore(94)
                .syncRecords(syncRecords)
                .scheduledInterviews(interviews)
                .build();
    }

    public ScheduledInterviewDto scheduleInterview(Long userId, ScheduleInterviewRequest request) {
        ScheduledInterviewDto dto = ScheduledInterviewDto.builder()
                .id("int-" + System.currentTimeMillis())
                .jobTitle(request.getJobTitle() != null ? request.getJobTitle() : "Software Engineer")
                .interviewerName(request.getInterviewerName() != null ? request.getInterviewerName() : "Recruiter")
                .scheduledDate(request.getScheduledDate())
                .scheduledTime(request.getScheduledTime())
                .durationMinutes(request.getDurationMinutes() != null ? request.getDurationMinutes() : 45)
                .interviewType(request.getInterviewType() != null ? request.getInterviewType() : "TECHNICAL_INTERVIEW")
                .meetingLink("https://meet.google.com/interview-" + UUID.randomUUID().toString().substring(0, 8))
                .status("CONFIRMED")
                .notes(request.getNotes())
                .build();

        userScheduledInterviews.computeIfAbsent(userId, k -> new ArrayList<>()).add(0, dto);
        return dto;
    }

    public void cancelInterview(Long userId, String interviewId) {
        List<ScheduledInterviewDto> list = userScheduledInterviews.get(userId);
        if (list != null) {
            list.stream()
                .filter(i -> i.getId().equals(interviewId))
                .findFirst()
                .ifPresent(i -> i.setStatus("CANCELLED"));
        }
    }
}
