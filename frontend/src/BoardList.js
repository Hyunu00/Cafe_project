import React, { useEffect, useState } from 'react';
import './App.css'; // CSS 파일 추가

function BoardList() {
    const [boards, setBoards] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await fetch('http://localhost:8080/boards');
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(errorData.message || '서버에서 오류가 발생했습니다.');
                } else {
                    const data = await response.json();

                    // 최신 글이 위로 오도록 정렬 (내림차순)
                    const sortedData = data.sort((a, b) => new Date(b.updatedDate) - new Date(a.updatedDate));
                    setBoards(sortedData);
                }
            } catch (err) {
                setError('네트워크 오류가 발생했습니다.');
            }
        };

        fetchBoards();
    }, []);

    if (error) {
        return <div>오류: {error}</div>;
    }

    return (
        <div>
            <h2>게시판 목록</h2>
            <table className="board-table">
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>내용</th>
                        <th>업데이트 날짜</th>
                        <th>작성자</th>
                    </tr>
                </thead>
                <tbody>
                    {boards.map((board) => (
                        <tr key={board.boardNumber}>
                            <td>{board.boardNumber}</td>
                            <td>{board.boardTitle}</td>
                            <td>{board.boardWrite.length > 10 ? board.boardWrite.substring(0, 10) + '...' : board.boardWrite}</td>
                            <td>{new Date(board.updatedDate).toLocaleString()}</td>
                            <td>{board.user.userNickname}</td> {/* userNickname 필드가 있는지 확인 필요 */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BoardList;
