import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserSupportForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("GENERAL");
    const [errorMessage, setErrorMessage] = useState("");

    // 로그인 사용자 정보 가져오기
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다.");
            navigate("/User/Login"); // 로그인 페이지로 이동
            return;
        }

        // JWT에서 사용자 정보 추출
        const decodeToken = (token) => {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.username; // 토큰의 username 클레임 사용
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
        const confirmed = window.confirm("등록하시겠습니까?");
        if (!confirmed) return;
        if (!title || !content) {
            alert("내용을 작성하세요.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "/api/user-support",
                { category: category, title, content },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            alert("문의가 성공적으로 등록되었습니다.");
            navigate("/UserSupportList"); // 리스트 페이지로 이동
        } catch (e) {
            console.error("문의 등록 실패: ", e);
            setErrorMessage("문의 등록에 실패했습니다. 다시 시도해주세요.");
        }
    };

    const handleCancel = () => {
        const confirmed = window.confirm("취소하시겠습니까?");
        if (confirmed) navigate("/UserSupportList"); 
    }

    return (
        <div className="userSupport-write-all">
            <h2 className="userSupport-write-title">1:1 문의 작성</h2>
            <div className="userSupport-write-container">
                <p>
                    <input
                        placeholder="회원ID"
                        value={username}
                        required
                        readOnly
                        style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                    />
                </p>
                <p>
                    <select value={category}
                    onChange={(e) => setCategory(e.target.value)}>
                        <option value="GENERAL">일반 문의</option>
                        <option value="PAYMENT">결제/환불 문의</option>
                        <option value="ACCOUNT_SUPPORT">계정 문의</option>
                        <option value="TECH_SUPPORT">기술 지원</option>
                        <option value="FEEDBACK">제안 및 피드백</option>
                        <option value="OTHER">기타</option>
                    </select>
                </p>
                <p>
                    <input
                        placeholder="제목"
                        value={title}
                        onChange={e => {setTitle(e.target.value)}}
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
                    <button onClick={handleSubmit}>작성</button>
                    <button onClick={handleCancel}>취소</button>
                </div>
            </div>
        </div>
    )
}
export default UserSupportForm;