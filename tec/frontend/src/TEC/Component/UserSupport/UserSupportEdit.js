import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/FuncAxios";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";

function UserSupportEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const inquiry = location.state?.inquiry; // 전달받은 상태
  const [username, setUsername] = useState(""); // 회원 ID
  const [title, setTitle] = useState(inquiry?.title || ""); // 제목
  const [content, setContent] = useState(inquiry?.content || ""); // 내용
  const [category, setCategory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUsername(JSON.parse(userData).username);
    }
  }, []);
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const confirmed = window.confirm("수정하시겠습니까?");
    if (!confirmed) return;

    try {
      await axiosInstance.put(
          `/api/user-support/${inquiry.inquiryNo}`,
          { title, content, category },
          { withCredentials: true }
      );
      alert("문의가 성공적으로 수정되었습니다.");
      navigate(`/UserSupportDetail?inquiryNo=${inquiry.inquiryNo}`, { state: { inquiry: { ...inquiry, title, content, category } } });
    } catch (e) {
      console.error("문의 수정 실패: ", e);
      setErrorMessage("문의 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleCancel = () => {
    const confirmed = window.confirm("취소하시겠습니까?");
    if (confirmed) navigate(`/UserSupportDetail?inquiryNo=${inquiry.inquiryNo}`, { state: { inquiry } });
  };

    return (
        <Container className="userSupportEdit-container">
          <Row className="mb-3">
            <Col>
              <h2 className="userSupport-title text-center">1:1 문의 수정</h2>
            </Col>
          </Row>
          <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4">
            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>회원 ID</Form.Label>
                <Form.Control type="text" value={username} readOnly style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }} />
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

              <div className="d-flex justify-content-between">
                <Button variant="primary" type="submit">수정</Button>
                <Button variant="secondary" onClick={handleCancel}>취소</Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
    )
}
export default UserSupportEdit;