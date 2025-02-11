import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignUp.css"; // 스타일 분리
import axiosInstance from "../../utils/FuncAxios";

const TestSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    ssnFirst: "",
    ssnSecond: ""
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [passwordMatchMessage, setPasswordMatchMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone"
        ? value
            .replace(/[^0-9]/g, "")
            .slice(0, 11)
            .replace(/^(\d{3})(\d{0,4})?(\d{0,4})?$/, (match, p1, p2, p3) =>
              [p1, p2, p3].filter(Boolean).join("-")
            )
        : value,
    }));

    if (name === "username") setIdCheckMessage("");
    if (name === "email") setEmailCheckMessage("");

    if (name === "password" || name === "confirmPassword") {
      if (formData.password !== value && name === "confirmPassword") {
        setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
      } else if (name === "password" && value !== formData.confirmPassword) {
        setPasswordMatchMessage("비밀번호가 일치하지 않습니다.");
      } else {
        setPasswordMatchMessage("비밀번호가 일치합니다.");
      }
    }
  };

  const handleIdCheck = async () => {
    if (!formData.username.trim()) {
      setIdCheckMessage("아이디를 입력해 주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("/user/check-id", { username: formData.username });

      setIdCheckMessage(data === "사용 가능한 아이디입니다." ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.");
    } catch (error) {
      setIdCheckMessage("아이디 중복 확인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailCheck = async () => {
    if (!formData.email.trim()) {
      setEmailCheckMessage("이메일을 입력해 주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("/user/check-email", { email: formData.email });

      setEmailCheckMessage(data === "사용 가능한 이메일입니다." ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.");
    } catch (error) {
      setEmailCheckMessage("이메일 중복 확인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (idCheckMessage !== "사용 가능한 아이디입니다.") {
      setMessage("아이디 중복확인을 해주세요.");
      return;
    }

    if (emailCheckMessage !== "사용 가능한 이메일입니다.") {
      setMessage("이메일 중복확인을 해주세요.");
      return;
    }

    if (passwordMatchMessage !== "비밀번호가 일치합니다.") {
      setMessage("비밀번호를 확인해 주세요.");
      return;
    }

    if (!/^\d{6}$/.test(formData.ssnFirst) || !/^\d{7}$/.test(formData.ssnSecond)) {
      setMessage("유효한 주민등록번호를 입력하세요.");
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.post("/user/signup", formData);

      setMessage("회원가입이 성공적으로 완료되었습니다.");
      setTimeout(() => navigate("/User/TestLogin"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="signup-container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs={12} md={6} lg={5}>
          <Card className="signup-card shadow">
            <Card.Body>
              <h2 className="text-center mb-3">회원가입</h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>이름</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>아이디</Form.Label>
                  <div className="d-flex">
                    <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                    <Button variant="outline-secondary" onClick={handleIdCheck} disabled={isLoading}>중복 확인</Button>
                  </div>
                  {idCheckMessage && <p className={`text-${idCheckMessage.includes("가능") ? "success" : "danger"}`}>{idCheckMessage}</p>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <div className="d-flex">
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                    <Button variant="outline-secondary" onClick={handleEmailCheck} disabled={isLoading}>중복 확인</Button>
                  </div>
                  {emailCheckMessage && <p className={`text-${emailCheckMessage.includes("가능") ? "success" : "danger"}`}>{emailCheckMessage}</p>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>비밀번호 확인</Form.Label>
                  <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                  {passwordMatchMessage && <p className={`text-${passwordMatchMessage.includes("일치합니다") ? "success" : "danger"}`}>{passwordMatchMessage}</p>}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>주민등록번호</Form.Label>
                  <Row>
                    <Col xs={5}>
                      <Form.Control type="text" name="ssnFirst" value={formData.ssnFirst} onChange={handleChange} maxLength="6" required placeholder="앞 6자리" />
                    </Col>
                    <Col xs="auto" className="d-flex align-items-center">
                      <span className="h4">-</span>
                    </Col>
                    <Col xs={5}>
                      <Form.Control type="password" name="ssnSecond" value={formData.ssnSecond} onChange={handleChange} maxLength="7" required placeholder="뒤 7자리" />
                    </Col>
                  </Row>
                </Form.Group>

                {message && <p className={`text-${message.includes("성공") ? "success" : "danger"}`}>{message}</p>}

                <Button type="submit" variant="primary" className="w-100" disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" /> : "회원가입"}
                </Button>
                <Button variant="secondary" className="w-100 mt-2" onClick={() => navigate("/Login")}>
                  뒤로가기
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TestSignUp;