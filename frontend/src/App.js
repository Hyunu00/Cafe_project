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
import BoardDetail from './BoardDetail';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
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
                    setUser(null); 
                } else {
                    throw new Error('서버 응답에 문제가 있습니다.');
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
                setUser(null); 
            }
        };
    
        fetchCurrentUser(); 
    }, []);
    
    // 게시글 개수를 상태로 저장
    useEffect(() => {
        const fetchPostCount = async () => {
            if (user) {
                try {
                    const response = await fetch(`http://localhost:8080/boards/count/${user.userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setPostCount(data); 
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
                        {/* 카테고리 링크 설정 */}
                        <Link to="/boards/category/all">전체게시판</Link><br />
                        <Link to="/boards/category/notice">공지게시판</Link><br />
                        <Link to="/boards/category/free">자유게시판</Link><br />
                        <Link to="/boards/category/questions">질문게시판</Link>
                    </ul>
                </div>
            </aside>

            <main>
                <Routes>
                    <Route path="/" element={<BoardList category="all" user={user}/>} />
                    <Route path="/boards/category/:category" element={<BoardList user={user} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/find-id" element={<FindId />} />
                    <Route path="/find-password" element={<FindPassword />} />
                    <Route path="/boards/detail/:boardNumber" element={<BoardDetail />} />
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
        </div>
    );
}
//상단 사이드바 로그인 관련 처리
function RenderAside({ user, setUser, postCount, error }) {
    const navigate = useNavigate();

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/users/logout', {
                method: 'POST',
                credentials: 'include',
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
                    <Link to="/my-posts">내가 쓴 글</Link> : {postCount} <br />
                    <Link to="/edit-profile">개인정보 수정</Link><br />
                    <button onClick={handleLogout}>로그아웃</button>
                </div>
            )}
        </div>
    );
}

export default App;
