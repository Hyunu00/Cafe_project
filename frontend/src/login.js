import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
    const [userId, setUserId] = useState(''); // 사용자 ID 상태
    const [password, setPassword] = useState(''); // 비밀번호 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!userId.trim() || !password.trim()) {
            setErrorMessage('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        const credentials = { userId, userPassword: password }; // 서버에 맞춘 데이터 이름
        setLoading(true);
        setErrorMessage(''); // 에러 메시지 초기화

        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
                credentials: 'include',  // 세션 쿠키 전송
            });

            if (response.ok) {
                // 로그인 성공 시 사용자 정보 요청
                const userResponse = await fetch('http://localhost:8080/users/current-user', {
                    method: 'GET',
                    credentials: 'include',  // 세션 기반 요청
                });

                if (userResponse.ok) {
                    const user = await userResponse.json();
                    setUser(user); // 로그인된 사용자 정보를 상태에 저장
                    alert('로그인 성공');
                    navigate('/');
                } else {
                    setErrorMessage('사용자 정보를 가져오는 데 실패했습니다.');
                }
            } else if (response.status === 401) {
                setErrorMessage('아이디 또는 비밀번호가 잘못되었습니다.');
            } else {
                setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            setErrorMessage('서버와의 연결에 문제가 발생했습니다.');
        } finally {
            setLoading(false); // 로딩 상태 종료
        }
    };

    return (
        <div className="login-container">
            <h2>로그인</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* 에러 메시지 표시 */}
            <form onSubmit={handleLogin}>
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />

                <button type="submit" disabled={loading}>
                    {loading ? '로그인 중...' : '로그인'}
                </button>
            </form>
        </div>
    );
}

export default Login;
