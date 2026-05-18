package com.example.minijira.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.minijira.model.SubTask;
import com.example.minijira.service.SubTaskService;

@RestController
@RequestMapping("/subtasks")
@CrossOrigin
public class SubTaskController {

    @Autowired
    private SubTaskService service;

    @PostMapping
    public SubTask addSubTask(@RequestBody SubTask subtask) {
        return service.save(subtask);
    }

    @GetMapping("/project/{projectId}")
    public List<SubTask> getSubTasks(@PathVariable Long projectId) {
        return service.getByProject(projectId);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/{id}/complete")
    public SubTask completeTask(@PathVariable Long id) {
        return service.completeTask(id);
    }

}