import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Container, Form, ListGroup, Pagination, Row } from "react-bootstrap";
import axiosInstance from "../../../utils/FuncAxios";
import "./Styles/AdminSupportList.css";

function AdminSupportList() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]); // 문의 리스트 상태
  const [searchParams, setSearchParams] = useState({ status: "", category: "", keyword: "" }); // 필터 상태
  const [page, setPage] = useState(0); // 현재 페이지
  const [size, setSize] = useState(10); // 한 페이지당 항목 수
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
  const [errorMessage, setErrorMessage] = useState("");

  const CATEGORY_LABELS = {
    GENERAL: "일반 문의",
    PAYMENT: "결제/환불 문의",
    ACCOUNT_SUPPORT: "계정 문의",
    TECH_SUPPORT: "기술 지원",
    FEEDBACK: "제안 및 피드백",
    OTHER: "기타",
  };
  const STATUS_LABELS = {
    WAITING: "대기",      
    IN_PROGRESS: "진행 중",   
    COMPLETED: "완료"
  }
  const ADMIN = "ROLE_ADMIN";
  const user = sessionStorage.getItem("user");
  const userRole = JSON.parse(user)?.userType;

  // 유틸리티 함수: 날짜 포맷터
  const formatDateTime = (dateString) => {
    const date = new Date(dateString); // 문자열을 Date 객체로 변환
    const formattedDate = date.toISOString().split('T')[0]; // 날짜 부분 추출
    const formattedTime = date.toTimeString().slice(0, 5); // 시간 부분 추출
    return `${formattedDate} ${formattedTime}`;
  }

  // 데이터 가져오기 함수
  const fetchInquiries = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/admin/support", {
        params: { ...searchParams, page, size }, // 필터 + 페이지 상태 전달
        withCredentials: true 
      });
      const { content, totalPages } = response.data;
      setInquiries(content); // 페이지네이션된 데이터(content)
      setTotalPages(totalPages);
    } catch (e) {
      console.error("문의 리스트 조회 실패: ", e);
      setErrorMessage("문의 리스트를 불러오는 데 실패했습니다.");
    }
  }, [searchParams, page, size]);

  // 페이지 또는 필터가 변경될 때 호출
  useEffect(() => {
    if (userRole !== ADMIN) {
      alert("권한이 없습니다.");
      navigate("/");
      return;
    }
    fetchInquiries();
  }, [searchParams, page, size]); 

  // 초기화 버튼 클릭 시
  const handleReset = () => {
    setSearchParams({ status: "", category: "", keyword: "" });
    setErrorMessage("");
    setPage(0);
    setSize(10); // 기본값으로 초기화
    fetchInquiries();
  };

  return (
    <Container className="adminSupportList-all mt-4">
      <Row className="mb-3">
        <Col>
          <h2 className="text-center">관리자 문의</h2>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={1}>
          <Form.Select
            className="text-center"
            value={searchParams.status}
            onChange={(e) => setSearchParams((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="">상태</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select
            className="text-center"
            value={searchParams.category}
            onChange={(e) => setSearchParams((prev) => ({ ...prev, category: e.target.value }))}
          >
            <option value="">전체 카테고리</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col mb={5}>
          <Form.Control
            type="text"
            placeholder="제목의 일부를 입력하세요."
            value={searchParams.keyword}
            onChange={(e) => setSearchParams((prev) => ({ ...prev, keyword: e.target.value }))}
          />
        </Col>
        <Col md={1}>
          <Button variant="secondary" onClick={handleReset}>초기화</Button>
          </Col>
        <Col md={2}>
          <Form.Select value={size} className="text-center" onChange={(e) => setSize(Number(e.target.value))}>
            <option value="10">10개씩</option>
            <option value="20">20개씩</option>
            <option value="50">50개씩</option>
          </Form.Select>
        </Col>
      </Row>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Card>
        <Card.Body>
          {inquiries.length === 0 ? (
            <p className="text-center">문의 내역이 없습니다.</p>
          ) : (
            <ListGroup>
              {inquiries.map((inquiry, index) => (
                <ListGroup.Item
                  key={inquiry.inquiryNo}
                  action
                  onClick={() =>
                    navigate(`/AdminSupportDetail?inquiryNo=${inquiry.inquiryNo}`, { state: { inquiry } })
                  }
                >
                  <Row>
                    <Col md={1}><strong>{index + 1}</strong></Col>
                    <Col md={7}>
                      <strong>[{STATUS_LABELS[inquiry.status]}] </strong>
                      [{CATEGORY_LABELS[inquiry.category]}] {inquiry.title}
                    </Col>
                    <Col md={4} className="text-end">
                      {inquiry.username} <strong> | </strong> {formatDateTime(inquiry.createdDate)}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* 페이지네이션 */}
      <div className="d-flex justify-content-center mt-3">
        <Pagination className="custom-pagination">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item key={i} active={i === page} onClick={() => setPage(i)}>
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </Container>
  );
}

export default AdminSupportList;