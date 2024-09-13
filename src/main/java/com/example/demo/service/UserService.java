package com.example.demo.service;
import org.springframework.stereotype.Service;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Create a new user
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
        return null;  // 인증 실패 시 null 반환
    }

    // Update an existing user
    public User updateUser(String id, User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUserName(userDetails.getUserName());
            user.setUserNickname(userDetails.getUserNickname());
            user.setUserPassword(userDetails.getUserPassword());
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found with id " + id);
        }
    }

    // Delete a user
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}
