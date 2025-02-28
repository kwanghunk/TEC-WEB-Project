import { ListGroup, Button, Row, Col, Form } from "react-bootstrap";
import { useState } from "react";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import "../Styles/ReplyList.css";

function ReplyList({ replies, currentUser, depth = 0, handleReplySubmit, handleReplyUpdate, handleReplyDelete }) {
  const [replyTo, setReplyTo] = useState(null);  // 현재 답변을 달 대상
  const [replyContent, setReplyContent] = useState("");  // 입력된 답변 내용
  const [editReplyId, setEditReplyId] = useState(null);  // 현재 수정 중인 답변 ID
  const [editContent, setEditContent] = useState("");  // 수정할 내용
  const ADMIN_ID = "admin0101";

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString); // 문자열을 Date 객체로 변환
    const formattedDate = date.toISOString().split('T')[0]; // 날짜 부분 추출
    const formattedTime = date.toTimeString().slice(0, 5); // 시간 부분 추출
    return `${formattedDate} ${formattedTime}`;
  }

  return replies.map((replyItem) => (
    <div key={replyItem.inquiryNo} style={{ marginLeft: `${Math.min(depth * 20, 20)}px` }}>
      <ListGroup.Item className="py-2 w-100 reply-container">
        <div>
          <Row className="align-items-center w-100 py-2">
            <Col xs={7} className="d-flex align-items-center">
              <MdOutlineSubdirectoryArrowRight className="me-2" />
              <strong>{replyItem.username === ADMIN_ID ? "관리자" : replyItem.username}</strong>
              <span className="ms-2 text-muted" style={{ fontSize: "0.9rem" }}>
                ({replyItem.modifiedDate ? formatDateTime(replyItem.modifiedDate) : formatDateTime(replyItem.createdDate)})
              </span>
            </Col>
            <Col xs={5} className="text-end">
              {replyItem.username === currentUser && (
                <div className="d-flex justify-content-end align-items-center gap-2">
                  <Button size="sm" onClick={() => setReplyTo(replyItem.inquiryNo)}>답변</Button>
                  <Button size="sm" variant="warning" onClick={() => {
                    setEditReplyId(replyItem.inquiryNo);
                    setEditContent(replyItem.content);
                  }}>수정</Button>
                  <Button size="sm" variant="danger" onClick={() => handleReplyDelete(replyItem.inquiryNo)}>삭제</Button>
                </div>
              )}
            </Col>
          </Row>

          {editReplyId === replyItem.inquiryNo ? (
            // 수정 모드 (답변을 수정하는 입력창)
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                handleReplyUpdate(replyItem.inquiryNo, editContent);
                setEditReplyId(null);  // 수정 완료 후 초기화
              }}
            >
              <Form.Control
                as="textarea"
                rows={2}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
              />
              <div className="d-flex justify-content-end mt-2">
                <Button variant="primary" type="submit">수정 완료</Button>
                <Button variant="secondary" onClick={() => setEditReplyId(null)}>취소</Button>
              </div>
            </Form>
          ) : (
            // 기본 답변 내용
            <Row className="w-100 reply-content-row">
              <Col xs={12} className="text-start ms-3 reply-content">
                {replyItem.content}
              </Col>
            </Row>
          )}
        </div>
      </ListGroup.Item>

      {/* 답변 버튼 클릭 시 답변 입력 폼 표시 */}
      {replyTo === replyItem.inquiryNo && (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleReplySubmit(replyItem.inquiryNo, replyContent);  // 부모 inquiryNo 전달
            setReplyContent("");  // 입력 필드 초기화
            setReplyTo(null);  // 폼 닫기
          }}
          style={{ marginLeft: `${Math.min((depth + 1) * 20, 20)}px` }}
        >
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="답변을 입력하세요."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            required
          />
          <div className="d-flex justify-content-end mt-2">
            <Button variant="primary" type="submit">답변 등록</Button>
            <Button variant="secondary" onClick={() => setReplyTo(null)}>취소</Button>
          </div>
        </Form>
      )}

      {/* 자식 답변 재귀 호출 */}
      {replyItem.replies && replyItem.replies.length > 0 && (
        <ReplyList
          replies={replyItem.replies}
          currentUser={currentUser}
          depth={depth + 1}
          handleReplySubmit={handleReplySubmit}
          handleReplyUpdate={handleReplyUpdate}
          handleReplyDelete={handleReplyDelete}
        />
      )}
    </div>
  ));
}

export default ReplyList;
