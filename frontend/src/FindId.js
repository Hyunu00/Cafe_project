import React, { useState } from 'react';

function FindId() {
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');

    const handleFindId = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/users/find-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ nickname }),
            });
            const result = await response.text();
            setMessage(result);
        } catch (error) {
            setMessage('아이디 찾기 중 오류 발생.');
        }
    };

    return (
        <div>
            <h2>아이디 찾기</h2>
            <form onSubmit={handleFindId}>
                <label>닉네임:</label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
                <button type="submit">아이디 찾기</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default FindId;
