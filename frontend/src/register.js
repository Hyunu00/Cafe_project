import React, { useState } from 'react';

function Register() {
    const [userId, setUserId] = useState(''); 
    const [userPassword, setUserPassword] = useState(''); 
    const [rePassword, setRePassword] = useState('');
    const [userName, setUserName] = useState(''); 
    const [userNickname, setUserNickname] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();

        if (userPassword !== rePassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        //DB에 넣을 정보
        const user = { 
            userId,        
            userPassword,   
            userName,      
            userNickname   
        };

        try {
            const response = await fetch('http://localhost:8080/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                alert('회원가입 성공');
            } else {
                alert('회원가입 실패');
            }
        } catch (error) {
            console.error('회원가입 에러:', error);
        }
    };

    return (
        <div className="register-container">
            <h2>회원가입</h2>
            <form onSubmit={handleSignup}>
                <label>아이디:</label>
                <input 
                    type="text" 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)} 
                    required
                /><br />

                <label>비밀번호:</label>
                <input 
                    type="password" 
                    value={userPassword} 
                    onChange={(e) => setUserPassword(e.target.value)} 
                    required
                /><br />

                <label>비밀번호 확인:</label>
                <input 
                    type="password" 
                    value={rePassword} 
                    onChange={(e) => setRePassword(e.target.value)} 
                    required
                /><br />

                <label>이름:</label>
                <input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                    required
                /><br />

                <label>닉네임:</label>
                <input 
                    type="text" 
                    value={userNickname} 
                    onChange={(e) => setUserNickname(e.target.value)} 
                    required
                /><br />

                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default Register;
