package com.example.minijira.service;

import com.example.minijira.model.Issue;
import com.example.minijira.model.Notification;
import com.example.minijira.model.Project;
import com.example.minijira.repository.IssueRepository;
import com.example.minijira.repository.NotificationRepository;
import com.example.minijira.repository.ProjectRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class IssueService {

        @Autowired
        private IssueRepository issueRepo;

        @Autowired
        private NotificationRepository notificationRepository;

        @Autowired
        private ProjectRepository projectRepo;

        public Issue saveIssue(Long projectId, Issue issue) {

                Project project = projectRepo.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                issue.setProject(project);

                Issue saved = issueRepo.save(issue);

                // 🔔 CREATE NOTIFICATION FOR ASSIGNEE
                if (saved.getAssigneeEmail() != null) {

                        // =====================================
                        // ASSIGNEE NOTIFICATION
                        // =====================================

                        Notification assigneeNotification = new Notification();

                        assigneeNotification.setSenderEmail(
                                        saved.getAssignerEmail());

                        assigneeNotification.setReceiverEmail(
                                        saved.getAssigneeEmail());

                        assigneeNotification.setAssigneeEmail(
                                        saved.getAssigneeEmail());

                        assigneeNotification.setEmail(
                                        saved.getAssigneeEmail());

                        assigneeNotification.setSenderName(
                                        saved.getAssigner());

                        assigneeNotification.setProjectTitle(
                                        project.getName());

                        assigneeNotification.setStage(
                                        project.getStage());

                        assigneeNotification.setMessage(
                                        "New issue assigned: "
                                                        + saved.getTitle());

                        assigneeNotification.setType("ISSUE");

                        assigneeNotification.setRefId(
                                        project.getId());

                        assigneeNotification.setStatus(
                                        "PENDING");

                        assigneeNotification.setRead(false);

                        notificationRepository.save(
                                        assigneeNotification);

                        // =====================================
                        // ASSIGNER COPY
                        // =====================================

                        Notification assignerCopy = new Notification();

                        assignerCopy.setSenderEmail(
                                        saved.getAssignerEmail());

                        assignerCopy.setReceiverEmail(
                                        saved.getAssignerEmail());

                        assignerCopy.setAssigneeEmail(
                                        saved.getAssigneeEmail());

                        assignerCopy.setEmail(
                                        saved.getAssignerEmail());

                        assignerCopy.setSenderName(
                                        saved.getAssigner());

                        assignerCopy.setProjectTitle(
                                        project.getName());

                        assignerCopy.setStage(
                                        project.getStage());

                        assignerCopy.setMessage(
                                        "Issue assigned to "
                                                        + saved.getAssignee()
                                                        + " (" + saved.getAssigneeEmail() + ")");

                        assignerCopy.setType("ISSUE");

                        assignerCopy.setRefId(
                                        project.getId());

                        assignerCopy.setStatus(
                                        "PENDING");

                        assignerCopy.setRead(false);

                        notificationRepository.save(
                                        assignerCopy);
                }

                return saved;
        }

        public List<Issue> getIssuesByProject(Long projectId) {
                return issueRepo.findByProject_Id(projectId);
        }

        public List<Issue> getAll() {
                return issueRepo.findAll();
        }

        public void delete(Long id) {
                issueRepo.deleteById(id);
        }

        public Issue updateStatus(Long id, String status) {

                Issue issue = issueRepo.findById(id).orElseThrow();

                issue.setStatus(status);

                Issue updatedIssue = issueRepo.save(issue);

                // ✅ SEND COMPLETION NOTIFICATION
                if ("DONE".equalsIgnoreCase(status)
                                || "COMPLETED".equalsIgnoreCase(status)) {

                        // =====================================
                        // NOTIFY ASSIGNER / PROJECT LEAD
                        // =====================================

                        Notification notification = new Notification();

                        notification.setProjectTitle(
                                        updatedIssue.getProject().getName());

                        notification.setMessage(
                                        "Issue completed: "
                                                        + updatedIssue.getTitle());

                        notification.setSenderName(
                                        updatedIssue.getAssignee());

                        notification.setSenderEmail(
                                        updatedIssue.getAssigneeEmail());

                        // ✅ send to assigner/project lead
                        notification.setReceiverEmail(
                                        updatedIssue.getAssignerEmail());

                        notification.setEmail(
                                        updatedIssue.getAssignerEmail());

                        notification.setAssigneeEmail(
                                        updatedIssue.getAssigneeEmail());

                        notification.setStage(
                                        updatedIssue.getProject().getStage());

                        notification.setStatus(
                                        "COMPLETED");

                        notification.setType(
                                        "ISSUE");

                        notification.setRefId(
                                        updatedIssue.getId());

                        notification.setRead(false);

                        notificationRepository.save(notification);
                }

                return updatedIssue;
        }

        public Issue updateIssueDates(Long id, String startDate, String endDate) {

                Issue issue = issueRepo.findById(id)
                                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));

                issue.setStartDate(LocalDate.parse(startDate));
                issue.setEndDate(LocalDate.parse(endDate));

                return issueRepo.save(issue);
        }

        public void updateDates(Long id, String startDate, String endDate) {

                Issue issue = issueRepo.findById(id)
                                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));

                // Convert String → LocalDate
                LocalDate start = LocalDate.parse(startDate);
                LocalDate end = LocalDate.parse(endDate);

                // Optional validation (recommended)
                if (end.isBefore(start)) {
                        throw new RuntimeException("End date cannot be before start date");
                }

                issue.setStartDate(start);
                issue.setEndDate(end);

                issueRepo.save(issue);
        }
}
