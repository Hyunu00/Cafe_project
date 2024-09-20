import React, { useEffect, useState } from 'react';
import './App.js'; // 테이블 스타일 적용

function MyPosts({ user }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (user) {
                const response = await fetch(`http://localhost:8080/boards/user/${user.userId}`);
                const data = await response.json();
                setPosts(data);
            }
        };
        fetchPosts();
    }, [user]);

    return (
        <div>
            <h2>{user?.userNickname}님의 게시물</h2>
            {posts.length > 0 ? (
                <table className="board-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>내용</th>
                            <th>업데이트 날짜</th>
                            <th>작성자</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.boardNumber}>
                                <td>{post.boardNumber}</td>
                                <td>{post.boardTitle}</td>
                                <td>{post.boardWrite.length > 10 ? post.boardWrite.substring(0, 10) + '...' : post.boardWrite}</td>
                                {/* 날짜와 시간 모두 표시 */}
                                <td>{new Date(post.updatedDate).toLocaleString()}</td>
                                <td>{user.userNickname}</td> {/* 작성자는 항상 현재 사용자 */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>게시물이 없습니다.</p>
            )}
        </div>
    );
}

export default MyPosts;
