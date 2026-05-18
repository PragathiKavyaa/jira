package com.example.minijira.model;

import jakarta.persistence.*;

@Entity
public class SubTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private Long projectId;

    private String status;

    // Default constructor (Required by JPA)
    public SubTask() {
    }

    // Parameterized constructor
    public SubTask(String title, Long projectId) {
        this.title = title;
        this.projectId = projectId;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getStatus() {
        return status;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}