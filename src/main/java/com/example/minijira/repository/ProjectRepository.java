package com.example.minijira.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.minijira.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}