package com.example.minijira.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.minijira.dto.ProjectDTO;
import com.example.minijira.model.Project;
import com.example.minijira.service.ProjectService;

@RestController
@CrossOrigin
@RequestMapping("/projects")
public class ProjectController {

    @Autowired
    private ProjectService service;

    @GetMapping
    public List<Project> getProjects() {
        return service.getAllProjects();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProjectById(
            @PathVariable Long id) {

        Project project = service.getById(id);

        if (project == null) {

            return ResponseEntity
                    .status(404)
                    .body("Project not found");
        }

        return ResponseEntity.ok(project);
    }

    // ✅ ADMIN ONLY
    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody ProjectDTO dto,
            @RequestHeader("role") String role) {

        if (!(role.equals("ADMIN") || role.equals("MANAGER") || role.equals("PROJECT_LEAD"))) {
            return ResponseEntity.status(403).body("Access Denied");
        }
        System.out.println("TEAM FROM DTO = " + dto.getTeam());

        return ResponseEntity.ok(service.saveProjectWithMembers(dto));
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id,
            @RequestHeader("role") String role) {

        // 🔐 RULE 1 again
        if (!(role.equals("ADMIN") || role.equals("MANAGER") || role.equals("PROJECT_LEAD"))) {
            throw new RuntimeException("Access Denied: Cannot delete project");
        }

        service.deleteById(id);
    }

    @PutMapping("/{id}/status")
    public Project updateProjectStatus(@PathVariable Long id,
            @RequestParam String status) {

        Project project = service.getById(id);

        if (project != null) {
            project.setStatus(status);
            return service.saveProject(project);
        }

        return null;
    }

    @PutMapping("/{id}/stage")
    public Project updateStage(@PathVariable Long id,
            @RequestParam String stage) {

        Project project = service.getById(id);

        if (project != null) {
            project.setStage(stage);
            return service.saveProject(project);
        }

        return null;
    }

}