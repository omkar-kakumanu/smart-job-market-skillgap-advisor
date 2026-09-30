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
public class ResumeParseResponse {
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String currentRole;
    private Double totalExperienceYears;
    private String degree;
    private String institution;
    private List<String> extractedSkills;
    private String headline;
    private Integer parsingAccuracy;
}
