package com.example.minijira.dto;

import java.util.List;

public class ProjectDTO {

    private String name;
    private String projectLead;
    private String status;
    private String stage;
    private String description;
    private String senderEmail;
    private String team;

    private List<ProjectMemberDTO> members;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<ProjectMemberDTO> getMembers() {
        return members;
    }

    public void setMembers(List<ProjectMemberDTO> members) {
        this.members = members;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    // getters & setters

}