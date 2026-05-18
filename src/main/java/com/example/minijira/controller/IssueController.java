package com.example.minijira.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.minijira.model.Issue;
import com.example.minijira.service.IssueService;

@RestController
@CrossOrigin
@RequestMapping("/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    // ✅ ADMIN ONLY
    @PostMapping("/{projectId}")
    public ResponseEntity<?> createIssue(@PathVariable Long projectId,
            @RequestBody Issue issue,
            @RequestHeader(value = "role", required = false) String role) {

        if (role == null ||
                !(role.equals("ADMIN") || role.equals("MANAGER") ||
                        role.equals("PROJECT_LEAD") || role.equals("USER"))) {

            throw new RuntimeException("Invalid role");
        }

        issueService.saveIssue(projectId, issue);

        return ResponseEntity.ok("Issue Created Successfully");
    }

    // GET ISSUES BY PROJECT
    @GetMapping("/project/{projectId}")
    public List<Issue> getIssuesByProject(@PathVariable Long projectId) {
        return issueService.getIssuesByProject(projectId);
    }

    // BOTH USER + ADMIN
    @PutMapping("/{id}/status")
    public Issue updateStatus(@PathVariable Long id,
            @RequestParam String status) {
        return issueService.updateStatus(id, status);
    }

    @GetMapping
    public List<Issue> getAllIssues() {
        return issueService.getAll();
    }

    @PutMapping("/{id}/dates")
    public ResponseEntity<?> updateDates(@PathVariable Long id,
            @RequestBody Map<String, String> body) {

        try {
            String startDate = body.get("startDate");
            String endDate = body.get("endDate");

            issueService.updateDates(id, startDate, endDate);

            return ResponseEntity.ok("Updated");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}