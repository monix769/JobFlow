package com.jobflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruiter_id", nullable = false)
    private User recruiter;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 150)
    private String company;

    private String companyLogo;
    private String department;

    @Column(nullable = false, length = 100)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private JobType jobType = JobType.FULL_TIME;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ExperienceLevel experienceLevel = ExperienceLevel.MID_LEVEL;

    @Column(nullable = false)
    private Integer salaryMin;

    @Column(nullable = false)
    private Integer salaryMax;

    @Column(length = 10)
    @Builder.Default
    private String currency = "USD";

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    private String tags;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private JobStatus status = JobStatus.ACTIVE;

    @Builder.Default
    private Integer applicantsCount = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum JobType {
        FULL_TIME,
        PART_TIME,
        REMOTE,
        CONTRACT,
        INTERNSHIP
    }

    public enum ExperienceLevel {
        ENTRY_LEVEL,
        MID_LEVEL,
        SENIOR_LEVEL,
        LEAD_EXECUTIVE
    }

    public enum JobStatus {
        ACTIVE,
        PAUSED,
        CLOSED
    }
}
