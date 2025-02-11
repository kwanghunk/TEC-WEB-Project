import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";

function SavedHistoryDetail () {
    const [historyKeyword, setHistoryKeyword] = useState("");
    const [historyTranslation, setHistoryTranslation] = useState("");
    const [activeDiv, setActiveDiv] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("로그인이 필요합니다.");
                    window.history.back();
                    return;
                }
                const response = await axios.get(`/api/history/detail/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                // 상태 설정
                setHistoryKeyword(response.data.requestCode);
                setHistoryTranslation(response.data.responseCode);
            } catch (e) {
                console.error("상세 데이터 로드 실패: ", e);
                alert("데이터를 불러오는데 실패했습니다.");
                window.history.back();
            }
        }
        fetchDetail();
    }, [id]);

    const dowloadHistoroy = async () => {
        let fileName = "";
        const confirmed = window.confirm("다운로드 하시겠습니까?");
        if (confirmed) {
            fileName = prompt("(선택)파일 이름을 입력하세요: ", "") || "DECOBET";
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }
            const response = await axios.get(`/api/history/detail/${id}/download`,
                {
                    headers: { Authorization: `Bearer ${token}`},
                    params: { fileName }, // 쿼리 파라미터로 파일 이름 전달
                    responseType: "blob", // 파일 다운로드
                }
            );
            // 파일 다운로드 처리
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${fileName}.txt`);
            document.body.appendChild(link);
            link.click();
        } catch (e) {
            console.error("다운로드 실패: ", e);
            alert("다운로드에 실패했습니다.");
        }
    };

    // 삭제 핸들러
    const handleDelete = async () => {
        const confirmed = window.confirm("정말로 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }
            await axios.delete(`/api/history/detail/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            alert("삭제되었습니다.");
            navigate("/User/savedHistoryList");
        } catch (e) {
            console.error("삭제 실패: ", e);
            alert("삭제에 실패했습니다.");
        }
    }

    return (
        <div className="SavedHistory-detail-component">
            <div className="content-historyDiv-title">
                <p className="content-bottom-historyDiv-title">History</p>
                <button onClick={dowloadHistoroy}>다운로드</button> 
            </div>
            <div className="content-historyDiv-left"> {/* 왼쪽 영역 */}
                <p className="content-title">Original text</p>
                <div
                className={`content-bottom-historyDiv-left ${activeDiv === 'left' ? 'active' : ''}`}
                onClick={() => setActiveDiv('left')}
                >
                    <Editor 
                        defaultLanguage="java" // 기본언어 설정
                        value={historyKeyword} // Monaco Editor에 표시될 값
                        options ={{
                            readOnly: true,
                            minimap: { enabled: false }, // 미니맵 비활성화
                            automaticLayout: true, // 부모 div 크기에 맞춰서 자동으로 editor 크기 맞춰줌
                        }}
                    />
                </div>
            </div>
            <div className="content-historyDiv-right">{/* 오른쪽 영역 */}
                <p className="content-title">Changed text</p>
                <div
                className={`content-bottom-historyDiv-right ${activeDiv === 'right' ? 'active' : ''}`}
                onClick={() => setActiveDiv('right')}
                >
                    <Editor 
                        defaultLanguage="java" // 기본언어 설정
                        value={historyTranslation} // Monaco Editor에 표시될 값            
                        options ={{
                            readOnly: true,
                            minimap: { enabled: false }, // 미니맵 비활성화
                            automaticLayout: true, // 부모 div 크기에 맞춰서 자동으로 editor 크기 맞춰줌
                        }}
                    />
                </div>
            </div>
            <div className="content-btnDiv">
                <button onClick={() => navigate("/User/savedHistoryList")}>목록</button>
                <button onClick={handleDelete}>삭제</button>
            </div>
        </div>
    )
}
export default SavedHistoryDetail;