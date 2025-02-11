import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SavedHistoryList() {
    const [historyList, setHistoryList] = useState([]); // 히스토리 데이터
    const [page, setPage] = useState(0); // 현재 페이지
    const [size, setSize] = useState(10); // 한 페이지당 항목 수
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) { 
                    alert("로그인이 필요합니다."); 
                    return; 
                }
            
                const response = await axios.get(`/api/history/load?page=${page}&size=${size}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistoryList(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (e) {
                console.error("히스토리 조회 실패: ", e);
                alert("데이터를 불러오는데 실패했습니다.");
            }
        };
        fetchHistory();
    }, [page, size]); // 페이지 또는 항목 수가 변경되면 재호출
    
    // 날짜 포맷
    const formatDateTime = (dateString) => {
        const date = new Date(dateString); // 문자열을 Date 객체로 변환
        const formattedDate = date.toISOString().split('T')[0]; // 날짜 부분 추출
        const formattedTime = date.toTimeString().slice(0, 5); // 시간 부분 추출
        return `${formattedDate} ${formattedTime}`;
    }

    // 페이지네이션 버튼 렌더링
    const renderPaginationButtons = () => {
        const buttons = [];
        for (let i = 0; i < totalPages; i++) {
            buttons.push(
                <button
                    key={i}
                    className={`button ${i === page ? "active" : ""}`}
                    onClick={() => setPage(i)}
                >
                    {i + 1}
                </button>
            );
        }
        return buttons;
    };
    
    return (
        <div className="SavedHistory-list-component">
            {/* 상단 영역 */}
            <div className="SavedHistory-top-title">
                <h3>저장된 번역 기록</h3>
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

            {/* 중간 영역 */}
            <div className="SavedHistory-mid-list">
                <table>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>저장 날짜/시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyList && historyList.length > 0 ? (
                            historyList.map((item, index) => (
                                <tr 
                                    key={index} 
                                    onClick={() => navigate(`/User/savedHistoryDetail/${item.saveHistoryNo}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{index + 1 + page * size}</td>
                                    <td>{item.historyTitle}</td>
                                    <td>{item.username}</td>
                                    <td>{formatDateTime(item.saveTime)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center" }}>
                                    저장된 히스토리가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 하단 영역 */}
            <div className="SavedHistory-bottom-page">
                {renderPaginationButtons()}
            </div>
        </div>
    )
}
export default SavedHistoryList;