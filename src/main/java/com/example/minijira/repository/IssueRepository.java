package com.example.minijira.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.minijira.model.Issue;

public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByProjectId(Long projectId);

}