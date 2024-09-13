import React, { useEffect, useState } from 'react';

function BoardList() {
    const [boards, setBoards] = useState([]);
    const [error, setError] = useState(null); // 에러 상태 추가

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await fetch('http://localhost:8080/boards');
                if (!response.ok) {
                    // 에러가 발생한 경우 JSON 응답에서 메시지만 추출
                    const errorData = await response.json();
                    setError(errorData.message || '서버에서 오류가 발생했습니다.');
                } else {
                    const data = await response.json();
                    setBoards(data);
                }
            } catch (err) {
                // 네트워크 오류가 발생했을 때 처리
                setError('네트워크 오류가 발생했습니다.');
            }
        };

        fetchBoards();
    }, []);

    if (error) {
        // 에러가 있을 때 에러 메시지를 출력
        return <div>오류: {error}</div>;
    }

    return (
        <div>
            <h2>게시판 목록</h2>
            <ul>
                {boards.map((board) => (
                    <li key={board.boardNumber}>{board.boardTitle}</li>
                ))}
            </ul>
        </div>
    );
}

export default BoardList;
