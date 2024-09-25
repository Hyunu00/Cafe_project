import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EditProfile({ user }) {
    const [nickname, setNickname] = useState(user ? user.userNickname : '');
    const [name, setName] = useState(user ? user.userName : '');
    const [userId] = useState(user ? user.userId : ''); 
    const [userLevel] = useState(user ? user.userLevel : 1);  
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    const navigate = useNavigate();

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const formData = new FormData();
        formData.append('userNickname', nickname);
        formData.append('userName', name);
        formData.append('userPassword', password);
        formData.append('profileImage', profileImage);
        formData.append('userLevel', userLevel); 

        try {
            const response = await fetch(`http://localhost:8080/users/${userId}`, {
                method: 'PUT',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                alert('프로필이 업데이트되었습니다.');
                navigate('/');
            } else {
                alert('업데이트 실패');
            }
        } catch (error) {
            console.error('업데이트 에러:', error);
        }
    };

    const handleImageChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    return (
        <div>
            <h2>프로필 수정</h2>
            <form onSubmit={handleUpdate}>
                <label>프로필 사진:</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                /><br />

                <label>닉네임:</label>
                <input 
                    type="text" 
                    value={nickname} 
                    onChange={(e) => setNickname(e.target.value)} 
                    required
                /><br />

                <label>이름:</label>
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required
                /><br />

                <label>아이디:</label>
                <input 
                    type="text" 
                    value={userId} 
                    disabled
                /><br />

                <label>레벨:</label>  
                <input 
                    type="text" 
                    value={userLevel} 
                    disabled
                /><br />

                <label>비밀번호:</label>
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                /><br />

                <label>비밀번호 확인:</label>
                <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required
                /><br />

                <button type="submit">수정하기</button>
            </form>
        </div>
    );
}

export default EditProfile;
