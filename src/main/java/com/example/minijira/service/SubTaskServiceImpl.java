package com.example.minijira.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.minijira.model.SubTask;
import com.example.minijira.repository.SubTaskRepository;

@Service
public class SubTaskServiceImpl implements SubTaskService {

    @Autowired
    private SubTaskRepository repository;

    @Override
    public SubTask save(SubTask subTask) {

        subTask.setStatus("TODO");

        return repository.save(subTask);
    }

    @Override
    public List<SubTask> getByProject(Long projectId) {
        return repository.findByProjectId(projectId);
    }

    @Override
    public void delete(Long id) {
        // TODO Auto-generated method stub
        repository.deleteById(id);
    }

    @Override
    public SubTask completeTask(Long id) {
        // TODO Auto-generated method stub
        SubTask task = repository.findById(id).orElse(null);

        if (task != null) {
            task.setStatus("DONE");
            return repository.save(task);
        }

        return null;
    }
}