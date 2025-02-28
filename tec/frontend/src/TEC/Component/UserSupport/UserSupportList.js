import { useEffect, useState } from "react";
import "./Styles/UserSupportList.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/FuncAxios";
import { Alert, Button, Card, Col, Container, Form, ListGroup, Row } from "react-bootstrap";


function UserSupportList() {
  const navigate = useNavigate();
  const [initialInquiries, setInitialInquiries] = useState([]); // 초기 목록
  const [inquiries, setInquiries] = useState([]); // 문의내역 상태
  const [keyword, setKeyword] = useState(""); // 키워드 상태 추가
  const [errorMessage, setErrorMessage] = useState("");
    

  useEffect(() => {
    // 문의 리스트 조회 API 호출
    const fetchInquiries = async () => {
      try {
        const response = await axiosInstance.get("/api/user-support", { withCredentials: true });
        const activeInquiries = response.data.filter((inquiry) => inquiry.isDeleted === "N"); // 삭제되지 않은 데이터만 표시
        setInitialInquiries(activeInquiries); // 초기 데이터 저장
        setInquiries(activeInquiries); // 현재 데이터에도 초기값 설정
      } catch (e) {
        console.error("문의내역 조회 실패: ", e);
        setErrorMessage("문의내역 조회에 실패했습니다.");
      }
    };
    fetchInquiries();
  }, []); 



  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/api/user-support/search?keyword=${keyword}`, { withCredentials: true });
      setInquiries(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      console.error("문의내역 조회 실패: ", e);
      setErrorMessage("문의내역 조회에 실패했습니다.");
    }
  };

  const handleReset = () => {
    setKeyword("");
    setInquiries(initialInquiries); // 초기 데이터로 복구
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString); // 문자열을 Date 객체로 변환
    const formattedDate = date.toISOString().split('T')[0]; // 날짜 부분 추출
    const formattedTime = date.toTimeString().slice(0, 5); // 시간 부분 추출
    return `${formattedDate} ${formattedTime}`;
  }

  const CATEGORY_LABELS = {
    GENERAL: "일반 문의",
    PAYMENT: "결제/환불 문의",
    ACCOUNT_SUPPORT: "계정 문의",
    TECH_SUPPORT: "기술 지원",
    FEEDBACK: "제안 및 피드백",
    OTHER: "기타"
  };
  const STATUS_LABELS = {
    WAITING: "대기",
    IN_PROGRESS: "진행 중",
    COMPLETED: "완료",
  };
    
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
          <h1 className="userSupport-title text-center">1:1 문의</h1>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={8}>
          <Form.Control
            type="text"
            placeholder="제목의 일부를 입력하세요."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Col>
        <Col md={4} className="d-flex gap-2">
          <Button variant="primary" onClick={handleSearch}>조회</Button>
          <Button variant="secondary" onClick={handleReset}>초기화</Button>
          <Button variant="success" onClick={() => navigate('/UserSupportForm')}>문의하기</Button>
        </Col>
      </Row>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Card>
        <Card.Body>
          {Array.isArray(inquiries) && inquiries.length === 0 ? (
            <p className="text-center">문의 내역이 없습니다.</p>
          ) : (
            <ListGroup>
              {inquiries.map((inquiry, index) => (
                <ListGroup.Item 
                  key={index} 
                  action
                  onClick={() => navigate(`/UserSupportDetail?inquiryNo=${inquiry.inquiryNo}`, { state: { inquiries } })}
                >
                  <Row>
                    <Col md={8}>
                      <strong>[{STATUS_LABELS[inquiry.status]}] </strong>
                      [{CATEGORY_LABELS[inquiry.category]}] {inquiry.title}
                    </Col>
                    <Col mb={4} className="text-end">
                      <strong>작성일: </strong> {formatDateTime(inquiry.createdDate)}
                    </Col>
                  </Row>
                  </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

    </Container>
  )
}

export default UserSupportList;