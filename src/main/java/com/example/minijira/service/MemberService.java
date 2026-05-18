package com.example.minijira.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.minijira.model.Member;
import com.example.minijira.repository.MemberRepository;

@Service
public class MemberService {

    @Autowired
    private MemberRepository repo;

    public List<Member> getAll() {
        return repo.findAll();
    }

    public Member save(Member m) {
        return repo.save(m);
    }

    // public List<Member> getByProjectId(Long projectId) {
    // return repo.findAll()
    // .stream()
    // .filter(m -> m.getProject().getId().equals(projectId))
    // .toList();
    // }

    // ✅ GET MEMBERS BY PROJECT ID
    public List<Member> getMembersByProject(Long projectId) {
        return repo.findByProject_Id(projectId);
    }
}