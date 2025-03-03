import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import "./Login.css";
import axiosInstance, { setAccessToken } from "../../utils/FuncAxios";
import { fetchUserIpStatus } from "../../utils/Ip";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hisotorys, setHistorys] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.username.trim() || !formData.password.trim()) {
      setMessage("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/user/login", formData, { withCredentials: true });
      
      console.log("[Login.js] 로그인 성공 - Access Token 수신:", response.data.accessToken);

      // Access Token을 FuncAxios.js에 설정
      setAccessToken(response.data.accessToken);
    
      // 로그인 정보 저장
      const userData = { username: response.data.username, userType: response.data.userType};
      setUser(userData); // 사용자 정보 저장
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("accessToken", response.data.accessToken);

      // 로그인 성공 후 IP 및 회원 정보 최신화
      await fetchUserIpStatus();

      sessionStorage.removeItem("translationHistory");
      setHistorys([]);
      setMessage("로그인에 성공했습니다!");
      setTimeout(() => navigate("/"), 2000);
    } catch (e) {
      setMessage(e.response?.data || "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="login-container">
      <Row className="justify-content-center align-items-center vh-100">
        <Col xs={12} md={6} lg={4}>
          <Card className="login-card shadow">
            <Card.Body>
              <h2 className="text-center mb-3">로그인</h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>아이디</Form.Label>
                  <Form.Control type="text" name="username" value={formData.username} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                </Form.Group>

                {message && <p className={`text-${message.includes("성공") ? "success" : "danger"}`}>{message}</p>}

                <Button type="submit" variant="primary" className="w-100" disabled={isLoading}>
                  {isLoading ? <Spinner animation="border" size="sm" /> : "로그인"}
                </Button>

                <Button variant="secondary" className="w-100 mt-2" onClick={() => navigate("/SignUp")}>
                  회원가입
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;