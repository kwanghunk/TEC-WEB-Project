import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 버튼 클릭 이벤트 핸들러
  const handleButtonClick = (path) => {
    navigate(path); // 경로로 이동
  };

  return (
    <div>
      <h1>마이페이지</h1>
      <div id="mypage-buttons">
        <button onClick={() => handleButtonClick('/User/savedHistoryList')}>저장한 번역</button>
        <button onClick={() => handleButtonClick('/User/PasswordChange')}>비밀번호 변경</button>
        <button onClick={() => handleButtonClick('/User/Profile')}>회원정보 수정</button>
        <button onClick={() => handleButtonClick('/delete-account')}>회원 탈퇴</button>
      </div>
    </div>
  );
};

export default MyPage;
