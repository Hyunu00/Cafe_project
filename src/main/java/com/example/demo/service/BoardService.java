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
            board.setCreatedBy(loggedInUser);  
        }
        board.setUpdatedBy(loggedInUser);  
        return boardRepository.save(board);
    }

    // 게시글 생성
    public void createBoard(Board board, User user) {
        board.setUser(user); 
        board.setCreatedDate(LocalDateTime.now());  
        board.setUpdatedDate(LocalDateTime.now());  
        board.setCreatedBy(user.getUserId());  
        board.setUpdatedBy(user.getUserId()); 

        boardRepository.save(board);  
    }

    // 카테고리별 게시물 목록 반환
    public List<Board> getBoardsByCategory(int category) {
        return boardRepository.findByBoardCategory(category);
    }

    // 특정 게시글 ID로 게시글 반환
    public Board getBoardById(Long boardNumber) {
        return boardRepository.findById(boardNumber).orElse(null);
    }

    public Board getBoardDetail(Long boardNumber) {
        return boardRepository.findById(boardNumber)
            .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다."));
    }

    public Board updateBoard(Long boardNumber, Board updatedBoard) {
        Board board = boardRepository.findById(boardNumber)
                .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다."));
        board.setBoardTitle(updatedBoard.getBoardTitle());
        board.setBoardWrite(updatedBoard.getBoardWrite());
        board.setUpdatedDate(LocalDateTime.now());
        return boardRepository.save(board);
    }

    public void deleteBoard(Long boardNumber) {
        boardRepository.deleteById(boardNumber);
    }
    
}
