import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Register from './register';
import Login from './login';
import MyPosts from './MyPosts';
import EditProfile from './EditProfile';
import BoardList from './BoardList';
import CreatePost from './CreatePost';
import FindId from './FindId';
import FindPassword from './FindPassword';
import './App.css';

function App() {
    const [user, setUser] = useState(null); // 로그인된 사용자 정보를 저장하는 상태
    const [postCount, setPostCount] = useState(0);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // 로그인 상태 유지
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch('http://localhost:8080/users/current-user', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const user = await response.json();
                    setUser(user);
                } else if (response.status === 401) {
                    setUser(null); // 인증 실패 시 로그아웃 상태로 설정
                }
            } catch (error) {
                console.error('현재 사용자 정보 불러오기 실패:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchPostCount = async () => {
            if (user) {
                try {
                    const response = await fetch(`http://localhost:8080/boards/count/${user.userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setPostCount(data); // 게시글 개수를 상태로 저장
                    } else {
                        throw new Error('게시글 개수를 불러오는 중 오류 발생');
                    }
                } catch (error) {
                    setError(error.message);
                    console.error('게시글 개수 가져오기 실패:', error);
                }
            }
        };
        fetchPostCount();
    }, [user]);

    return (
        <div className="container">
            {/* 고정된 헤더 */}
            <header>
                <div className="home-link">홈 &gt;</div>
                <div className="banner">메인 배너</div>
            </header>

            {/* 고정된 사이드바 */}
            <aside className="aside-container">
                <RenderAside user={user} setUser={setUser} postCount={postCount} error={error} />
                <div className="aside-section">
                    <ul className="category">
                        <li>카테고리</li>
                        <hr width="100%" color="black"></hr>
                        <Link to="/">전체게시판</Link><br />
                        <Link to="/shared">공지게시판</Link><br />
                        <Link to="/questions">질문게시판</Link><br />
                        <Link to="/free">자유게시판</Link>
                    </ul>
                </div>
            </aside>

            {/* 동적 콘텐츠 영역 */}
            <main>
                <Routes>
                    <Route path="/" element={<BoardList />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/find-id" element={<FindId />} />
                    <Route path="/find-password" element={<FindPassword />} />
                    
                    {/* 로그인 후에만 접근 가능한 페이지 */}
                    {user && (
                        <>
                            <Route path="/my-posts" element={<MyPosts user={user} />} />
                            <Route path="/edit-profile" element={<EditProfile user={user} />} />
                            <Route path="/create-post" element={<CreatePost user={user} />} />
                        </>
                    )}
                </Routes>
            </main>

            {/* 글쓰기 링크 - 로그인한 사용자만 글쓰기가 가능함 */}
            {user && <Link to="/create-post">글쓰기</Link>}
        </div>
    );
}

function RenderAside({ user, setUser, postCount, error }) {
    const navigate = useNavigate(); // useNavigate 훅 사용

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/users/logout', {
                method: 'POST',
                credentials: 'include', // 세션 무효화 요청
            });

            if (response.ok) {
                localStorage.removeItem('token');
                setUser(null);
                alert('로그아웃 되었습니다.');
                navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
            } else {
                throw new Error('로그아웃 실패');
            }
        } catch (error) {
            console.error('로그아웃 에러:', error);
        }
    };

    if (error) {
        return <div>오류 발생: {error}</div>;
    }

    return (
        <div className="aside-section">
            {!user ? (
                <div className="login-section">
                    <ul className="login-menu">
                        <Link to="/login">로그인</Link><br />
                        <Link to="/register">회원가입</Link><br />
                        <Link to="/find-id">아이디 찾기</Link><br />
                        <Link to="/find-password">비밀번호 찾기</Link><br />
                    </ul>
                </div>
            ) : (
                <div className="user-info">
                    {user.userImage && (
                        <img
                            src={`data:image/jpeg;base64,${user.userImage}`}
                            alt="프로필 이미지"
                            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                        />
                    )}
                    <p>닉네임: {user.userNickname}</p>
                    <p>아이디: {user.userId}</p>
                    <p>내가 쓴 글 개수: {postCount}</p>
                    <Link to="/my-posts">내가 쓴 글</Link><br />
                    <Link to="/edit-profile">개인정보 수정</Link><br />
                    <button onClick={handleLogout}>로그아웃</button>
                </div>
            )}
        </div>
    );
}

export default App;
