import React from "react";
import { Nav } from "react-bootstrap";
import "./MyPage.css";

const MyPageNav =({ setActiveTab }) => {
  return (
    <Nav className="mypage-nav">
      <Nav.Item>
        <Nav.Link onClick={() => setActiveTab("profile")}>회원정보 관리</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => setActiveTab("history")}>히스토리 관리</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => setActiveTab("settings")}>환경설정</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => setActiveTab("delete")}>회원탈퇴</Nav.Link>
      </Nav.Item>
    </Nav>
  )
}

export default MyPageNav;