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
    private final UserService userService;

    @Autowired
    public BoardController(BoardService boardService, UserService userService) {
        this.boardService = boardService;
        this.userService = userService;
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

    // 게시글 생성 (세션에서 로그인된 사용자 정보 사용)`
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
            Board createdBoard = boardService.saveBoard(board, loggedInUser.getUserId());  // 두 번째 인자로 loggedInUser.getUserId() 전달
            return ResponseEntity.ok("게시글 작성 완료");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("게시글 작성 중 오류 발생: " + e.getMessage());
        }
    }

    // Board 생성 시 로그인된 사용자의 ID를 사용하여 CRT_USER, UDT_USER 설정
    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Board board, HttpSession session) {
        String loggedInUser = (String) session.getAttribute("userId");
        board.setUpdatedBy(loggedInUser);
        Board createdBoard = boardService.saveBoard(board, loggedInUser); 
        return new ResponseEntity<>(createdBoard, HttpStatus.CREATED);
    }

    // Board 수정 시 UDT_USER 업데이트
    @PutMapping("/{id}")
    public ResponseEntity<Board> updateBoard(@PathVariable Long id, @RequestBody Board boardDetails, HttpSession session) {
        String loggedInUser = (String) session.getAttribute("userId");
        boardDetails.setUpdatedBy(loggedInUser);
        Board updatedBoard = boardService.saveBoard(boardDetails, loggedInUser);
        return ResponseEntity.ok(updatedBoard);
    }

}
