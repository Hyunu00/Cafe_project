package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.List;
import jakarta.servlet.http.HttpSession;
import com.example.demo.entity.Board;
import com.example.demo.entity.User;
import com.example.demo.service.BoardService;
import com.example.demo.service.UserService;

@RestController
@RequestMapping("/boards")
public class BoardController {

    private final BoardService boardService;
    private final UserService userService;  // UserService를 추가하여 사용자를 조회

    @Autowired
    public BoardController(BoardService boardService, UserService userService) {
        this.boardService = boardService;
        this.userService = userService;  // UserService 주입
    }

    // 전체 게시글 가져오기
    @GetMapping
    public List<Board> getBoards() {
        return boardService.getAllBoards();
    }

    // 특정 사용자의 게시글 개수 가져오기
    @GetMapping("/count/{userId}")
    public int getPostCountByUserId(@PathVariable String userId) {
        return boardService.getPostCountByUserId(userId);
    }

    // 특정 사용자의 게시글 목록 가져오기
    @GetMapping("/user/{userId}")
    public List<Board> getPostsByUserId(@PathVariable String userId) {
        return boardService.getPostsByUserId(userId);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody Board board, HttpSession session) {
        try {
            // 세션에서 현재 로그인된 사용자 가져오기
            User loggedInUser = (User) session.getAttribute("user");
            if (loggedInUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
            }

            // 게시글에 현재 로그인된 사용자 설정
            board.setUser(loggedInUser);

            // 게시글 저장
            Board createdBoard = boardService.saveBoard(board);
            return ResponseEntity.ok("게시글 작성 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("게시글 작성 중 오류 발생: " + e.getMessage());
        }
    }
}
