package com.skillgap.advisor.repository;

import com.skillgap.advisor.entity.JobPosting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    Page<JobPosting> findByIsActiveTrue(Pageable pageable);
    
    @Query("SELECT j FROM JobPosting j WHERE j.isActive = true AND " +
           "(LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.company) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<JobPosting> searchJobs(@Param("search") String search, Pageable pageable);

    List<JobPosting> findByExperienceLevel(String experienceLevel);
}
