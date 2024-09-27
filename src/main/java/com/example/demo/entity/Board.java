package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "BOARD_TB")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "BOARD_SEQ")
    @SequenceGenerator(name = "BOARD_SEQ", sequenceName = "BOARD_SEQ", allocationSize = 1)
    @Column(name = "BOARD_NUMBER")
    private Long boardNumber;

    @Column(name = "BOARD_CATEGORY", nullable = false)
    private Integer boardCategory;

    @Column(name = "BOARD_TITLE", nullable = false)
    private String boardTitle;

    @Column(name = "BOARD_WRITE", nullable = false, length = 4000)
    private String boardWrite;

    @ManyToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID", nullable = false)
    private User user;

    @Column(name = "CRT_DT", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "CRT_USER", nullable = false)
    private String createdBy;

    @Column(name = "UDT_DT", nullable = false)
    private LocalDateTime updatedDate;

    @Column(name = "UDT_USER", nullable = false)
    private String updatedBy;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }


    public Long getBoardNumber() {
        return boardNumber;
    }

    public void setBoardNumber(Long boardNumber) {
        this.boardNumber = boardNumber;
    }

    public Integer getBoardCategory() {
        return boardCategory;
    }

    public void setBoardCategory(Integer boardCategory) {
        this.boardCategory = boardCategory;
    }

    public String getBoardTitle() {
        return boardTitle;
    }

    public void setBoardTitle(String boardTitle) {
        this.boardTitle = boardTitle;
    }

    public String getBoardWrite() {
        return boardWrite;
    }

    public void setBoardWrite(String boardWrite) {
        this.boardWrite = boardWrite;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
