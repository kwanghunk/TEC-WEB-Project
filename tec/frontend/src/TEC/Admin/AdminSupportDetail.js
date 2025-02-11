import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AdminSupportDetail() {
    const [inquiry, setInquiry] = useState(null); // 문의 정보
    const [reply, setReply] = useState(""); // 답변 상태 추가
    const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지
    const [update, setUpdate] = useState(false); // 수정 상태
    const location = useLocation();
    const navigate = useNavigate();
    
    
    // 상수 정의
    const inquiryNo = new URLSearchParams(location.search).get("inquiryNo");
    const API_ENDPOINT = `/admin/support/${inquiryNo}`; // API 엔드포인트
    const CATEGORY_LABELS = {
        GENERAL: "일반 문의",
        PAYMENT: "결제/환불 문의",
        ACCOUNT_SUPPORT: "계정 문의",
        TECH_SUPPORT: "기술 지원",
        FEEDBACK: "제안 및 피드백",
        OTHER: "기타",
    };

    // 유틸리티 함수: 날짜 포맷터
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };
    // 유틸리티 함수: 토큰 가져오기
    // const getToken = localStorage.getItem("token");
    // 유틸리티 함수: 토큰 검증
    const checkToken = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/User/Login");
            return;
        }
        return token;
    }

    const fetchInquiryDetail = async () => {
        const token = checkToken();
        if (!token) return;
        try {
            const response = await axios.get(API_ENDPOINT, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setInquiry(response.data); // 페이지네이션된 데이터(content)
            setReply(response.data.reply || "");
            console.log("endpoint: ", API_ENDPOINT); // 디버깅 로그 추후 삭제제
            console.log("inquiryDetail: ", response.data); // 디버깅 로그 추후 삭제제
        } catch (e) {
            console.error("문의내역 상세조회 실패: ", e);
            alert("문의내역 조회에 실패했습니다.");
        }
    }

    // fetchInquiryDetail 변경될 때 호출
    useEffect(() => {
        fetchInquiryDetail();
    }, []);

    // (관리자) 답변 달기
    const handleReplySubmit  = async (e) => {
        e.preventDefault();
        const token = checkToken();
        if (!token) return;
        const confirmed = window.confirm("등록하시겠습니까?");
        if (!confirmed) return;
        try {
            await axios.put(API_ENDPOINT, { reply }, { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("등록되었습니다.");
            setUpdate(false); // 수정 상태 해제
            fetchInquiryDetail();
        } catch (e) {
            console.error("등록에 실패했습니다: ", e);
            alert("등록 실패");
        }
    };

    // 목록으로 돌아가기
    const handleBack = () => {
        if (window.confirm("작성 중인 내용이 삭제됩니다.\n돌아가시겠습니까?")) {
            navigate("/AdminSupportList");
        }
    };

    return (
        <div className="AdminSupportDetail-all">
            <div className="AdminSupportDetail-title">
                <strong>[{inquiry?.status}]</strong> [{CATEGORY_LABELS[inquiry?.category]}] {inquiry?.title}
                <div>{inquiry?.username} | {formatDateTime(inquiry?.createdDate)}</div>
            </div>
            <div className="AdminSupportDetail-content">{inquiry?.content}</div>
            <div className="AdminSupportDetail-reply">
                <div>{inquiry?.reply}</div>
                <textarea
                    className="AdminSupportDetail-reply-textarea"
                    onChange={(e) => setReply(e.target.value)}
                />
                <button onClick={handleReplySubmit}>저장</button>
            </div>
            <div className="AdminSupportDetail-btn">
                <button onClick={handleBack}>목록</button>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default AdminSupportDetail;