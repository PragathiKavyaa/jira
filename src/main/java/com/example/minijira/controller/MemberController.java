package com.example.minijira.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.minijira.model.Member;
import com.example.minijira.service.MemberService;

@RestController
@CrossOrigin
@RequestMapping("/members")
public class MemberController {

    @Autowired
    private MemberService service;

    @GetMapping
    public List<Member> getAllMembers() {
        return service.getAll();
    }

    @GetMapping("/project/{projectId}")
    public List<Member> getByProject(@PathVariable Long projectId) {
        return service.getMembersByProject(projectId);
    }

    @PostMapping
    public Member createMember(@RequestBody Member m) {
        return service.save(m);
    }

    @GetMapping("/project/{projectId}/all")
    public List<Member> getMembersByProject(@PathVariable Long projectId) {
        return service.getMembersByProject(projectId);
    }

}