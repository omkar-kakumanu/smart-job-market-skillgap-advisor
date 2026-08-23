package com.skillgap.advisor.repository;

import com.skillgap.advisor.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByPrimarySkillId(Long primarySkillId);
    List<Course> findByPrimarySkillIdIn(List<Long> skillIds);
}
