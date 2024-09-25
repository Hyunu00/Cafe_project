package com.example.demo.controller;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;           
import java.util.HashMap;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 전체 사용자 목록 가져오기
    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    // 사용자 생성 (회원가입)
    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // 사용자 생성 시 필드 확인
            if (user.getUserId() == null || user.getUserPassword() == null || user.getUserName() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("필수 필드가 누락되었습니다.");
            }

            // 새 사용자 생성
            user.setCreatedBy("System");
            user.setUpdatedBy("System");
            User createdUser = userService.saveUser(user);
            return ResponseEntity.ok("회원가입 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패: " + e.getMessage());
        }
    }


    // 로그인 처리
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user, HttpSession session) {
        User authenticatedUser = userService.authenticate(user.getUserId(), user.getUserPassword());
        if (authenticatedUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 잘못되었습니다.");
        }

        // 로그인 성공 시 사용자 정보 저장
        session.setAttribute("user", authenticatedUser);
        return ResponseEntity.ok("로그인 성공");
    }

    // 로그아웃 처리
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate(); 
        return ResponseEntity.ok("로그아웃 성공");
    }

    // 현재 로그인한 사용자 정보 반환
    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
        return ResponseEntity.ok(user);
    }

    // 사용자 정보 업데이트 (닉네임, 이름, 비밀번호, 레벨 등)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(
        @PathVariable String id,
        @RequestParam("userNickname") String nickname,
        @RequestParam("userName") String name,
        @RequestParam("userPassword") String password,
        @RequestParam(value = "userLevel", required = false) Integer userLevel,
        @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
        HttpSession session) {
            
        try {
            // 로그인된 사용자 확인
            User loggedInUser = (User) session.getAttribute("user");
            if (loggedInUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
            }

            // 사용자 정보 업데이트 처리
            userService.updateUserProfile(id, nickname, name, password, userLevel, profileImage);
            return ResponseEntity.ok("프로필이 업데이트되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로필 업데이트 실패: " + e.getMessage());
        }
    }


    @PutMapping("/{id}/password")
    public ResponseEntity<?> updatePassword(@PathVariable String id, @RequestBody String newPassword, HttpSession session) {
        try {
            // 로그인된 사용자 확인
            User loggedInUser = (User) session.getAttribute("user");
            if (loggedInUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
            }

            // 비밀번호 업데이트
            userService.updatePassword(id, newPassword);
            return ResponseEntity.ok("비밀번호 업데이트 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 업데이트 실패: " + e.getMessage());
        }
    }

    // 사용자 삭제
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.noContent().build(); 
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // 오류 시 500 상태 코드 반환
        }
    }

    // 닉네임으로 아이디 찾기
    @PostMapping("/find-id")
    public ResponseEntity<?> findIdByNickname(@RequestParam String nickname) {
        try {
            String userId = userService.findUserIdByNickname(nickname);
            if (userId != null) {
                return ResponseEntity.ok("해당 닉네임의 아이디는 " + userId + "입니다.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 닉네임으로 등록된 아이디가 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("아이디 찾기 중 오류 발생: " + e.getMessage());
        }
    }

    // 닉네임과 아이디로 비밀번호 찾기
    @PostMapping("/find-password")
    public ResponseEntity<?> findPasswordByNicknameAndId(@RequestParam String nickname, @RequestParam String userId) {
        try {
            String userPassword = userService.findUserPasswordByNicknameAndId(nickname, userId);
            if (userPassword != null) {
                return ResponseEntity.ok("해당 닉네임과 아이디의 비밀번호는 " + userPassword + "입니다.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("닉네임 또는 아이디가 일치하지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 찾기 중 오류 발생: " + e.getMessage());
        }
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable String id,
            @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("사용자 업데이트 실패: " + e.getMessage());
        }
    }

    @PostMapping("/check-duplicate")
    public ResponseEntity<?> checkDuplicate(@RequestBody Map<String, String> requestData) {
        String userId = requestData.get("userId");
        String userNickname = requestData.get("userNickname");

        boolean isDuplicate = userService.isUserIdOrNicknameExists(userId, userNickname);

        Map<String, Boolean> response = new HashMap<>();
        response.put("userIdExists", userService.isUserIdOrNicknameExists(userId, null));
        response.put("nicknameExists", userService.isUserIdOrNicknameExists(null, userNickname));
        
        return ResponseEntity.ok(response);
    }

}
