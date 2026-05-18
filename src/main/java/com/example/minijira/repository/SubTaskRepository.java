package com.example.minijira.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.minijira.model.SubTask;

public interface SubTaskRepository extends JpaRepository<SubTask, Long> {

    List<SubTask> findByProjectId(Long projectId);

}