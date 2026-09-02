package com.jobflow.repository;

import com.jobflow.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiterIdOrderByCreatedAtDesc(Long recruiterId);
    List<Job> findByStatusOrderByCreatedAtDesc(Job.JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND (" +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.company) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(j.tags) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Job> searchActiveJobs(@Param("query") String query);
}
