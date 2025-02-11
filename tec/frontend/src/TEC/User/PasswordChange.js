import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PasswordChange = () => {
  // 비밀번호 입력 상태 관리
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 성공 메시지 관리
  const [showSuccess, setShowSuccess] = useState(false);
  // 로딩 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  // 페이지 이동을 위한 useNavigate 훅
  const navigate = useNavigate();
  // 사용자 ID를 로컬 스토리지에서 가져오기
  const username = localStorage.getItem("username");

  // 입력값 변경 시 상태 업데이트
  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // 비밀번호 변경 처리
  const handleSubmit = async (event) => {
    event.preventDefault();

    // 새 비밀번호와 확인 비밀번호가 일치하는지 확인
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setIsLoading(true); // 로딩 상태 활성화

    try {
      // 서버로 비밀번호 변경 요청
      const response = await axios.put(`/user/changePassword/${username}`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });

      console.log("비밀번호 변경 성공:", response.data);

      setShowSuccess(true); // 성공 메시지 표시
      setIsLoading(false); // 로딩 상태 비활성화
      localStorage.clear(); // 비밀번호 변경 후 로컬 스토리지 삭제
      window.alert("비밀번호 변경이 완료되었습니다.");
      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error("비밀번호 변경 중 오류 발생:", error);
      alert("현재 비밀번호가 일치하지 않습니다.");
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  // 취소 버튼 처리
  const handleCancel = () => {
    navigate("/User/MyPage");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>비밀번호 변경</h2>

        {/* 현재 비밀번호 */}
        <div>
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            type="password"
            name="currentPassword"
            id="currentPassword"
            value={passwords.currentPassword}
            placeholder="현재 비밀번호를 입력하세요."
            onChange={handleChange}
            required
          />
        </div>

        {/* 새 비밀번호 */}
        <div>
          <label htmlFor="newPassword">새 비밀번호</label>
          <input
            type="password"
            name="newPassword"
            id="newPassword"
            value={passwords.newPassword}
            placeholder="새 비밀번호를 입력하세요."
            onChange={handleChange}
            required
          />
        </div>

        {/* 새 비밀번호 확인 */}
        <div>
          <label htmlFor="confirmPassword">새 비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            value={passwords.confirmPassword}
            placeholder="새 비밀번호를 다시 입력하세요."
            onChange={handleChange}
            required
          />
        </div>

        {/* 성공 메시지 */}
        {showSuccess && <p>비밀번호가 성공적으로 변경되었습니다.</p>}

        {/* 변경 버튼 */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "저장중..." : "변경"}
        </button>

        {/* 취소 버튼 */}
        <button type="button" onClick={handleCancel}>
          취소
        </button>
      </form>
    </div>
  );
};

export default PasswordChange;
