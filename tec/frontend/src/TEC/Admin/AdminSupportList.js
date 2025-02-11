import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import '../Styles/UserSupportList.css';
import { useNavigate } from "react-router-dom";

function AdminSupportList() {
    const navigate = useNavigate();
    // 로컬 상태
    const [inquiries, setInquiries] = useState([]); // 문의 리스트 상태
    const [searchParams, setSearchParams] = useState({ category: "", keyword: "" }); // 필터 상태
    const [page, setPage] = useState(0); // 현재 페이지
    const [size, setSize] = useState(10); // 한 페이지당 항목 수
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const [errorMessage, setErrorMessage] = useState("");

    // 상수 정의
    const API_ENDPOINT = "/admin/support";
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
    const getToken = useCallback(() => localStorage.getItem("token"), []);

    // 데이터 가져오기 함수
    const fetchInquiries = useCallback(async () => {
        const token = getToken();
        if (!token) {
            setErrorMessage("로그인 후 이용 가능합니다.");
            return;
        }
        try {
            const response = await axios.get(API_ENDPOINT, {
                headers: { Authorization: `Bearer ${token}` },
                params: { ...searchParams, page, size }, // 필터 + 페이지 상태 전달
            });
            const { content, totalPages } = response.data;
            setInquiries(content); // 페이지네이션된 데이터(content)
            setTotalPages(totalPages);
        } catch (e) {
            console.error("문의 리스트 조회 실패: ", e);
            setErrorMessage("문의 리스트를 불러오는 데 실패했습니다.");
        }
    }, [getToken, searchParams, page, size]);

    // 페이지 또는 필터가 변경될 때 호출
    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]); //[page, size, searchParams]

    // 검색 버튼 클릭 시
    const handleSearch = () => {
        setPage(0); // 필터 변경 시 페이지 초기화
        fetchInquiries();
    };

    // 초기화 버튼 클릭 시
    const handleReset = () => {
        setSearchParams({ category: "", keyword: "" });
        setPage(0);
        setSize(10); // 기본값으로 초기화
        fetchInquiries();
    };

    // 페이지네이션 버튼 렌더링
    const renderPaginationButtons = () => {
        return Array.from({ length: totalPages }, (_, i) => (
            <button
                key={i}
                className={`button ${i === page ? "active" : ""}`}
                onClick={() => setPage(i)}
            >
                {i + 1}
            </button>
        ));
    };

    return (
        <div className="userSupport-all">
            <h1 className="userSupport-title">1:1 문의 (관리자)</h1>
            <div className="userSupport-container">
                <div className="userSupport-searchBar">
                    <select
                        className="userSupport-search"
                        value={searchParams.category}
                        onChange={(e) => 
                            setSearchParams((prev) => ({ ...prev, category: e.target.value }))
                        }
                    >
                        <option value="">전체 카테고리</option>
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                            <option key={key} value={key}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <input
                        className="userSupport-search"
                        placeholder="제목의 일부를 입력하세요."
                        value={searchParams.keyword}
                        onChange={(e) => 
                            setSearchParams((prev) => ({ ...prev, keyword: e.target.value }))
                        }
                    />
                    <button onClick={handleSearch}>조회</button>
                    <button onClick={handleReset}>초기화</button>
                    <select 
                        className="SavedHistory-top-listSize"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                    >
                        <option value="10">10개씩</option>  
                        <option value="20">20개씩</option>
                        <option value="50">50개씩</option>
                    </select>
                </div>
                <div className="userSupport-list">
                    {inquiries && inquiries.length > 0 ? (
                        inquiries.map((inquiry) => (
                            <div
                                key={inquiry.inquiryNo}
                                className="userSupport-item"
                                onClick={() =>
                                    navigate(`/AdminSupportDetail?inquiryNo=${inquiry.inquiryNo}`, {
                                        state: { inquiry },
                                    })
                                }
                            >
                                <div className="userSupport-inquiryTitle">
                                    <strong>[{inquiry.status}] </strong>
                                    [{CATEGORY_LABELS[inquiry.category]}] {inquiry.title}
                                </div>
                                <div className="userSupport-createdAt">
                                    <strong>작성일: </strong>
                                    {formatDateTime(inquiry.createdDate)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>문의 내역이 없습니다.</p>
                    )}
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            {/* 하단 영역 */}
            <div className="SavedHistory-bottom-page">
                {renderPaginationButtons()}
            </div>
        </div>
    );
}

export default AdminSupportList;