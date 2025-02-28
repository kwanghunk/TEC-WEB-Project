import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/FuncAxios";
import { Container, Row, Col, Card, Button, Form, ListGroup, Alert } from "react-bootstrap";
import ReplyList from "../../../utils/ReplyList";
import { handleReplyDelete, handleReplySubmit, handleReplyUpdate, handleStatusUpdate } from "../../../utils/ReplyUtils";

function AdminSupportDetail() {
  const [inquiry, setInquiry] = useState(null); // 문의 정보
  const [reply, setReply] = useState(""); // 새 답글 입력 상태
  const location = useLocation();
  const navigate = useNavigate(); 
   
  const inquiryNo = new URLSearchParams(location.search).get("inquiryNo");
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
    COMPLETED: "완료",
  };
  const ADMIN = "ROLE_ADMIN";
  const user = sessionStorage.getItem("user");
  const currentUser = JSON.parse(user)?.username;
  const userRole = JSON.parse(user)?.userType;  

  // 유틸리티 함수: 날짜 포맷터
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString); // 문자열을 Date 객체로 변환
    const formattedDate = date.toISOString().split('T')[0]; // 날짜 부분 추출
    const formattedTime = date.toTimeString().slice(0, 5); // 시간 부분 추출
    return `${formattedDate} ${formattedTime}`;
  }

  const fetchInquiryDetail = async () => {
    try {
      const response = await axiosInstance.get(`/admin/support/${inquiryNo}`, { withCredentials: true });
      console.log("API 응답 데이터:", response.data); // 응답 확인
    
      setInquiry(response.data);
    } catch (e) {
      console.error("문의내역 상세조회 실패: ", e);
      alert("문의내역 조회에 실패했습니다.");
    }
  }

  // fetchInquiryDetail 변경될 때 호출
  useEffect(() => {
    if (userRole !== ADMIN) {
      alert("권한이 없습니다.");
      navigate("/");
      return;
    }
      fetchInquiryDetail();
  }, []);

  // 목록으로 돌아가기
  const handleBack = () => {
    if (reply.trim().length > 0) {
      const confirm = window.confirm("작성 중인 내용이 삭제됩니다.\n돌아가시겠습니까?");
      if (!confirm) return;
    }
    navigate("/AdminSupportList");
  };

  return (
    <Container className="adminSupportDetail-container mt-4">
      {inquiry ? (
        <>
          {/* 문의 정보 */}
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="mb-3 p-3">
                <Card.Title className="text-center">
                  <Row>
                    <Col className="text-start">
                      <strong>[{STATUS_LABELS[inquiry.status]}] </strong>[{CATEGORY_LABELS[inquiry.category]}] {inquiry.title}
                    </Col>
                    <Col className="text-end">
                    {formatDateTime(inquiry.modifiedDate || inquiry.createdDate)}
                    </Col>
                  </Row>
                  <Row>
                    <Col className="text-start">{inquiry.username}</Col>
                  </Row>
                  <hr />
                </Card.Title>
                <Card.Body className="justify-content text-start">
                  <p>{inquiry.content}</p>
                </Card.Body>
              </Card>

              {/* 답변 입력 */}
              <Card className="mb-3 p-3">
                <Card.Title>관리자 답변 작성</Card.Title>
                <Card.Body>
                  <Form onSubmit={(e) => {
                      e.preventDefault();
                      handleReplySubmit(inquiryNo, null, reply, fetchInquiryDetail, setReply);
                    }}
                  >
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="답변을 입력하세요."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      required
                    />
                    <div className="d-flex justify-content-end mt-2">
                      <Button variant="primary" type="submit">답변 등록</Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              {/* 답변 목록 */}
              <Card className="mb-3 p-3">
                <Card.Title>답변 목록</Card.Title>
                <Card.Body>
                  <ListGroup>
                    <ReplyList
                      replies={inquiry.replies || []}
                      currentUser={currentUser}
                      handleReplySubmit={(parentInquiryNo, replyContent) =>
                        handleReplySubmit(inquiryNo, parentInquiryNo, replyContent, fetchInquiryDetail, setReply)
                      }
                      handleReplyUpdate={(replyNo, updatedContent) =>
                        handleReplyUpdate(replyNo, updatedContent, fetchInquiryDetail)
                      }
                      handleReplyDelete={(replyNo) =>
                        handleReplyDelete(replyNo, fetchInquiryDetail)
                      }
                    />
                  </ListGroup>
                </Card.Body>
              </Card>

              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleBack}>목록</Button>
                <Button variant="success" onClick={() => handleStatusUpdate(inquiryNo, fetchInquiryDetail)} disabled={STATUS_LABELS[inquiry.status] === "완료" ? true : false}>문의 완료 처리</Button>
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <Alert variant="danger">{"문의 내용을 불러올 수 없습니다."}</Alert>
      )}
    </Container>
  );
}

export default AdminSupportDetail;