import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // React Router의 Link를 사용하여 페이지 이동 적용
import './App.css'; // 테이블 스타일 적용

function MyPosts({ user }) {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(1);   // 총 페이지 수 상태
    const pageSize = 10;  // 한 페이지에 보여줄 게시물 수

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (user) {
                    const response = await fetch(`http://localhost:8080/boards/user/${user.userId}`);
                    if (!response.ok) {
                        setError('게시물을 불러오는데 오류가 발생했습니다.');
                    } else {
                        const data = await response.json();
                        setPosts(data || []); // 응답이 null이거나 undefined인 경우 빈 배열로 초기화
                        setTotalPages(Math.ceil((data || []).length / pageSize)); // 총 페이지 수 계산
                    }
                }
            } catch (err) {
                setError('네트워크 오류가 발생했습니다.');
            }
        };
        fetchPosts();
    }, [user]);

    const getCategoryNameInKorean = (categoryId) => {
        switch (categoryId) {
            case 2:
                return '공지';
            case 3:
                return '질문';
            case 4:
                return '자유';
            default:
                return '알 수 없음';
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (error) {
        return <div>오류: {error}</div>;
    }

    const paginatedPosts = posts.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const noticePosts = paginatedPosts?.filter(post => post.boardCategory === 2) || [];
    const otherPosts = paginatedPosts?.filter(post => post.boardCategory !== 2) || [];

    return (
        <div>
            <h2>{user?.userNickname}님의 게시물</h2>
            {posts.length > 0 ? (
                <>
                    <table className="board-table">
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>카테고리</th>
                                <th>제목</th>
                                <th>내용</th>
                                <th>업데이트 날짜</th>
                                <th>작성자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* 공지 게시물 먼저 표시 */}
                            {noticePosts.map((post) => (
                                <tr key={post.boardNumber} className="notice-row">
                                    <td>{post.boardNumber}</td>
                                    <td>{getCategoryNameInKorean(post.boardCategory)}</td>
                                    <td>
                                        <Link to={`/boards/detail/${post.boardNumber}`}>
                                            {post.boardTitle}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/boards/detail/${post.boardNumber}`}>
                                            {post.boardWrite.length > 10 ? post.boardWrite.substring(0, 10) + '...' : post.boardWrite}
                                        </Link>
                                    </td>
                                    <td>{new Date(post.updatedDate).toLocaleString()}</td>
                                    <td>{user.userNickname}</td>
                                </tr>
                            ))}
                            {/* 나머지 게시물 표시 */}
                            {otherPosts.map((post) => (
                                <tr key={post.boardNumber}>
                                    <td>{post.boardNumber}</td>
                                    <td>{getCategoryNameInKorean(post.boardCategory)}</td>
                                    <td>
                                        <Link to={`/boards/detail/${post.boardNumber}`}>
                                            {post.boardTitle}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/boards/detail/${post.boardNumber}`}>
                                            {post.boardWrite.length > 10 ? post.boardWrite.substring(0, 10) + '...' : post.boardWrite}
                                        </Link>
                                    </td>
                                    <td>{new Date(post.updatedDate).toLocaleString()}</td>
                                    <td>{user.userNickname}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                            이전 페이지
                        </button>
                        <span>{currentPage + 1} / {totalPages}</span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
                            다음 페이지
                        </button>
                    </div>
                </>
            ) : (
                <p>게시물이 없습니다.</p>
            )}
        </div>
    );
}

export default MyPosts;
