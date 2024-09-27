import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

function BoardDetail({ user }) {
    const { boardNumber } = useParams();
    const [board, setBoard] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(''); 
    const [editedContent, setEditedContent] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await fetch(`http://localhost:8080/boards/detail/${boardNumber}`);
                if (!response.ok) {
                    setError('게시물을 불러오는 중 오류가 발생했습니다.');
                } else {
                    const data = await response.json();
                    setBoard(data);
                    setEditedTitle(data.boardTitle); 
                    setEditedContent(data.boardWrite); 
                }
            } catch (err) {
                setError('네트워크 오류가 발생했습니다.');
            }
        };

        fetchBoard();
    }, [boardNumber]);

    const handleDelete = async () => {
        if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
            try {
                const response = await fetch(`http://localhost:8080/boards/delete/${boardNumber}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    alert('게시물이 삭제되었습니다.');
                    navigate('/boards');
                } else {
                    alert('게시물 삭제에 실패했습니다.');
                }
            } catch (error) {
                alert('네트워크 오류로 게시물 삭제에 실패했습니다.');
            }
        }
    };

    const handleEdit = async () => {
        if (isEditing) {
           
            try {
                const response = await fetch(`http://localhost:8080/boards/update/${boardNumber}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        boardTitle: editedTitle,
                        boardWrite: editedContent,
                    }),
                });

                if (response.ok) {
                    const updatedBoard = await response.json();
                    setBoard(updatedBoard); 
                    setIsEditing(false); 
                    alert('게시물이 수정되었습니다.');
                } else {
                    alert('게시물 수정에 실패했습니다.');
                }
            } catch (error) {
                alert('네트워크 오류로 게시물 수정에 실패했습니다.');
            }
        } else {
            setIsEditing(true); 
        }
    };

    if (error) {
        return <div>오류: {error}</div>;
    }

    if (!board) {
        return <div>로딩 중...</div>;
    }

    const userNickname = board.user ? board.user.userNickname : '알 수 없음';
    const userId = board.user ? board.user.userId : null;

    return (
        <div>
            <h2>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                    />
                ) : (
                    board.boardTitle
                )}
            </h2>

            <p>
                {isEditing ? (
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                ) : (
                    board.boardWrite
                )}
            </p>

            <p>작성자: {userNickname}</p>
            <p>작성일: {new Date(board.createdDate).toLocaleString()}</p>
            <p>수정일: {new Date(board.updatedDate).toLocaleString()}</p>

            {(user && (userId === user.userId || user.userLevel >= 4)) && (
                <div>
                    <button onClick={handleEdit}>
                        {isEditing ? '저장' : '수정'}
                    </button>
                    <button onClick={handleDelete}>삭제</button>
                </div>
            )}
        </div>
    );
}

export default BoardDetail;
