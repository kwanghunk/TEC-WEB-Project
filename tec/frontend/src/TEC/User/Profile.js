import React, { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    userNo: 0,
    username: "",
    name: "",
    email: "",
    phone: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const storedUserId = localStorage.getItem("username");

  useEffect(() => {
    if (!storedUserId) {
      console.error("사용자 ID가 로컬 스토리지에 저장되어 있지 않습니다.");
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/login";
      return;
    }

    axios
      .get(`/user/profile/${storedUserId}`)
      .then((response) => {
        const data = response.data || {};
        setUserInfo({
          userNo: data.userNo || 0,
          username: data.username || "",
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      })
      .catch((error) => {
        console.error("회원 정보를 가져오는 중 오류 발생:", error);
        alert("회원 정보를 가져오는 데 실패했습니다. 다시 시도해주세요.");
      });
  }, [storedUserId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value || "",
    }));
  };

  const handleSave = () => {
    if (!userInfo.username || !userInfo.name || !userInfo.email || !userInfo.phone) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
  
    setIsSaving(true);
    axios
      .put(`/user/profile/update`, userInfo)
      .then(() => {
        alert("회원 정보가 수정되었습니다.");
  
        if (userInfo.username !== storedUserId) {
          // 변경된 아이디를 로컬 스토리지에 저장
          localStorage.setItem("username", userInfo.username);
          alert("아이디가 변경되었습니다. 다시 로그인해주세요.");
          window.location.href = "/User/Login";
        }
      })
      .catch((error) => {
        console.error("회원 정보를 수정하는 중 오류 발생:", error);
        alert(`회원 정보 수정 실패: ${error.response?.data || "알 수 없는 오류"}`);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };
  

  return (
    <div>
      <h2>회원 정보</h2>
      <div>
        <label>
          아이디:
          <input
            type="text"
            name="username"
            value={userInfo.username || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          이름:
          <input
            type="text"
            name="name"
            value={userInfo.name || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          이메일:
          <input
            type="email"
            name="email"
            value={userInfo.email || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          전화번호:
          <input
            type="text"
            name="phone"
            value={userInfo.phone || ""}
            onChange={handleChange}
          />
        </label>
        <button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
