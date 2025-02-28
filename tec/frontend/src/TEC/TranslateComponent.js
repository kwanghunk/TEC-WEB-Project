import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

import './Styles/TranslateComponent.css';
import { Card, Button, Alert, Container, Row, Col, Form } from "react-bootstrap";

import { fetchUserIpStatus, validateGuestRequest } from "./utils/Ip";
import axiosInstance from "./utils/FuncAxios";
import { fetchHistory, updateHistory, saveTranslation, downloadTranslation } from "./utils/HistoryManager";

import HistoryModal from "./Component/History/HistoryModal";
import HistoryDiv from "./Component/History/HistoryDiv";

const languageOptions = [
  { value: "Java", label: "Java" },
  { value: "Python", label: "Python" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "CSharp", label: "C#" },
  { value: "CPlusPlus", label: "C++" },
  { value: "C", label: "C" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Kotlin", label: "Kotlin" },
  { value: "Ruby", label: "Ruby" },
  { value: "PHP", label: "PHP" }
];

function TranslateComponent({ user, setUser }) { // user 상태 사용용
  const [keyword, setKeyword] = useState(""); // 입력창 입력값
  const [translation, setTranslation] = useState(""); // 번역 결과
  const [language, setLanguage] = useState("Java"); // 기본값 "Java"
  const [isMember, setIsMember] = useState(false); // 회원 여부
  const [isAllowed, setIsAllowed] = useState(true); // 비회원 요청 가능 여부
  const [ipAddress, setIpAddress] = useState(""); // 사용자 IP 주소
  const [errorMessage, setErrorMessage] = useState(""); // 제한 초과 시 메시지

  const [historys, setHistorys] = useState([]); // 저장된 번역 기록 리스트
  const [isModalOpen, setIsModalOpen] = useState(false); // 기록 모달 활성/비활성 상태
  const [isHistoryDivOpen, setIsHistoryDivOpen] = useState(false); // HistoryDiv 활성/비활성 상태
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 히스토리 항목
  const [historyKeyword, setHistoryKeyword] = useState("");
  const [historyTranslation, setHistoryTranslation] = useState("");

  // 페이지 로드 시 회원 여부 & IP 상태 확인
  const updateIpStatus = async () => {
    const { ip, isMember } = await fetchUserIpStatus();
    setIpAddress(ip);
    setIsMember(isMember);
    setIsAllowed(true); // 로그인 하면 비회원 제한 해제
  }

  useEffect(() => {
    setHistorys(fetchHistory);
    if (user) setUser(user); // user값이 있을 경우 상태 등록
    updateIpStatus();
  }, [user]);

  // 번역 요청
  const handleTranslate = async () => {
    if (!keyword.trim()) {
      alert("번역할 텍스트를 입력해주세요.");
      return;
    }

    if (!isMember) { // 비회원 요청 시 제한 확인
      const canTranslate = await validateGuestRequest();
      if (!canTranslate) {
        setErrorMessage("비회원 요청 제한 초과! 로그인 후 이용해주세요.");
        return;
      }
    }

    try { // 번역 API 호출
      const response = await axiosInstance.get("/api/code", { params: { origin: keyword.trim(), language } }); 
      setTranslation(response.data); // 서버에서 반환된 번역 결과 저장

      const newTranslation = { original: keyword, translated: response.data, language };
      const updatedHistory = updateHistory(newTranslation, historys);
      setHistorys(updatedHistory); // 히스토리 업데이트

      setErrorMessage(""); // 에러 메시지 초기화
    } catch (e) {
      console.error("번역 오류: ", e.response?.data || e.message);
      setTranslation("번역에 실패했습니다."); // 오류 메시지 처리
    }
  };

  // Monaco Editor의 내용을 상태로 저장
  const handleEditorChange = (value) => setKeyword(value);

  // 번역 기록 다운로드
  const handleDownload = async () => {
    const confirmed = window.confirm("현재 번역 기록을 다운로드 하시겠습니까?");
    if (!confirmed) return;
    if (!historyKeyword || !historyTranslation) {
      alert("다운로드할 기록을 선택하세요.");
      return;
    }
    const fileName = prompt("(선택)파일 이름을 입력하세요: ", "")|| "DECOBET";
    const dataToDownload = {
      requestCode: historyKeyword, // 원본 코드
      responseCode: historyTranslation, // 번역 결과
      typeCode: language, // 번역 언어
      fileName // 저장할 이름
    };
    downloadTranslation(dataToDownload);
  };

  // 세션 기록 저장
  const handleSave = async () => {
    if (!selectedItem) {
      alert("저장할 기록을 먼저 선택하세요.");
      return;
    }
    const confirmed = window.confirm("선택한 기록을 저장하시겠습니까?");
    if (!confirmed) return;
    let historyTitle = window.prompt("(선택) 제목을 입력하세요.");
    if (!historyTitle) {
      historyTitle = (historyKeyword || keyword).slice(0,30) + "..."; // 기본 제목 설정값
    }
    const dataToSave = {
      requestCode: historyKeyword, // 원본 코드
      responseCode: historyTranslation, // 번역 결과
      typeCode: language, // 번역 언어
      historyTitle: historyTitle // 저장할 번역 기록 제목
    };
    saveTranslation(dataToSave, user);
  };

  // 선택된 기록을 기록에디터에 반영
  const applySelectedHistory = () => {
    if (selectedItem) {
      setHistoryKeyword(selectedItem.original);
      setHistoryTranslation(selectedItem.translated);
      setIsModalOpen(false);
      setIsHistoryDivOpen(true); // 기록 선택 시 HistoryDiv 활성화
    } else { alert("기록을 선택해주세요!"); }
  };

  // 파일 업로드 처리 함수
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validExtensions = ['java', 'js', 'txt', 'py']; // 업로드 허용한 파일 확장자
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      alert("첨부할 수 있는 확장자 파일이 아닙니다.");
      return;
    }
    // 파일 내용을 읽어와 'keyword' 상태에 저장
    const reader = new FileReader();
    reader.onload = (e) => setKeyword(e.target.result); // 파일 내용을 상태 저장
    reader.onerror = () => alert("파일 읽기에 실패했습니다.");
    reader.readAsText(file);
  };

  const customStyles = {
    buttonPrimary: {
      backgroundColor: "#6841EA",
      color: "white",
      border: "none",
      fontSize: "16px",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    }
  }

  return (
    <Container fluid className="translate-container mt-4">
      {/* 옵션 영역 */}
      <div className="translate-options">
        {/* 언어 선택 드롭다운 (왼쪽 끝) */}
        <Form.Select
          className="select-language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={customStyles.buttonPrimary}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
        >
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </Form.Select>

        {/* 추가 기능 버튼 */}
        <div className="translate-btn-group">
            <Button className="translate-btn" onClick={() => setIsModalOpen(true)}
              style={customStyles.buttonPrimary}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
            >기록</Button>
            <Button className="translate-btn" onClick={handleDownload}
              style={customStyles.buttonPrimary}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
            >다운로드</Button>
            <Button className="translate-btn" onClick={handleSave}
              style={customStyles.buttonPrimary}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
            >저장</Button>
            <Button className="translate-btn" onClick={() => document.getElementById("fileInput").click()}
              style={customStyles.buttonPrimary}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}  
            >업로드</Button>
            <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileUpload} />
        </div>
      </div>

      {/* 제한 메시지 출력 */}
      {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}

      {/* 번역 영역 */}
      <Row className="gx-3">
        <Col md={6} className="d-flex justify-content-center">
          <Card className="content-mid-translateDiv-left">
            <Card.Header className="text-center fw-bold">Original Text</Card.Header>
            <Card.Body>
              <Editor 
                height="250px"
                defaultLanguage="java"
                value={keyword}
                onChange={handleEditorChange}
                options={{ minimap: { enabled: false } }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="d-flex justify-content-center">
          <Card className="content-mid-translateDiv-right">
            <Card.Header className="text-center fw-bold">Changed Text</Card.Header>
            <Card.Body>
              <Editor 
                height="250px"
                defaultLanguage="java"
                value={translation}
                options ={{ readOnly: true, minimap: { enabled: false } }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 번역 버튼 */}
      <Row className="mt-3 text-center">
        <Col>
          <Button className="translate-btn-main" onClick={handleTranslate}
            style={customStyles.buttonPrimary}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#FFC107")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#6841ea")}
          >번역하기</Button>
        </Col>
      </Row>

      {/* 기록 모달 */} 
      {isModalOpen && (
        <HistoryModal
          historys={historys}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          closeModal={() => setIsModalOpen(false)}
          applySelectedHistory={applySelectedHistory}
        />
      )}

      {/* 세션 기록 표시 */}
      {isHistoryDivOpen && (
        <>
        <HistoryDiv
          historyKeyword={historyKeyword}
          historyTranslation={historyTranslation}
          setHistoryKeyword={setHistoryKeyword}
          setHistoryTranslation={setHistoryTranslation}
          closeHistory={() => setIsHistoryDivOpen(false)}
        />
      </>
      )}

    </Container>
  );
}

export default TranslateComponent;