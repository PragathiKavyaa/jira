package com.example.minijira.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.minijira.model.Notification;
import com.example.minijira.repository.NotificationRepository;

@Service
public class NotificationService {

        @Autowired
        private NotificationRepository repo;

        public List<Notification> getByEmail(String email) {

                List<Notification> notifications = repo.findByReceiverEmailAndIsReadFalse(email);

                // fallback old notifications
                if (notifications.isEmpty()) {
                        notifications = repo.findByEmailAndIsReadFalse(email);
                }

                return notifications;
        }

        public Notification save(Notification n) {
                return repo.save(n);
        }

        public void markAsRead(Long id) {
                Notification n = repo.findById(id).orElse(null);
                if (n != null) {
                        n.setRead(true);
                        repo.save(n);
                }
        }

        public List<Notification> getByReceiver(String email) {

                List<Notification> notifications = repo.findByReceiverEmailOrderByCreatedAtDesc(email);

                // fallback for old notifications
                if (notifications.isEmpty()) {
                        notifications = repo.findByEmail(email);
                }

                return notifications;
        }

        public void acceptNotification(Long id) {

                Notification current = repo.findById(id).orElse(null);

                if (current == null)
                        return;

                // CURRENT USER ACCEPTED
                current.setStatus("ACCEPTED");
                current.setRead(true);
                repo.save(current);

                // UPDATE ASSIGNER COPY
                List<Notification> assignerCopies = repo.findByRefIdAndType(
                                current.getRefId(),
                                current.getType());

                for (Notification n : assignerCopies) {

                        if (n.getReceiverEmail() != null
                                        && n.getReceiverEmail()
                                                        .equals(current.getSenderEmail())
                                        && n.getAssigneeEmail() != null
                                        && n.getAssigneeEmail()
                                                        .equals(current.getReceiverEmail())) {

                                n.setStatus("ACCEPTED");

                                n.setRead(false);

                                repo.save(n);
                        }
                }

                // RESPONSE NOTIFICATION
                Notification response = new Notification();

                response.setSenderEmail(
                                current.getReceiverEmail());

                response.setReceiverEmail(
                                current.getSenderEmail());

                response.setEmail(
                                current.getSenderEmail());

                response.setSenderName(current.getReceiverEmail());

                response.setMessage(
                                current.getReceiverEmail()
                                                + " accepted the issue");

                response.setProjectTitle(
                                current.getProjectTitle());

                response.setStage(
                                current.getStage());

                response.setType("RESPONSE");

                response.setRefId(
                                current.getRefId());

                response.setStatus("ACCEPTED");

                response.setRead(true);

                repo.save(response);
        }

        public void rejectNotification(Long id) {

                Notification current = repo.findById(id).orElse(null);

                if (current == null)
                        return;

                current.setStatus("REJECTED");
                current.setRead(true);
                repo.save(current);

                // UPDATE ASSIGNER COPY
                List<Notification> assignerCopies = repo.findByRefIdAndType(
                                current.getRefId(),
                                current.getType());

                for (Notification n : assignerCopies) {

                        if (n.getReceiverEmail() != null
                                        && n.getReceiverEmail()
                                                        .equals(current.getSenderEmail())
                                        && n.getAssigneeEmail() != null
                                        && n.getAssigneeEmail()
                                                        .equals(current.getReceiverEmail())) {

                                n.setStatus("REJECTED");

                                repo.save(n);
                        }
                }

                Notification response = new Notification();

                response.setSenderEmail(
                                current.getReceiverEmail());

                response.setReceiverEmail(
                                current.getSenderEmail());

                response.setEmail(
                                current.getSenderEmail());

                response.setSenderName(current.getReceiverEmail());

                response.setMessage(
                                current.getReceiverEmail()
                                                + " rejected the issue");

                response.setProjectTitle(
                                current.getProjectTitle());

                response.setStage(
                                current.getStage());

                response.setType("RESPONSE");

                response.setRefId(
                                current.getRefId());

                response.setStatus("REJECTED");

                response.setRead(false);

                repo.save(response);
        }

        public List<Notification> getUnreadByEmail(String email) {

                List<Notification> receiverNotifications = repo.findByReceiverEmailAndIsReadFalse(email);

                List<Notification> oldNotifications = repo.findByEmailAndIsReadFalse(email);

                receiverNotifications.addAll(oldNotifications);

                return receiverNotifications;
        }

        public List<Notification> getAllNotifications() {
                return repo.findAllByOrderByCreatedAtDesc();
        }
}