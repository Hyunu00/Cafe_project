package com.example.demo.service;

import org.springframework.stereotype.Service;
import com.example.demo.entity.Board;
import com.example.demo.repository.BoardRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class BoardService {

    private final BoardRepository boardRepository;

    public BoardService(BoardRepository boardRepository) {
        this.boardRepository = boardRepository;
    }

    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    public int getPostCountByUserId(String userId) {
        return boardRepository.countPostsByUserId(userId);
    }

    public List<Board> getPostsByUserId(String userId) {
        return boardRepository.findByUserUserId(userId);
    }

    @Transactional
    public Board saveBoard(Board board) {
        return boardRepository.save(board);
    }
}
