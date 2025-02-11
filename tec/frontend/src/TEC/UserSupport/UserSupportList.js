import axios from "axios";
import { useEffect, useState } from "react";
import '../Styles/UserSupportList.css';
import { useNavigate } from "react-router-dom";


function UserSupportList() {
    const navigate = useNavigate();
    const [initialInquiries, setInitialInquiries] = useState([]); // 초기 목록
    const [inquiries, setInquiries] = useState([]); // 문의내역 상태
    const [keyword, setKeyword] = useState(""); // 키워드 상태 추가
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoggedIn(false);
            setErrorMessage("로그인 후 이용 가능합니다.");
            return;
        }
        setIsLoggedIn(true);

        // 문의 리스트 조회 API 호출
        const fetchInquiries = async () => {
            try {
                const response = await axios.get("/api/user-support", {
                    headers: { Authorization: `Bearer ${token}` }
                });
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
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`/api/user-support/search?keyword=${keyword}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
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
    
    return (
        <div className="userSupport-all">
            <h1 className="userSupport-title">1:1 문의</h1>
            <div className="userSupport-container">
                <div className="userSupport-searchBar">
                    <input
                        className="userSupport-search"
                        placeholder="제목의 일부를 입력하세요."
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                    />&emsp;
                    <button onClick={handleSearch}>조회</button>&emsp;
                    <button onClick={handleReset}>초기화</button>&emsp;
                    <button onClick={() => {navigate('/UserSupportForm')}}>문의</button>
                </div>
                <div className="userSupport-list">
                    {Array.isArray(inquiries) && inquiries.length === 0 ? (
                        <p>문의 내역이 없습니다.</p>
                    ) : (
                        inquiries.map((inquiry, index) => (
                            <div key={index} 
                                className="userSupport-item" 
                                onClick={() => navigate(`/UserSupportDetail?inquiryNo=${inquiry.inquiryNo}`, { state: { inquiries } })}
                            >
                                <div className="userSupport-inquiryTitle">
                                    <strong>[{inquiry.status}] </strong>[{CATEGORY_LABELS[inquiry.category]}] {inquiry.title}
                                </div>
                                <div className="userSupport-createdAt">
                                    <strong>작성일: </strong> {formatDateTime(inquiry.createdDate)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    )
}

export default UserSupportList;