import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './App.css';

function BoardList({ user }) {  
    const { category = "all" } = useParams(); 
    const [boards, setBoards] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가
    const [searchCategory, setSearchCategory] = useState(category); // 검색에 사용될 카테고리
    const [selectedCategory, setSelectedCategory] = useState(category); // 검색을 위한 선택된 카테고리
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

    // 카테고리 한글 변환
    const getCategoryNameInKorean = (categoryId) => {
        switch (categoryId) {
            case 'all':
            case 1:
                return '전체';
            case 'notice':
            case 2:
                return '공지';
            case 'questions':
            case 3:
                return '질문';
            case 'free':
            case 4:
                return '자유';
            default:
                return '알 수 없음';
        }
    };

    // 게시물 가져오기 함수
    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await fetch(`http://localhost:8080/boards/category/${category}`);
                if (!response.ok) {
                    setError('서버에서 오류가 발생했습니다.');
                } else {
                    const data = await response.json();
                    setBoards(data);
                    setTotalPages(Math.ceil(data.length / 10)); // 총 페이지 수 계산
                }
            } catch (err) {
                setError('네트워크 오류가 발생했습니다.');
            }
        };

        fetchBoards();
    }, [category]);

    const handleSearch = () => {
        setSearchCategory(selectedCategory); // 선택된 카테고리로 검색 수행
        navigate(`/boards/category/${selectedCategory}`); // 카테고리 변경 시 경로 이동
    };

    const handleCreatePost = () => {
        if (user) {
            navigate('/create-post'); // 로그인된 경우 글쓰기 페이지로 이동
        } else {
            alert('로그인이 필요합니다.'); // 로그인되지 않은 경우 경고 메시지
            navigate('/login'); // 로그인 페이지로 이동
        }
    };

    if (error) {
        return <div>오류: {error}</div>;
    }

    if (boards.length === 0) {
        return <div>게시물이 없습니다.</div>;
    }

    // 공지사항과 기타 게시물 분리
    const noticeBoards = boards.filter(board => board.boardCategory === 2); // 공지사항
    const otherBoards = boards.filter(board => board.boardCategory !== 2); // 기타 게시물

    // 기타 게시물 최신순으로 정렬
    otherBoards.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));

    // 제목이나 내용에 검색어가 포함된 게시물 필터링
    const filteredBoards = [...noticeBoards, ...otherBoards].filter(board =>
        board.boardTitle.includes(searchTerm) || board.boardWrite.includes(searchTerm)
    );

    const displayedBoards = filteredBoards.slice(currentPage * 10, (currentPage + 1) * 10);

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

    return (
        <div>
            <h2>{getCategoryNameInKorean(category)} 게시판</h2>

            {/* 검색 기능 */}
            <div className="board-controls">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="all">전체</option>
                    <option value="notice">공지</option>
                    <option value="questions">질문</option>
                    <option value="free">자유</option>
                </select>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="검색어를 입력하세요"
                />
                <button onClick={handleSearch}>검색</button>
            </div>

            <table>
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
                    {displayedBoards.map((board) => (
                        <tr key={board.boardNumber} className={board.boardCategory === 2 ? 'notice-row' : ''}>
                            <td>{board.boardNumber}</td>
                            <td>{getCategoryNameInKorean(board.boardCategory)}</td>
                            <td>
                                <Link to={`/boards/detail/${board.boardNumber}`}>
                                    {board.boardTitle}
                                </Link>
                            </td>
                            <td>
                                <Link to={`/boards/detail/${board.boardNumber}`}>
                                    {board.boardWrite.substring(0, 10)}
                                </Link>
                            </td>
                            <td>{new Date(board.updatedDate).toLocaleString()}</td>
                            <td>{board.user?.userNickname}</td>
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

            {/* 글쓰기 버튼 추가 - 로그인한 사용자만 보임 */}
            <div className="create-post-button-container">
                {user && <button onClick={handleCreatePost}>글쓰기</button>}
            </div>
        </div>
    );
}

export default BoardList;
