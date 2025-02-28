import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Styles/UserSupportDetail.css";
import axiosInstance from "../../utils/FuncAxios";
import { Alert, Button, Card, Col, Container, Row, Form, ListGroup } from "react-bootstrap";
import { handleReplySubmit, handleReplyUpdate, handleReplyDelete, handleStatusUpdate } from './../../utils/ReplyUtils';
import ReplyList from './../../utils/ReplyList';

function UserSupportDetail() {
  const [inquiry, setInquiry] = useState(null);
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
  const user = sessionStorage.getItem("user");
  const currentUser = JSON.parse(user)?.username;

  const fetchInquiryDetail = async () => {
    try {
      const response = await axiosInstance.get(`/api/user-support/${inquiryNo}`, { withCredentials: true });
      console.log("API 응답 데이터:", response.data); // 응답 확인
      setInquiry(response.data);
    } catch (e) {
      console.error("문의내역 상세조회 실패: ", e);
      alert("문의내역 조회에 실패했습니다.");
    }
  }

  // fetchInquiryDetail 변경될 때 호출
  useEffect(() => {
      fetchInquiryDetail();
  }, [inquiryNo]);
  useEffect(() => {
      if (inquiry && currentUser !== inquiry.username) { // 로그인 아이디와 문의내역 아이디 검증증
        alert("권한이 없습니다.");
        navigate("/");
        return;
      }
  }, [inquiry, currentUser, navigate]);

  const handleDelete = async () => {
    const confirmed = window.confirm("삭제하시겠습니까?");
    if (!confirmed) return;
    try {
      await axiosInstance.delete(`/api/user-support/${inquiryNo}`, { withCredentials: true });
      alert("문의가 삭제되었습니다.");
      navigate("/UserSupportList");
    } catch (e) {
      console.error("문의삭제 실패: ", e);
      alert("삭제에 실패했습니다.");
    }
  }

  const handleBack = () => {
    navigate("/UserSupportList", { state: { inquiries: location.state?.inquiries } });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString); // 문자열을 Date 객체로 변환
    const formattedDate = date.toISOString().split('T')[0]; // 날짜 부분 추출
    const formattedTime = date.toTimeString().slice(0, 5); // 시간 부분 추출
    return `${formattedDate} ${formattedTime}`;
  }

  return (
    <Container className="userSupportDetail-container">
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
                <Card.Title>답변 작성</Card.Title>
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

              <div className="d-flex justify-content-end gap-2">
                <Button variant="warning" onClick={() =>
                  navigate(`/UserSupportEdit?inquiryNo={inquiryNo}`, {
                    state: { inquiry, inquiries: location.state?.inquiries },
                  })
                }>
                  수정
                </Button>
                <Button variant="danger" onClick={handleDelete}>삭제</Button>
                <Button variant="success" 
                  onClick={() => handleStatusUpdate(inquiryNo, fetchInquiryDetail)}
                  disabled={STATUS_LABELS[inquiry.status] === "완료"}
                >
                  문의 완료 처리
                </Button>
                <Button variant="secondary" onClick={handleBack}>목록</Button>
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <Alert variant="danger">문의 내용을 불러올 수 없습니다.</Alert>
      )}
    </Container>
  )
}
export default UserSupportDetail;