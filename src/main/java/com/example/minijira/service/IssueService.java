package com.example.minijira.service;

import com.example.minijira.model.Issue;
import com.example.minijira.model.Project;
import com.example.minijira.repository.IssueRepository;
import com.example.minijira.repository.ProjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepo;

    @Autowired
    private ProjectRepository projectRepo;

    public Issue saveIssue(Long projectId, Issue issue) {

        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        issue.setProject(project);

        return issueRepo.save(issue);
    }

    public List<Issue> getIssuesByProject(Long projectId) {
        return issueRepo.findByProjectId(projectId);
    }

    public List<Issue> getAll() {
        return issueRepo.findAll();
    }

    public void delete(Long id) {
        issueRepo.deleteById(id);
    }
}
