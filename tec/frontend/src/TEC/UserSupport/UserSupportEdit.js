import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function UserSupportEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const inquiry = location.state?.inquiry; // 전달받은 상태
    const [username, setUsername] = useState(""); // 회원 ID
    const [title, setTitle] = useState(inquiry?.title || ""); // 제목
    const [content, setContent] = useState(inquiry?.content || ""); // 내용
    const [category, setCategory] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // JWT에서 사용자 정보 가져오기
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/User/Login");
            return;
        }

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
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const confirmed = window.confirm("수정하시겠습니까?");
        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErrorMessage("로그인이 필요합니다.");
                return;
            }
            await axios.put(
                `/api/user-support/${inquiry.inquiryNo}`,
                { title, content, category },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("문의가 성공적으로 수정되었습니다.");
            navigate(`/UserSupportDetail?inquiryNo=${inquiry.inquiryNo}`, { state: { inquiry: { ...inquiry, title, content, category } } });
        } catch (e) {
            console.error("문의 수정 실패: ", e);
            setErrorMessage("문의 수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleCancel = () => {
        const confirmed = window.confirm("취소하시겠습니까?");
        if (confirmed) navigate(`/UserSupportDetail?inquiryNo=${inquiry.inquiryNo}`, { state: { inquiry } });
    };

    return (
        <div className="userSupport-write-all">
        <h2 className="userSupport-write-title">1:1 문의 수정</h2>
        <div className="userSupport-write-container">
            <p>
                <input
                    value={username}
                    readOnly
                    style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                />
            </p>
            <p>
                    <select value={category}
                    onChange={(e) => setCategory(e.target.value)}>
                        <option value="GENERAL">일반 문의</option>
                        <option value="PAYMENT">결제/환불 문의</option>
                        <option value="ACCOUONT">계정 문의</option>
                        <option value="TECH_SUPPORT">기술 지원</option>
                        <option value="FEEDBACK">제안 및 피드백</option>
                        <option value="OTHER">기타</option>
                    </select>
                </p>
            <p>
                <input
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </p>
            <p>
                <textarea
                    placeholder="문의 내용"
                    value={content}
                    onChange={e => {setContent(e.target.value)}}
                    required
                ></textarea>
            </p>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div>
                <button onClick={handleSubmit}>수정</button>
                <button onClick={handleCancel}>취소</button>
            </div>
        </div>
    </div>
    )
}
export default UserSupportEdit;