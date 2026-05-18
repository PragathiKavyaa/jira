package com.example.minijira.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.minijira.model.Notification;
import com.example.minijira.service.NotificationService;

@RestController
@CrossOrigin
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService service;

    // ✅ Admin / Manager Notifications
    @GetMapping("/all")
    public List<Notification> getAllNotifications() {
        return service.getAllNotifications();
    }

    // ✅ Get notifications for logged-in user
    @GetMapping("/{email}")
    public List<Notification> getByEmail(@PathVariable String email) {
        return service.getUnreadByEmail(email);
    }

    // ✅ Mark notification as read
    @PutMapping("/read/{id}")
    public void markAsRead(@PathVariable Long id) {
        service.markAsRead(id);
    }

    @GetMapping("/user/{email}")
    public List<Notification> getUserNotifications(
            @PathVariable String email) {

        return service.getByReceiver(email);
    }

    @PutMapping("/accept/{id}")
    public void accept(@PathVariable Long id) {
        service.acceptNotification(id);
    }

    @PutMapping("/reject/{id}")
    public void reject(@PathVariable Long id) {
        service.rejectNotification(id);
    }

}