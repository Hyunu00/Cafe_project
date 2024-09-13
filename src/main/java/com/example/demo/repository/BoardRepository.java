package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.example.demo.entity.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {

    // 특정 사용자의 게시글 개수를 반환하는 쿼리
    @Query("SELECT COUNT(b) FROM Board b WHERE b.user.userId = :userId")
    int countPostsByUserId(@Param("userId") String userId);

    // 특정 사용자가 작성한 게시글 목록을 가져오는 메서드
    @Query("SELECT b FROM Board b WHERE b.user.userId = :userId")
    List<Board> findByUserUserId(@Param("userId") String userId);
}
