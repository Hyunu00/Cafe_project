package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "USER_TB")
public class User {

    @Id
    @Column(name = "USER_ID", nullable = false)
    private String userId;

    @Column(name = "USER_NAME", nullable = false)
    private String userName;

    @Column(name = "USER_NICKNAME", nullable = false, unique = true)
    private String userNickname;

    @Column(name = "USER_PW", nullable = false)
    private String userPassword;

    @Lob
    @Column(name = "USER_IMAGE")
    private byte[] userImage;

    @Column(name = "USER_LV", nullable = false, columnDefinition = "NUMBER DEFAULT 1")
    private Integer userLevel;

    @Column(name = "CRT_DT", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "CRT_USER", nullable = false)
    private String createdBy;

    @Column(name = "UDT_DT", nullable = false)
    private LocalDateTime updatedDate;

    @Column(name = "UDT_USER", nullable = false)
    private String updatedBy;

    // 레코드가 생성될 때 자동으로 설정
    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.createdBy = "System"; // 실제 사용자 정보로 변경 가능
    }

    // 레코드가 수정될 때 자동으로 설정
    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
        this.updatedBy = "System"; // 실제 사용자 정보로 변경 가능
    }

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

    public byte[] getUserImage() {
        return userImage;
    }

    public void setUserImage(byte[] userImage) {
        this.userImage = userImage;
    }

    public Integer getUserLevel() {
        return userLevel;
    }

    public void setUserLevel(Integer userLevel) {
        this.userLevel = userLevel;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}
