package com.example.minijira.service;

import com.example.minijira.repository.IssueRepository;
import com.example.minijira.repository.MemberRepository;
import com.example.minijira.repository.NotificationRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.minijira.dto.ProjectDTO;
import com.example.minijira.dto.ProjectMemberDTO;
import com.example.minijira.model.Member;
import com.example.minijira.model.Notification;
import com.example.minijira.model.Project;
import com.example.minijira.repository.ProjectRepository;

@Service
public class ProjectService {

        private final NotificationRepository notificationRepository;
        private final MemberRepository memberRepository;

        @Autowired
        private ProjectRepository repo;

        @Autowired
        private IssueRepository issueRepository;

        ProjectService(
                        MemberRepository memberRepository,
                        NotificationRepository notificationRepository) {

                this.memberRepository = memberRepository;
                this.notificationRepository = notificationRepository;
        }

        public List<Project> getAllProjects() {

                List<Project> list = repo.findAll();

                System.out.println("PROJECTS FROM DB: " + list.size());

                return list;
        }

        public Project getById(Long id) {
                return repo.findById(id).orElse(null);
        }

        public Project saveProjectWithMembers(ProjectDTO dto) {

                // =========================================
                // SAVE PROJECT
                // =========================================

                Project project = new Project();

                project.setName(dto.getName());

                project.setProjectLead(dto.getProjectLead());

                project.setStatus(dto.getStatus());

                project.setStage(dto.getStage());

                project.setDescription(dto.getDescription());

                project.setTeam(dto.getTeam());

                Project savedProject = repo.save(project);

                // =========================================
                // SAVE MEMBERS + NOTIFICATIONS
                // =========================================

                if (dto.getMembers() != null) {

                        for (ProjectMemberDTO m : dto.getMembers()) {

                                // SAVE MEMBER
                                Member member = new Member();

                                member.setUsername(m.getUsername());

                                member.setEmail(m.getEmail());

                                member.setRole(m.getRole());

                                member.setProject(savedProject);

                                memberRepository.save(member);

                                // =====================================
                                // ASSIGNEE NOTIFICATION
                                // =====================================

                                Notification assigneeNotification = new Notification();

                                assigneeNotification.setSenderName(
                                                savedProject.getProjectLead());

                                assigneeNotification.setSenderEmail(
                                                dto.getSenderEmail());

                                assigneeNotification.setReceiverEmail(
                                                m.getEmail());

                                assigneeNotification.setAssigneeEmail(
                                                m.getEmail());

                                assigneeNotification.setEmail(
                                                m.getEmail());

                                assigneeNotification.setProjectTitle(
                                                savedProject.getName());

                                assigneeNotification.setMessage(
                                                "You are assigned to project: "
                                                                + savedProject.getName());

                                assigneeNotification.setStage(
                                                savedProject.getStage());

                                assigneeNotification.setType(
                                                "PROJECT");

                                assigneeNotification.setRefId(
                                                savedProject.getId());

                                assigneeNotification.setStatus(
                                                "PENDING");

                                assigneeNotification.setRead(false);

                                notificationRepository.save(
                                                assigneeNotification);

                                // =====================================
                                // ASSIGNER COPY NOTIFICATION
                                // =====================================

                                Notification assignerCopy = new Notification();

                                assignerCopy.setSenderName(
                                                savedProject.getProjectLead());

                                assignerCopy.setSenderEmail(
                                                dto.getSenderEmail());

                                assignerCopy.setReceiverEmail(
                                                dto.getSenderEmail());

                                assignerCopy.setAssigneeEmail(
                                                m.getEmail());

                                assignerCopy.setEmail(
                                                dto.getSenderEmail());

                                assignerCopy.setProjectTitle(
                                                savedProject.getName());

                                assignerCopy.setMessage(
                                                "Project assigned to "
                                                                + m.getUsername());

                                assignerCopy.setStage(
                                                savedProject.getStage());

                                assignerCopy.setType(
                                                "PROJECT");

                                assignerCopy.setRefId(
                                                savedProject.getId());

                                assignerCopy.setStatus(
                                                "PENDING");

                                assignerCopy.setRead(false);

                                notificationRepository.save(
                                                assignerCopy);
                        }
                }

                return savedProject;
        }

        // =========================================
        // UPDATE PROJECT
        // =========================================

        public Project saveProject(Project project) {

                Project updatedProject = repo.save(project);

                // ✅ send notification when project completed
                if ("COMPLETED".equalsIgnoreCase(updatedProject.getStatus())) {

                        // =====================================
                        // GET PROJECT MEMBERS
                        // =====================================

                        List<Member> members = memberRepository.findByProject_Id(updatedProject.getId());

                        for (Member m : members) {

                                // ✅ notify only ADMIN / MANAGER / PROJECT LEAD
                                if ("Manager".equalsIgnoreCase(m.getRole())
                                                || m.getUsername().equalsIgnoreCase(
                                                                updatedProject.getProjectLead())) {

                                        Notification notification = new Notification();

                                        notification.setProjectTitle(
                                                        updatedProject.getName());

                                        notification.setMessage(
                                                        "Project completed: "
                                                                        + updatedProject.getName());

                                        notification.setSenderName(
                                                        updatedProject.getProjectLead());

                                        notification.setSenderEmail(
                                                        m.getEmail());

                                        notification.setReceiverEmail(
                                                        m.getEmail());

                                        notification.setEmail(
                                                        m.getEmail());

                                        notification.setStage(
                                                        updatedProject.getStage());

                                        notification.setStatus(
                                                        "COMPLETED");

                                        notification.setType(
                                                        "PROJECT");

                                        notification.setRefId(
                                                        updatedProject.getId());

                                        notification.setRead(false);

                                        notificationRepository.save(notification);
                                }
                        }
                }

                return updatedProject;
        }

        // =========================================
        // DELETE PROJECT
        // =========================================

        @Transactional
        public void deleteById(Long id) {

                List<Member> members = memberRepository.findByProject_Id(id);

                for (Member m : members) {

                        notificationRepository.deleteByEmail(
                                        m.getEmail());
                }

                memberRepository.deleteByProject_Id(id);

                issueRepository.deleteByProject_Id(id);

                repo.deleteById(id);
        }
}