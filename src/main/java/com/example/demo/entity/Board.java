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

    // VARCHAR2(4000)으로 설정된 필드
    @Column(name = "BOARD_WRITE", nullable = false, length = 4000)
    private String boardWrite;

    @Column(name = "BOARD_DATE")
    private LocalDateTime boardDate;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private User user;

    // 자동으로 게시글 작성 시간을 현재 시간으로 설정
    @PrePersist
    protected void onCreate() {
        this.boardDate = LocalDateTime.now();
    }

    // Getters and Setters
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

    public LocalDateTime getBoardDate() {
        return boardDate;
    }

    public void setBoardDate(LocalDateTime boardDate) {
        this.boardDate = boardDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
