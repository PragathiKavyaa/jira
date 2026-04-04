package com.example.minijira.controller;

import com.example.minijira.model.Issue;
import com.example.minijira.service.IssueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    // CREATE ISSUE
    @PostMapping("/{projectId}")
    public Issue createIssue(@PathVariable Long projectId,
            @RequestBody Issue issue) {

        return issueService.saveIssue(projectId, issue);
    }

    // GET ISSUES BY PROJECT
    @GetMapping("/project/{projectId}")
    public List<Issue> getIssuesByProject(@PathVariable Long projectId) {

        return issueService.getIssuesByProject(projectId);
    }
}