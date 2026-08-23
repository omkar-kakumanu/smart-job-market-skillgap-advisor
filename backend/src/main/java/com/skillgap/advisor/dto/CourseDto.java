package com.skillgap.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private Long id;
    private String title;
    private String provider;
    private String courseUrl;
    private Integer durationHours;
    private String difficulty;
    private String costType;
    private BigDecimal rating;
    private Long primarySkillId;
    private String primarySkillName;
}
