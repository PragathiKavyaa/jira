package com.example.minijira.controller;

import com.example.minijira.model.Role;
import com.example.minijira.model.User;
import com.example.minijira.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")

public class UserController {

    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody User user) {

        if (user.getRole() == null) {
            user.setRole(Role.USER);
        } else {
            user.setRole(Role.valueOf(user.getRole().name().toUpperCase()));
        }

        return repository.save(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        try {

            System.out.println("Received Email: [" + user.getEmail() + "]");
            System.out.println("Received Password: [" + user.getPassword() + "]");

            User existing = repository.findByEmail(user.getEmail());

            // check user exists first
            if (existing == null) {
                return ResponseEntity
                        .status(401)
                        .body("User not found");
            }

            System.out.println("User Role: " + existing.getRole());

            if (existing.getPassword().equals(user.getPassword())) {
                return ResponseEntity.ok(existing);
            }

            return ResponseEntity
                    .status(401)
                    .body("Invalid Credentials");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body("Server Error: " + e.getMessage());
        }
    }
}