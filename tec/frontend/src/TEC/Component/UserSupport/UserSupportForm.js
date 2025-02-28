import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/FuncAxios";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";

function UserSupportForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUsername(JSON.parse(userData).username);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    const confirmed = window.confirm("등록하시겠습니까?");
    if (!confirmed) return;
    if (!title.trim() || !content.trim()) {
      alert("내용을 작성하세요.");
      return;
    }

    try {
      await axiosInstance.post(
        "/api/user-support",
        { category, title, content },
        { withCredentials: true }
      );
      alert("문의가 성공적으로 등록되었습니다.");
      navigate("/UserSupportList"); // 리스트 페이지로 이동
    } catch (e) {
      console.error("문의 등록 실패: ", e);
      setErrorMessage("문의 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancel = () => {
    const confirmed = window.confirm("취소하시겠습니까?");
    if (confirmed) navigate("/UserSupportList"); 
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
  };
  /* 
  <Button className="history-btn" onClick={handleSearch}
    style={customStyles.buttonPrimary}
    onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
    onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
  >검색</Button> 
  */
  return (
    <Container className="userSupportList-container">
      <Row className="mb-3">
        <Col>
          <h2 className="userSupport-title text-center">1:1 문의 작성</h2>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>회원 ID</Form.Label>
                <Form.Control type="text" value={username} readOnly />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>카테고리</Form.Label>
                <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="GENERAL">일반 문의</option>
                  <option value="PAYMENT">결제/환불 문의</option>
                  <option value="ACCOUNT_SUPPORT">계정 문의</option>
                  <option value="TECH_SUPPORT">기술 지원</option>
                  <option value="FEEDBACK">제안 및 피드백</option>
                  <option value="OTHER">기타</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>제목</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="제목을 입력하세요."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>문의 내용</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="문의 내용을 입력하세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </Form.Group>

              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            </Form>
          </Card>
        </Col>
      </Row>
      
      <Row className="justify-content-center">
        <Col>
          <Button className="supportForm-btn" onClick={handleSubmit}
            style={customStyles.buttonPrimary}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
          >작성하기</Button> 
        </Col>
        <Col className="supportForm-btn">
          <Button variant="secondary" onClick={handleCancel}>뒤로가기</Button>
        </Col>
      </Row>

      </Container>
  )
}
export default UserSupportForm;