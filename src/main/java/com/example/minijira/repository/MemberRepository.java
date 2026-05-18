package com.example.minijira.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.minijira.model.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {

    List<Member> findByProject_Id(Long projectId);

    void deleteByProject_Id(Long projectId);

}