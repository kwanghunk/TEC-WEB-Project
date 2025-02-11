import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import '../Styles/UserSupportDetail.css';

function UserSupportDetail() {
    const [inquiry, setInquiry] = useState(null);
    const [username, setUsername] = useState(""); // JWT에서 추출한 사용자 ID
    const location = useLocation();
    const navigate = useNavigate();
    const inquiryNo = new URLSearchParams(location.search).get("inquiryNo");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/User/Login");
            return;
        }

        // JWT에서 사용자 ID 추출
        const decodeToken = (token) => {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.username;
        };

        try {
            const extractedUsername = decodeToken(token);
            setUsername(extractedUsername);
        } catch (e) {
            console.error("토큰 디코딩 실패: ", e);
            alert("잘못된 인증 정보입니다.");
            navigate("/User/Login");
        }

        // 문의 상세 조회
        const fetchInquiryDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`/api/user-support/${inquiryNo}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInquiry(response.data);
            } catch (e) {
                console.error("문의내역 상세조회 실패: ", e);
                alert("문의내역 불러오기에 실패했습니다.");
            }
        };

        if (inquiryNo) fetchInquiryDetails();
    }, [inquiryNo, navigate]);

    const handleDelete = async () => {
        const confirmed = window.confirm("삭제하시겠습니까?");
        if (!confirmed) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api/user-support/${inquiryNo}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("문의가 삭제되었습니다.");
            navigate("/UserSupportList");
        } catch (e) {
            console.error("문의삭제 실패: ", e);
            alert("삭제에 실패했습니다.");
        }
    }

    const formatDateTime = (dateString) => {
        const date = new Date(dateString); // 문자열을 Date 객체로 변환
        const formattedDate = date.toISOString().split('T')[0]; // 날짜 부분 추출
        const formattedTime = date.toTimeString().slice(0, 5); // 시간 부분 추출
        return `${formattedDate} ${formattedTime}`;
    }

    if (!inquiry) return <p>로딩 중...</p>;

    const isOwner = inquiry.username === username; // 권한 확인

    const handleBack = () => {
        navigate("/UserSupportList", { state: { inquiries: location.state?.inquiries } });
    };

    const CATEGORY_LABELS = {
        GENERAL: "일반 문의",
        PAYMENT: "결제/환불 문의",
        ACCOUNT: "계정 문의",
        TECH_SUPPORT: "기술 지원",
        FEEDBACK: "제안 및 피드백",
        OTHER: "기타"
    };

    return (
        <div className="userSupport-detail-all">
            <h2 className="userSupport-detail-hTitle">문의 내용</h2>
            <div className="userSupport-detail-container">
                <div className="userSupport-detail-title">
                    <strong>[{inquiry.status}] </strong>[{CATEGORY_LABELS[inquiry.category]}] {inquiry.title}
                </div>
                <div className="userSupport-detail-info">
                    <strong>{inquiry.userId}</strong>
                    <strong>{formatDateTime(inquiry.createdDate)}</strong>
                </div>
                <div className="userSupport-detail-content">
                    <strong>{inquiry.content}</strong>
                </div>
            </div>
            {inquiry.reply && (
                <div className="userSupport-detail-replyContainer">
                    <h3>관리자 답변</h3>
                    <div className="userSupport-detail-info">
                        <strong>{inquiry.reply != null ? formatDateTime(inquiry.modifiedDate) : ''}</strong>
                    </div>
                    <div className="userSupport-detail-info">
                        {inquiry.reply || ''}
                    </div>
                </div>
            )}
            <div className="userSupport-detail-btn">
                {isOwner && (
                    <>
                        <button
                            onClick={() =>
                                navigate(`/UserSupportEdit?inquiryNo=${inquiry.inquiryNo}`, {
                                    state: { inquiry, inquiries: location.state?.inquiries },
                                })
                            }
                        >
                            수정
                        </button>
                        <button onClick={handleDelete}>삭제</button>
                    </>
                )}
                <button onClick={handleBack}>목록</button>
            </div>
        </div>
    )
}
export default UserSupportDetail;