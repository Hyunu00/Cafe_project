package com.example.demo.service;

import org.springframework.stereotype.Service;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User saveUser(User user) {
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            System.out.println("사용자 저장 오류: " + e.getMessage());
            throw new RuntimeException("사용자 저장 중 오류 발생", e);
        }
    }

    // 사용자 ID로 DB에서 사용자 정보 가져오기
    public User getUserById(String userId) {
        return userRepository.findById(userId).orElse(null);
    }

    // 사용자 인증 메서드 추가
    public User authenticate(String userId, String userPassword) {
        User user = getUserById(userId);
        if (user != null && user.getUserPassword().equals(userPassword)) {
            return user;
        }
        return null;  
    }

    // 사용자 프로필 업데이트 메서드
    public void updateUserProfile(String id, String nickname, String name, String password, MultipartFile profileImage) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUserNickname(nickname);
            user.setUserName(name);
            user.setUserPassword(password);

            // 프로필 이미지가 있을 경우 처리
            if (profileImage != null && !profileImage.isEmpty()) {
                try {
                    byte[] imageBytes = profileImage.getBytes();
                    user.setUserImage(imageBytes);  // 이미지 저장 (Byte 배열로 저장하는 경우)
                } catch (Exception e) {
                    throw new RuntimeException("프로필 이미지 처리 중 오류 발생", e);
                }
            }
             // 변경 사항 저장
             userRepository.save(user);
            } else {
                throw new RuntimeException("User not found with id " + id);
            }
        }

    // 사용자 업데이트
    @Transactional
    public User updateUser(String id, User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUserName(userDetails.getUserName());
            user.setUserNickname(userDetails.getUserNickname());
            user.setUserPassword(userDetails.getUserPassword());
            user.setUserImage(userDetails.getUserImage());
            user.setUserLevel(userDetails.getUserLevel());
            user.setUpdatedBy(userDetails.getUpdatedBy());
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with id " + id);
        }
    }

    // 비밀번호 업데이트 메서드 추가
    public void updatePassword(String id, String newPassword) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUserPassword(newPassword);  // 새로운 비밀번호 설정
            userRepository.save(user);         // 변경 사항 저장
        } else {
            throw new RuntimeException("User not found with id " + id);
        }
    }

    // 닉네임으로 사용자 아이디 찾기
    public String findUserIdByNickname(String nickname) {
        User user = userRepository.findByUserNickname(nickname);
        return user != null ? user.getUserId() : null;
    }

    // 닉네임과 아이디로 비밀번호 찾기
    public String findUserPasswordByNicknameAndId(String nickname, String userId) {
        User user = userRepository.findByUserNicknameAndUserId(nickname, userId);
        return user != null ? user.getUserPassword() : null;
    }
    
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
