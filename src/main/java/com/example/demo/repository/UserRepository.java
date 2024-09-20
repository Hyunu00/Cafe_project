package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.User;

public interface UserRepository extends JpaRepository<User, String> {
    User findByUserNickname(String nickname);
    User findByUserNicknameAndUserId(String nickname, String userId);
}
