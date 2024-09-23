package com.example.demo.service;

import com.example.demo.entity.User; 
import org.springframework.stereotype.Service;
import com.example.demo.entity.Board;
import com.example.demo.repository.BoardRepository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BoardService {

    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    // 모든 게시글 리스트 반환
    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    // 특정 사용자의 게시글 개수 반환
    public int getPostCountByUserId(String userId) {
        return boardRepository.countPostsByUserId(userId);
    }

    // 특정 사용자의 게시글 리스트 반환
    public List<Board> getPostsByUserId(String userId) {
        return boardRepository.findByUserUserId(userId);
    }

    // 게시글 저장
    @Transactional
    public Board saveBoard(Board board, String loggedInUser) {
        if (board.getCreatedDate() == null) {
            board.setCreatedBy(loggedInUser);  // 새로 생성될 경우 생성자 정보 설정
        }
        board.setUpdatedBy(loggedInUser);  // 수정자 정보 설정
        return boardRepository.save(board);
    }

    // 게시글 생성
    public void createBoard(Board board, User user) {
        board.setUser(user);  // ManyToOne 관계의 user 설정
        board.setCreatedDate(LocalDateTime.now());  // 생성 시간 설정
        board.setUpdatedDate(LocalDateTime.now());  // 업데이트 시간 설정
        board.setCreatedBy(user.getUserId());  // 생성자 설정
        board.setUpdatedBy(user.getUserId());  // 수정자 설정

        boardRepository.save(board);  // 데이터베이스에 저장
    }

    // 카테고리별 게시물 목록 반환
    public List<Board> getBoardsByCategory(int category) {
        return boardRepository.findByBoardCategory(category);
    }

    // 특정 게시글 ID로 게시글 반환
    public Board getBoardById(Long boardNumber) {
        return boardRepository.findById(boardNumber).orElse(null);
    }
}
