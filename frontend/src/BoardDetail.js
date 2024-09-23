import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function BoardDetail() {
    const { boardNumber } = useParams(); // 게시물 번호
    const [board, setBoard] = useState(null);
    const [error, setError] = useState(null);

    // 게시물 상세 정보,내용 조회
    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await fetch(`http://localhost:8080/boards/detail/${boardNumber}`);
                if (!response.ok) {
                    setError('게시물을 불러오는 중 오류가 발생했습니다.');
                } else {
                    const data = await response.json();
                    setBoard(data);
                }
            } catch (err) {
                setError('네트워크 오류가 발생했습니다.');
            }
        };

        fetchBoard();
    }, [boardNumber]);

    if (error) {
        return <div>오류: {error}</div>;
    }

    if (!board) {
        return <div>로딩 중...</div>;
    }

    return (
        <div>
            <h2>{board.boardTitle}</h2>
            <p>{board.boardWrite}</p>
            <p>작성자: {board.user?.userNickname}</p>
            <p>작성일: {new Date(board.createdDate).toLocaleString()}</p>
            <p>수정일: {new Date(board.updatedDate).toLocaleString()}</p>
        </div>
    );
}

export default BoardDetail;
