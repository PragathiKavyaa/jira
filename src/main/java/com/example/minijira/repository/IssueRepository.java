package com.example.minijira.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.minijira.model.Issue;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    void deleteByProject_Id(Long projectId);

    List<Issue> findByProject_Id(Long projectId);

}