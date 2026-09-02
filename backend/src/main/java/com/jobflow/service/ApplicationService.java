package com.jobflow.service;

import com.jobflow.entity.Application;
import com.jobflow.entity.Job;
import com.jobflow.entity.User;
import com.jobflow.repository.ApplicationRepository;
import com.jobflow.repository.JobRepository;
import com.jobflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @Transactional
    public Application applyForJob(Long candidateId, Long jobId, Application application) {
        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidateId)) {
            throw new RuntimeException("You have already applied for this job position.");
        }

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        application.setCandidate(candidate);
        application.setJob(job);
        application.setStatus(Application.ApplicationStatus.APPLIED);

        // Increment applicant count on Job
        job.setApplicantsCount((job.getApplicantsCount() == null ? 0 : job.getApplicantsCount()) + 1);
        jobRepository.save(job);

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByCandidate(Long candidateId) {
        return applicationRepository.findByCandidateIdOrderByAppliedAtDesc(candidateId);
    }

    public List<Application> getApplicationsForJob(Long jobId) {
        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
    }

    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }

    public Application updateApplicationStatus(Long id, Application.ApplicationStatus status, String notes, Integer rating) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (status != null) {
            application.setStatus(status);
        }
        if (notes != null) {
            application.setRecruiterNotes(notes);
        }
        if (rating != null) {
            application.setRating(rating);
        }

        return applicationRepository.save(application);
    }
}
