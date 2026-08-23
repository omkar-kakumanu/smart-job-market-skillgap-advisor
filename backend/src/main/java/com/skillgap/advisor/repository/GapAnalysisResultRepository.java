package com.skillgap.advisor.repository;

import com.skillgap.advisor.entity.GapAnalysisResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GapAnalysisResultRepository extends JpaRepository<GapAnalysisResult, Long> {
    List<GapAnalysisResult> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<GapAnalysisResult> findByUserId(Long userId, Pageable pageable);
}
