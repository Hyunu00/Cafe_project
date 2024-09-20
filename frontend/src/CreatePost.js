import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(1); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = {
            boardTitle: title,
            boardWrite: content,
            boardCategory: category 
        };

        try {
            const response = await fetch('http://localhost:8080/boards/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(newPost),
            });

            if (!response.ok) {
                console.error(`Error: ${response.status}`); // 상태 코드를 출력하여 문제 확인
                if (response.status === 401) {
                    alert('로그인이 필요합니다.');
                    navigate('/login'); // 로그인 페이지로 이동
                } else if (response.status === 400) {
                    alert('잘못된 요청입니다.');
                } else {
                    alert('글 작성 실패');
                }
            } else {
                alert('글 작성이 완료되었습니다.');
                navigate('/'); // 메인 페이지로 이동
            }
            
        } catch (error) {
            console.error('글 작성 오류:', error);
        }
    };

    return (
        <div>
            <h2>글쓰기</h2>
            <form onSubmit={handleSubmit}>
                <label>제목:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                /><br />

                <label>내용:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                /><br />

                <label>카테고리:</label>
                <select value={category} onChange={(e) => setCategory(Number(e.target.value))}>
                    <option value={1}>자유게시판</option>
                    <option value={2}>공지게시판</option>
                    <option value={3}>질문게시판</option>
                </select>
                <br />

                <button type="submit">글 작성</button>
            </form>
        </div>
    );
}

export default CreatePost;
