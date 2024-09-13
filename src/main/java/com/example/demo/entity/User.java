package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.sql.Blob;
import java.util.List;

@Entity
@Table(name = "USER_TB")
public class User {
    @Id
    @Column(name = "USER_ID")
    private String userId;

    @Column(name = "USER_NAME", nullable = false)
    private String userName;

    @Column(name = "USER_NICKNAME", unique = true, nullable = false)
    private String userNickname;

    @Column(name = "USER_PW", nullable = false)
    private String userPassword;

    @Lob
    @Column(name = "USER_IMAGE")
    private Blob userImage;

    @Column(name = "USER_LV")
    private Integer userLevel = 1;

    @JsonIgnore  // 이 필드를 직렬화할 때 무시
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Board> boards;

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserNickname() {
        return userNickname;
    }

    public void setUserNickname(String userNickname) {
        this.userNickname = userNickname;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }

    public Blob getUserImage() {
        return userImage;
    }

    public void setUserImage(Blob userImage) {
        this.userImage = userImage;
    }

    public Integer getUserLevel() {
        return userLevel;
    }

    public void setUserLevel(Integer userLevel) {
        this.userLevel = userLevel;
    }

    public List<Board> getBoards() {
        return boards;
    }

    public void setBoards(List<Board> boards) {
        this.boards = boards;
    }
}
