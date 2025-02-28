import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import axiosInstance from "../../../utils/FuncAxios";
import React, { useEffect, useState } from "react";
import "../Styles/Profile.css";

const Profile = ({ setActiveTab }) => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    createDate: "",
    ssnFirst: ""
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    handleUserInfo();
  }, []);

  // 회원정보 조회
  const handleUserInfo = async () => {
    try {
      const response = await axiosInstance.get(`/user/profile`, { withCredentials: true })
      console.log("회원정보: ", response.data);
      setUserInfo({
        username: response.data.username || "",
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        createDate: response.data.createDate ? response.data.createDate.split("T")[0] : "",
        ssnFirst: response.data.ssnFirst || ""
      })
    } catch (e) {
      console.error("API 요청 실패: ", e);
      if (e.response && e.response.status === 401) {
        alert("로그인이 필요한 기능입니다.");
      } else {
        alert("요청 실패: " + (e.response?.data?.message || "회원정보 조회 중 오류가 발생했습니다."));
      }
    }
  }

  // 회원정보 변경
  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put("/user/profile/update", {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone
      }, { withCredentials: true });
      alert(response.data || "회원정보가 수정되었습니다.");
    } catch (e) {
      console.error("API 요청 실패: ", e);
      if (e.response && e.response.status === 401) {
        alert("로그인이 필요한 기능입니다.");
      } else {
        alert("요청 실패: " + (e.response?.data?.message || "회원정보 수정 중 오류가 발생했습니다."));
      }
    }
  };
  // 입력값 변경 시 상태 업데이트
  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // 비밀번호 변경 핸들러
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("변경할 비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      const response = await axiosInstance.put(`/user/profile/changePassword`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      }, { withCredentials: true });

      alert(response.data || "비밀번호가 성공적으로 변경되었습니다.");
      setShowPasswordModal(false);
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e) {
      console.error("API 요청 실패: ", e);
      if (e.response && e.response.status === 401) {
        alert("로그인이 필요한 기능입니다.");
      } else {
        alert("요청 실패: " + (e.response?.data?.message || "회원정보 조회 중 오류가 발생했습니다."));
      }
    }
  }

  const customStyles = {
    buttonPrimary: {
      backgroundColor: "#6841EA",
      color: "white",
      border: "none",
      fontSize: "16px",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    }
  }

  return (
    <Container className="profile-container">
      <Card className="profile-card">
        <Card.Title>
          <h5 className="card-title text-center">회원정보 관리</h5>
        </Card.Title>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>아이디</Form.Label>
              <Form.Control type="text" value={userInfo.username} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>이름</Form.Label>
              <Form.Control type="text" name="name" value={userInfo.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>비밀번호</Form.Label>
                <Button className="profile-btn" onClick={() => {setShowPasswordModal(true)}}
                  style={customStyles.buttonPrimary}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
                >비밀번호 변경</Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>이메일</Form.Label>
              <Form.Control type="email" name="email" value={userInfo.email} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>연락처</Form.Label>
              <Form.Control type="text" name="phone" value={userInfo.phone} onChange={handleChange} />
            </Form.Group>
            

            <Form.Group className="mb-3">
              <Form.Label>주민등록번호</Form.Label>
              <Form.Control type="text" value={`${userInfo.ssnFirst}-*******`} disabled />
            </Form.Group>
          

            <Form.Group className="mb-3">
              <Form.Label>가입일</Form.Label>
              <Form.Control type="text" value={userInfo.createDate} disabled />
            </Form.Group>

            <Row className="mt-4">
              <Col>
                <Button className="profile-btn" onClick={handleSaveChanges}
                  style={customStyles.buttonPrimary}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
                >저장하기</Button>   
              </Col>
              <Col>
                <Button variant="secondary" onClick={() => setActiveTab(null)}>
                  뒤로가기
                </Button>
              </Col>
            </Row>
            </Form>
        </Card.Body>
      </Card>

      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>비밀번호 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>현재 비밀번호</Form.Label>
              <Form.Control
                type="password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="현재 비밀번호 입력"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>새 비밀번호</Form.Label>
              <Form.Control
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="새 비밀번호 입력"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>새 비밀번호 확인</Form.Label>
              <Form.Control
                type="password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="새 비밀번호 확인"
              />
            </Form.Group>
            <Button className="profile-btn" onClick={handleChangePassword}
                  style={customStyles.buttonPrimary}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
                >변경하기</Button> 
          </Form>
        </Modal.Body>
      </Modal>
    </Container>

  )
}

export default Profile;