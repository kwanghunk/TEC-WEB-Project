import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/FuncAxios";
import { Button, Col, Container, Form, ListGroup, Pagination, Row } from "react-bootstrap";
import "../Styles/History.css";

const History = ({ setActiveTab, setSelectedHistoryId }) => {
  const [historyList, setHistoryList] = useState([]);
  const [searchType, setSearchType] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async () => {
    try {
      const response = await axiosInstance.get("/api/history/load", {
        params: { page, size, searchType, keyword: searchQuery } }, { 
        withCredential: true 
      });
      console.log("히스토리 전체 응답: ", response);  // 전체 응답 구조 확인
      console.log("히스토리 조회: ", response.data);  // data 내부 확인
  
      setHistoryList(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (e) {
      console.error("API 요청 실패: ", e);
      if (e.response && e.response.status === 401) {
        alert("로그인이 필요한 기능입니다.");
      } else {
        alert("요청 실패: " + (e.response?.data?.message || "히스토리 조회 중 오류가 발생했습니다."));
      }
    }
  };

  useEffect(() => {
    fetchHistory();
    if (!setSelectedHistoryId) {
      console.error("setSelectedHistoryId is not defined!");
    }
  }, [page, size, setSelectedHistoryId]);

  const handleSearch = () => {
    setPage(1);
    fetchHistory();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSearchType("title");
    setPage(1);
    fetchHistory();
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString); // 문자열을 Date 객체로 변환
    const formattedDate = date.toISOString().split('T')[0]; // 날짜 부분 추출
    const formattedTime = date.toTimeString().slice(0, 5); // 시간 부분 추출
    return `${formattedDate} ${formattedTime}`;
}

  return (
    <Container className="history-container">
      <Row className="history-header">
        <Col>
          <h5>히스토리 목록</h5>
        </Col>
      </Row>
      <Row>
        <Col className="text-end">
          <Form.Select value={size} onChange={(e) => setSize(Number(e.target.value))}>
            <option value="5">5개씩</option>
            <option value="10">10개씩</option>
            <option value="20">20개씩</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="history-search">
        <Col md={3}>
          <Form.Select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="all">제목+내용</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="검색어 입력"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Button className="history-btn" onClick={handleSearch}
            style={customStyles.buttonPrimary}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
          >검색</Button> 
        </Col>
      </Row>

      <ListGroup className="history-list">
        {historyList && historyList.length > 0 ? (
          historyList.map((history, index) => (
            <ListGroup.Item 
              key={history.saveHistoryNo} 
              action 
              onClick={() => {
                if (typeof setSelectedHistoryId === "function") {
                  setSelectedHistoryId(history.saveHistoryNo);
                  setActiveTab("historyDetail"); // 🔹 이동 처리
                } else {
                  console.error("setSelectedHistoryId is not a function");
                }
              }}
            >
              <Row className="align-items-center text-center">  
                <Col xs={2} className="text-start">{index + 1 + page * size}</Col>  {/* 왼쪽 정렬 */}
                <Col xs={8} className="text-center">{history.historyTitle}</Col>  {/* 가운데 정렬 */}
                <Col xs={2} className="text-end">{formatDateTime(history.saveTime)}</Col>  {/* 오른쪽 정렬 */}
              </Row>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>조회된 히스토리가 없습니다.</ListGroup.Item>
        )}
      </ListGroup>

      <Pagination className="history-pagination">
        {[...Array(totalPages).keys()].map((num) => (
          <Pagination.Item key={num} active={num === page} onClick={() => handlePageChange(num)}>
            {num + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      <Row className="history-actions">
        <Col>
          <Button className="history-btn" onClick={handleReset}
            style={customStyles.buttonPrimary}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
          >초기화</Button> 
        </Col>
        <Col className="history-btn">
          <Button variant="secondary" onClick={() => setActiveTab(null)}>뒤로가기</Button>
        </Col>
      </Row>
    </Container>
  )
}

export default History;