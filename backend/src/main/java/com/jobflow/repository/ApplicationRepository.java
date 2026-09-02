package com.jobflow.repository;

import com.jobflow.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidateIdOrderByAppliedAtDesc(Long candidateId);
    List<Application> findByJobIdOrderByAppliedAtDesc(Long jobId);
    Optional<Application> findByJobIdAndCandidateId(Long jobId, Long candidateId);
    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
}
