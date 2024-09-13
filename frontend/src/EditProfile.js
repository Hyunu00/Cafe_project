import React, { useState } from 'react';

function EditProfile({ user }) {
    const [nickname, setNickname] = useState(user ? user.userNickname : '');
    const [password, setPassword] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedData = { userNickname: nickname, userPassword: password };

        try {
            const response = await fetch(`http://localhost:8080/users/${user.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                alert('프로필이 업데이트되었습니다.');
            } else {
                alert('업데이트 실패');
            }
        } catch (error) {
            console.error('업데이트 에러:', error);
        }
    };

    return (
        <div>
            <h2>프로필 수정</h2>
            <form onSubmit={handleUpdate}>
                <label>닉네임:</label>
                <input 
                    type="text" 
                    value={nickname} 
                    onChange={(e) => setNickname(e.target.value)} 
                    required
                /><br />

                <label>비밀번호:</label>
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                /><br />

                <button type="submit">수정하기</button>
            </form>
        </div>
    );
}

export default EditProfile;
