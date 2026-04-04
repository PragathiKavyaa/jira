package com.example.minijira.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.minijira.model.Project;
import com.example.minijira.repository.ProjectRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository repo;

    public List<Project> getAllProjects() {
        return repo.findAll();
    }

    public Project saveProject(Project project) {
        return repo.save(project);
    }

    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}