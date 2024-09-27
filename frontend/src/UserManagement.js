import React, { useState, useEffect } from 'react';
import './App.css';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editUser, setEditUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:8080/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('사용자 목록을 불러오는 중 오류 발생:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            await fetch(`http://localhost:8080/users/delete/${userId}`, { method: 'DELETE' });
            setUsers(users.filter(user => user.userId !== userId));
        } catch (error) {
            console.error('사용자 삭제 중 오류 발생:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEditUser = (user) => {
        setEditUser({ ...user });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditUser({
            ...editUser,
            [name]: value
        });
    };

    
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (editUser.userLevel < 1 || editUser.userLevel > 4) {
            alert("레벨은 1~4까지 가능.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/users/admin/${editUser.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editUser),
            });
            if (response.ok) {
                setUsers(users.map(user => (user.userId === editUser.userId ? editUser : user)));
                setEditUser(null); 
            } else {
                throw new Error('사용자 정보 업데이트 실패');
            }
        } catch (error) {
            console.error('사용자 업데이트 중 오류 발생:', error);
        }
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const filteredUsers = users.filter(user =>
        user.userNickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const renderTable = () => {
        return (
            <table>
                <thead>
                    <tr>
                        <th>프로필 사진</th>
                        <th>닉네임</th>
                        <th>이름</th>
                        <th>아이디</th>
                        <th>레벨</th>
                        <th>비밀번호</th>
                        <th>수정</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map(user => (
                        <tr key={user.userId}>
                            <td>
                                {user.userImage && (
                                    <img
                                        src={`data:image/jpeg;base64,${user.userImage}`}
                                        alt="프로필 이미지"
                                        style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                                    />
                                )}
                            </td>
                            <td>{user.userNickname}</td>
                            <td>{user.userName}</td>
                            <td>{user.userId}</td>
                            <td>{user.userLevel}</td>
                            <td>{user.userPassword}</td>
                            <td>
                                <button onClick={() => handleEditUser(user)}>수정</button>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteUser(user.userId)}>삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderEditForm = () => {
        return (
            <form onSubmit={handleUpdateUser}>
                <h3>사용자 정보 수정</h3>
                <label>
                    닉네임:
                    <input
                        type="text"
                        name="userNickname"
                        value={editUser.userNickname}
                        onChange={handleChange}
                    />
                </label><br />
                <label>
                    이름:
                    <input
                        type="text"
                        name="userName"
                        value={editUser.userName}
                        onChange={handleChange}
                    />
                </label><br />
                <label>
                    아이디:
                    <input
                        type="text"
                        name="userId"
                        value={editUser.userId}
                        disabled
                    />
                </label><br />
                <label>
                    레벨 (1-4):
                    <input
                        type="number"
                        name="userLevel"
                        value={editUser.userLevel}
                        onChange={handleChange}
                        min="1"
                        max="4"
                    />
                </label><br />
                <label>
                    비밀번호:
                    <input
                        type="text"
                        name="userPassword"
                        value={editUser.userPassword}
                        onChange={handleChange}
                    />
                </label><br />
                <button type="submit">저장</button>
                <button onClick={() => setEditUser(null)}>취소</button>
            </form>
        );
    };

    return (
        <div>
            <h2>사용자 관리</h2>
            <input
                type="text"
                placeholder="닉네임, 이름 또는 아이디 검색"
                value={searchTerm}
                onChange={handleSearch}
            />
            {editUser ? renderEditForm() : renderTable()}
            <div>
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    이전
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button key={index + 1} onClick={() => setCurrentPage(index + 1)} disabled={currentPage === index + 1}>
                        {index + 1}
                    </button>
                ))}
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    다음
                </button>
            </div>
        </div>
    );
}

export default UserManagement;
