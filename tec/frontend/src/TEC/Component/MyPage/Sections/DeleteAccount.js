import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { useNavigate, useState } from "react-router-dom";
import axiosInstance from "../../../utils/FuncAxios";
import "../Styles/DeleteAccount.css";

const DeleteAccount = ({ setUser, setActiveTab }) => {
  console.log("🔍 DeleteAccount Props 확인:", setUser, setActiveTab);
  const navigate = useNavigate();

  const handleDelete = () => {
    const confirm = window.confirm("정말로 회원 탈퇴를 하시겠습니까?");
    if (!confirm) {
      alert("DECOBET과 함께 성장해요");
      return;
    }
    try {
      axiosInstance.delete("/user/delete", { withCredentials: true });
      alert("DECOBET은 당신의 성장을 응원합니다");
      setUser(null);
      sessionStorage.clear();
      setActiveTab(null);
      navigate("/");
    } catch (e) {
      console.error("API 요청 실패: ", e.message);
      if (e.response && e.response.status === 401) {
        alert("로그인이 필요한 기능입니다.");
      } else {
        alert("요청 실패: " + (e.response?.data?.message || "회원탈퇴 중 오류가 발생했습니다."));
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
  };

  return (
    <Container className="delete-container">

      <img src="/imgs/logo.png" alt="background" className="delete-bg-img" />
      
      <Card className="delete-card">
        <Card.Title className="delete-card-title">
          DECOBET을 사랑해주셔서 감사합니다.
        </Card.Title>
        <Card.Body>
          <Row className="justify-content-center">
            <Col xs={5}>
              <Button className="delete-btn" onClick={handleDelete}
                style={customStyles.buttonPrimary}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
              >회원탈퇴</Button> 
            </Col>
            <Col xs={5}>
              <Button variant="danger" className="delete-btn" onClick={() => setActiveTab(null)}>
                뒤로가기
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default DeleteAccount;