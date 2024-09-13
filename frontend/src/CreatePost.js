import React, { useState } from 'react';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState(1);  // 카테고리 기본값 설정

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = {
            boardTitle: title,
            boardWrite: content,
            boardCategory: category // 선택된 카테고리 값
        };

        try {
            const response = await fetch('http://localhost:8080/boards/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
            });

            if (response.ok) {
                alert('글 작성 완료');
                setTitle('');
                setContent('');
            } else {
                alert('글 작성 실패');
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
                    <option value={2}>공유게시판</option>
                    <option value={3}>질문게시판</option>
                </select>
                <br />

                <button type="submit">글 작성</button>
            </form>
        </div>
    );
}

export default CreatePost;
