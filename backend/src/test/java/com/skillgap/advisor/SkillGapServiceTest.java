package com.skillgap.advisor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skillgap.advisor.dto.GapAnalysisRequest;
import com.skillgap.advisor.dto.GapAnalysisResultDto;
import com.skillgap.advisor.entity.*;
import com.skillgap.advisor.repository.*;
import com.skillgap.advisor.service.CourseService;
import com.skillgap.advisor.service.SkillGapService;
import com.skillgap.advisor.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SkillGapServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JobPostingRepository jobPostingRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private GapAnalysisResultRepository gapAnalysisResultRepository;

    @Mock
    private UserService userService;

    @Mock
    private CourseService courseService;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private SkillGapService skillGapService;

    private User sampleUser;
    private JobPosting sampleJob;
    private Skill sampleSkill;

    @BeforeEach
    void setUp() {
        sampleSkill = Skill.builder().id(1L).name("Java 21").category(SkillCategory.TECHNICAL).build();
        sampleUser = User.builder().id(1L).fullName("Jane Candidate").userSkills(new ArrayList<>()).build();

        JobSkill js = JobSkill.builder().id(10L).skill(sampleSkill).importanceWeight(10).isRequired(true).build();
        List<JobSkill> required = new ArrayList<>();
        required.add(js);

        sampleJob = JobPosting.builder()
                .id(5L)
                .title("Full Stack Java Developer")
                .jobSkills(required)
                .build();
    }

    @Test
    void performSkillGapAnalysis_ShouldCalculateMatch() {
        GapAnalysisRequest req = new GapAnalysisRequest();
        req.setJobPostingId(5L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(jobPostingRepository.findById(5L)).thenReturn(Optional.of(sampleJob));
        when(gapAnalysisResultRepository.save(any(GapAnalysisResult.class))).thenAnswer(i -> {
            GapAnalysisResult g = i.getArgument(0);
            g.setId(100L);
            return g;
        });

        GapAnalysisResultDto res = skillGapService.performSkillGapAnalysis(1L, req);

        assertNotNull(res);
        assertEquals("Full Stack Java Developer", res.getTargetJobTitle());
        assertEquals(1, res.getMissingSkillsCount());
    }
}
