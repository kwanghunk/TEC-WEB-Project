import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import "./MyPage.css";

const MyPageDashboard = ({ setActiveTab }) => {
  return (
    <Row className="mypage-dashboard">
      <Col md={6}>
        <Card className="mypage-card" onClick={() => setActiveTab("profile")}>
          <Card.Body><h5>회원정보 관리</h5></Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="mypage-card" onClick={() => setActiveTab("history")}>
          <Card.Body><h5>히스토리 관리</h5></Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="mypage-card" onClick={() => setActiveTab("settings")}>
          <Card.Body><h5>환경설정</h5></Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="mypage-card" onClick={() => setActiveTab("delete")}>
          <Card.Body><h5>회원탈퇴</h5></Card.Body>
        </Card>
      </Col>
    </Row>

  )
}

export default MyPageDashboard;