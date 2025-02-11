import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import "./Header.css";
import FilterSearchModal from "../../HeaderParts/FilterSearchModal";
import axiosInstance from "../../utils/FuncAxios";

const TestHeader = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false); // 검색 모달 추가
  const [historys, setHistorys] = useState([]);
  let accessToken = null; // 메모리에서만 유지

  useEffect(() => {
    if (!user) { // 로그인 상태 없을 시 /user/me 호출
      axiosInstance
        .get("/user/me", { withCredentials: true }) // 사용자 인증 확인
        .then((res) => {
          console.log("Header useEffect /user/me res: ", res); // 디버깅 로그
          setUser(res.data.username);
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout", {}, { withCredentials: true }); // 서버에서 Refresh Token 삭제
      accessToken = null; // AT 메모리에서 삭제
      sessionStorage.removeItem("translationHistory");
      if (!sessionStorage.getItem("translationHistory")) { setHistorys([]); }
      setUser(null);
      alert("로그아웃 되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#6841EA", color: "#FFFFFF" }}>
      <Container>

        {/* 로고 */}
        <Navbar.Brand onClick={() => navigate("/")} style={{ cursor: "pointer", color: "#FFFFFF", fontWeight: "bold" }}>
          <img src="/imgs/logo1.png" alt="logo" height="40" className="me-2" />
        </Navbar.Brand>

        {/* 네비게이션 메뉴 */}
        <Nav className="me-auto">
          <Nav.Link onClick={() => navigate("/Admin/CodeManagement")} style={{ color: "#FFFFFF" }}>코드 API</Nav.Link>
          <Nav.Link onClick={() => navigate("/Admin/Faq")} style={{ color: "#FFFFFF" }}>자주 묻는 질문</Nav.Link>
          <Nav.Link onClick={() => navigate("/UserSupportList")} style={{ color: "#FFFFFF" }}>1:1 문의</Nav.Link>
          <Nav.Link onClick={() => navigate("/AdminSupportList")} style={{ color: "#FFFFFF" }}>관리자 문의</Nav.Link>
        </Nav>

        {/* 검색 버튼 */}
        <FaSearch className="me-3" style={{ cursor: "pointer", color: "#FFFFFF" }} onClick={() => setModalOpen(true)} />

        {/* 검색 모달 */}
        {isModalOpen && <FilterSearchModal onClose={() => setModalOpen(false)} />}

        {/* 로그인 / 로그아웃 */}
        {user ? (
          <div>
            <span style={{ color: "#FFFFFF", marginRight: "10px" }}>{user}님</span>
            <Button variant="outline-light" size="sm" className="ms-2" onClick={() => navigate("/User/MyPage")}>
              마이페이지
            </Button>
            <Button variant="outline-light" size="sm" className="ms-2" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        ) : (
          <Button variant="light" size="sm" onClick={() => navigate("/Login")}>
            로그인
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default TestHeader;