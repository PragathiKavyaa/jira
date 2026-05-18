package com.example.minijira.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.minijira.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 🔥 get notifications for logged-in user
    List<Notification> findByEmailAndIsReadFalse(String email);

    List<Notification> findByEmail(String email);

    void deleteByEmail(String email);

    List<Notification> findByReceiverEmailOrderByCreatedAtDesc(String receiverEmail);

    List<Notification> findByReceiverEmailAndIsReadFalse(String receiverEmail);

    List<Notification> findByRefId(Long refId);

    List<Notification> findByRefIdAndType(Long refId, String type);

    List<Notification> findByRefIdAndTypeAndReceiverEmail(
            Long refId,
            String type,
            String receiverEmail);

    // ✅ ADMIN / MANAGER ALL NOTIFICATIONS
    List<Notification> findAllByOrderByCreatedAtDesc();

}