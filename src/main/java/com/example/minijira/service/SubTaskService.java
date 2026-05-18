package com.example.minijira.service;

import java.util.List;

import com.example.minijira.model.SubTask;

public interface SubTaskService {

    SubTask save(SubTask subTask);

    List<SubTask> getByProject(Long projectId);

    void delete(Long id);

    SubTask completeTask(Long id);

}