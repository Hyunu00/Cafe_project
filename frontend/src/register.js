import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './App.css';

function Register() {
    const [userId, setUserId] = useState(''); 
    const [userPassword, setUserPassword] = useState(''); 
    const [rePassword, setRePassword] = useState('');
    const [userName, setUserName] = useState(''); 
    const [userNickname, setUserNickname] = useState('');
    const [userIdAvailable, setUserIdAvailable] = useState(null); 
    const [nicknameAvailable, setNicknameAvailable] = useState(null); 

    const navigate = useNavigate(); 

    const checkDuplicate = async (field, value) => {
        try {
            const response = await fetch(`http://localhost:8080/users/check-duplicate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value }),
            });

            const result = await response.json();
            return result;  
        } catch (error) {
            console.error('중복 확인 에러:', error);
            return null;
        }
    };

    useEffect(() => {
        if (userId && userId.length >= 6) {
            checkDuplicate('userId', userId).then((result) => {
                setUserIdAvailable(!result?.userIdExists);
            });
        }
    }, [userId]);

    useEffect(() => {
        if (userNickname) {
            checkDuplicate('userNickname', userNickname).then((result) => {
                setNicknameAvailable(!result?.nicknameExists);
            });
        }
    }, [userNickname]);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (userPassword !== rePassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!userIdAvailable || !nicknameAvailable) {
            alert('아이디 또는 닉네임이 중복되었습니다.');
            return;
        }

        if (userId.length < 6 || userId.length > 20) {
            alert('아이디는 최소 6자, 최대 20자여야 합니다.');
            return;
        }

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
                navigate('/'); 
            } else {
                alert('회원가입 실패');
            }
        } catch (error) {
            console.error('회원가입 에러:', error);
        }
    };

    const handleIdCheck = () => {
        checkDuplicate('userId', userId).then((result) => {
            setUserIdAvailable(!result?.userIdExists);
        });
    };

    const handleNicknameCheck = () => {
        checkDuplicate('userNickname', userNickname).then((result) => {
            setNicknameAvailable(!result?.nicknameExists);
        });
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
                    minLength={6}   
                    maxLength={20}   
                />
                {userIdAvailable === false && <p style={{ color: 'red' }}>이미 사용 중인 아이디입니다.</p>}
                {userIdAvailable === true && <p style={{ color: 'green' }}>사용 가능한 아이디입니다.</p>}
                {userId.length < 6 && <p style={{ color: 'red' }}>아이디는 최소 6자여야 합니다.</p>}
                {userId.length > 20 && <p style={{ color: 'red' }}>아이디는 최대 20자까지만 가능합니다.</p>}
                <br />

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
                />
                {nicknameAvailable === false && <p style={{ color: 'red' }}>이미 사용 중인 닉네임입니다.</p>}
                {nicknameAvailable === true && <p style={{ color: 'green' }}>사용 가능한 닉네임입니다.</p>}
                <br />

                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default Register;
