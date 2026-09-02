package com.jobflow.service;

import com.jobflow.entity.Job;
import com.jobflow.entity.User;
import com.jobflow.repository.JobRepository;
import com.jobflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public List<Job> getAllActiveJobs() {
        return jobRepository.findByStatusOrderByCreatedAtDesc(Job.JobStatus.ACTIVE);
    }

    public List<Job> searchJobs(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllActiveJobs();
        }
        return jobRepository.searchActiveJobs(query.trim());
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public List<Job> getJobsByRecruiter(Long recruiterId) {
        return jobRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiterId);
    }

    public Job createJob(Long recruiterId, Job job) {
        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        job.setRecruiter(recruiter);
        if (job.getCompany() == null || job.getCompany().isEmpty()) {
            job.setCompany(recruiter.getCompanyName() != null ? recruiter.getCompanyName() : "Tech Company");
        }
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job updatedDetails) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (updatedDetails.getTitle() != null) job.setTitle(updatedDetails.getTitle());
        if (updatedDetails.getLocation() != null) job.setLocation(updatedDetails.getLocation());
        if (updatedDetails.getJobType() != null) job.setJobType(updatedDetails.getJobType());
        if (updatedDetails.getExperienceLevel() != null) job.setExperienceLevel(updatedDetails.getExperienceLevel());
        if (updatedDetails.getSalaryMin() != null) job.setSalaryMin(updatedDetails.getSalaryMin());
        if (updatedDetails.getSalaryMax() != null) job.setSalaryMax(updatedDetails.getSalaryMax());
        if (updatedDetails.getDescription() != null) job.setDescription(updatedDetails.getDescription());
        if (updatedDetails.getRequirements() != null) job.setRequirements(updatedDetails.getRequirements());
        if (updatedDetails.getBenefits() != null) job.setBenefits(updatedDetails.getBenefits());
        if (updatedDetails.getTags() != null) job.setTags(updatedDetails.getTags());
        if (updatedDetails.getStatus() != null) job.setStatus(updatedDetails.getStatus());

        return jobRepository.save(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}
