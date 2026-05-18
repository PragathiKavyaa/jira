package com.example.minijira.dto;

import java.util.List;

public class ProjectRequest {

    private String name;
    private String description;
    private String projectLead;
    private String status;

    private List<ProjectMemberDTO> members;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProjectLead() {
        return projectLead;
    }

    public void setProjectLead(String projectLead) {
        this.projectLead = projectLead;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<ProjectMemberDTO> getMembers() {
        return members;
    }

    public void setMembers(List<ProjectMemberDTO> members) {
        this.members = members;
    }

    // getters & setters

}
