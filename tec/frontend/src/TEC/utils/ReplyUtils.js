import axiosInstance from "./FuncAxios";

// (공통) 문의 답변 등록
export const handleReplySubmit = async (inquiryNo, parentInquiryNo, replyContent, fetchInquiryDetail, setReply) => {
  if (!window.confirm("답변을 등록하시겠습니까?")) return;

  if (!inquiryNo) {
    console.error("❌ 잘못된 inquiryNo 값: ", inquiryNo);
    alert("올바르지 않은 문의 번호입니다.");
    return;
  }

  console.log("🔹 handleReplySubmit 호출됨");
  console.log("📌 inquiryNo:", inquiryNo);
  console.log("📌 parentInquiryNo:", parentInquiryNo);
  console.log("📌 replyContent:", replyContent);

  try {
    await axiosInstance.post(`/api/user-support/${inquiryNo}/reply`,
      { reply: replyContent, parentInquiry: parentInquiryNo || null },
      { withCredentials: true }
    );
    alert("답변이 등록되었습니다.");
    setReply(""); // 입력 필드 초기화
    setTimeout(fetchInquiryDetail, 100); // 데이터 새로고침
  } catch (e) {
    console.error("답변 등록 실패:", e);
    alert("답변 등록에 실패했습니다.");
  }
};

export const handleReplyUpdate = async (replyNo, updatedContent, fetchInquiryDetail) => {
  if (!window.confirm("답변을 수정하시겠습니까?")) return;

  try {
    await axiosInstance.put(`/api/user-support/${replyNo}/edit`, { reply: updatedContent }, { withCredentials: true });
    alert("답변이 수정되었습니다.");
    fetchInquiryDetail(); // 데이터 새로고침
  } catch (e) {
    console.error("답변 수정 실패:", e);
    alert("답변 수정에 실패했습니다.");
  }
};

export const handleReplyDelete = async (replyNo, fetchInquiryDetail) => {
  if (!window.confirm("답변을 삭제하시겠습니까?")) return;

  try {
    await axiosInstance.delete(`/api/user-support/${replyNo}/delete`, { withCredentials: true });
    alert("답변이 삭제되었습니다.");
    fetchInquiryDetail(); // 데이터 새로고침
  } catch (e) {
    console.error("답변 삭제 실패:", e);
    alert("답변 삭제에 실패했습니다.");
  }
};

export const handleStatusUpdate = async  (inquiryNo, fetchInquiryDetail) => {
  if (!window.confirm("해당 문의를 완료 처리하시겠습니까?")) return;

  try {
    await axiosInstance.put(`/api/user-support/${inquiryNo}/complete`, {}, { withCredentials: true });
    alert("문의 상태가 '완료'로 변경되었습니다.");
    fetchInquiryDetail(); // 데이터 새로고침
  } catch (e) {
    console.error("문의 상태 업데이트 실패:", e);
    alert("문의 상태 변경에 실패했습니다.");
  }
};