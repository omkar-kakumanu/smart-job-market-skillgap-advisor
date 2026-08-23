package com.skillgap.advisor.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 100)
    private String provider;

    @Column(nullable = false, length = 500)
    private String courseUrl;

    private Integer durationHours;

    @Column(length = 30)
    private String difficulty;

    @Column(length = 20)
    private String costType;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "primary_skill_id", nullable = false)
    private Skill primarySkill;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
