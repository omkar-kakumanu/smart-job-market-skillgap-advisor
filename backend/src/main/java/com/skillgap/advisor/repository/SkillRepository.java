package com.skillgap.advisor.repository;

import com.skillgap.advisor.entity.Skill;
import com.skillgap.advisor.entity.SkillCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByNameIgnoreCase(String name);
    List<Skill> findByCategory(SkillCategory category);
    Page<Skill> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Skill> findTop10ByOrderByMarketDemandScoreDesc();
}
