package com.skillgap.advisor.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "gap_analysis_results")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GapAnalysisResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String targetJobTitle;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal matchPercentage;

    @Column(nullable = false)
    private Integer matchedSkillsCount;

    @Column(nullable = false)
    private Integer missingSkillsCount;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String missingSkillsJson;

    @Column(columnDefinition = "LONGTEXT")
    private String recommendationsJson;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
