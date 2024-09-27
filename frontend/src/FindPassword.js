import React, { useState } from 'react';
import './App.css';

function FindPassword() {
    const [nickname, setNickname] = useState('');
    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');

    const handleFindPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/users/find-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ nickname, userId }),
            });
            const result = await response.text();
            setMessage(result);
        } catch (error) {
            setMessage('비밀번호 찾기 중 오류 발생.');
        }
    };

    return (
        <div>
            <h2>비밀번호 찾기</h2>
            <form onSubmit={handleFindPassword}>
                <label>닉네임:</label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
                <label>아이디:</label>
                <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <button type="submit">비밀번호 찾기</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default FindPassword;
