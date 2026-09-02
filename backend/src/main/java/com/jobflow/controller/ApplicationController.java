package com.jobflow.controller;

import com.jobflow.entity.Application;
import com.jobflow.service.ApplicationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/apply/candidate/{candidateId}/job/{jobId}")
    public ResponseEntity<?> apply(
            @PathVariable Long candidateId,
            @PathVariable Long jobId,
            @RequestBody Application application) {
        try {
            Application created = applicationService.applyForJob(candidateId, jobId, application);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<Application>> getCandidateApplications(@PathVariable Long candidateId) {
        return ResponseEntity.ok(applicationService.getApplicationsByCandidate(candidateId));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {
        try {
            Application updated = applicationService.updateApplicationStatus(
                    id,
                    request.getStatus(),
                    request.getRecruiterNotes(),
                    request.getRating()
            );
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @Data
    public static class UpdateStatusRequest {
        private Application.ApplicationStatus status;
        private String recruiterNotes;
        private Integer rating;
    }
}
