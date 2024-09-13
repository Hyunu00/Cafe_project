import React, { useEffect, useState } from 'react';

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
                <ul>
                    {posts.map((post) => (
                        <li key={post.boardNumber}>{post.boardTitle}</li>
                    ))}
                </ul>
            ) : (
                <p>게시물이 없습니다.</p>
            )}
        </div>
    );
}

export default MyPosts;
