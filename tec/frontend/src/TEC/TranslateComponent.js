import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "@monaco-editor/react";
import { fetchUserIpStatus } from "./utils/Ip";
import './Styles/TranslateComponent.css';
import { Card, Button, Alert, Container, Row, Col } from "react-bootstrap";

function TranslateComponent() {
  const [keyword, setKeyword] = useState(""); // 입력창 입력값
  const [translation, setTranslation] = useState(""); // 번역 결과
  const [language, setLanguage] = useState("Java"); // 기본값 "Java"
  const [isAllowed, setIsAllowed] = useState(true); // IP 기반 요청 가능 여부
  const [ipAddress, setIpAddress] = useState(""); // 사용자 IP 주소
  const [username, setUsername] = useState(""); // 사용자 이름
  const [errorMessage, setErrorMessage] = useState(""); // 제한 초과 시 메시지

  // 로그인 상태 변경 시 IP 체크크
  const updateIpStatus = async () => {
    const { ip, username, isAllowed } = await fetchUserIpStatus();
    setIpAddress(ip || "unknown");
    setUsername(username);
    setIsAllowed(isAllowed);
  }

  // 번역 요청
  const handleTranslate = async () => {
    if (!keyword.trim()) {
      alert("번역할 텍스트를 입력해주세요.");
      return;
    }

    // 번역 요청 전에 항상 IP 상태 최신화
    await updateIpStatus();

    if (!isAllowed) {
      setErrorMessage("비회원 요청 제한 초과! 로그인 후 이용해주세요.");
      return;
    }

    try {
      const response = await axios.get("/api/code", { 
        params: { origin: keyword.trim(), language, ip: ipAddress || "unknown" } // 서버에 보낼 쿼리 파라미터
      }); 
      setTranslation(response.data); // 서버에서 반환된 번역 결과 저장
      setErrorMessage(""); // 에러 메시지 초기화
    } catch (e) {
      console.error("번역 오류: ", e.response?.data || e.message);
      setTranslation("번역에 실패했습니다."); // 오류 메시지 처리
    }
  };

  useEffect(() => {
    updateIpStatus();
  }, []); // ✅ 초기 1회 실행 (로그인 상태 확인)

  // Monaco Editor의 내용을 상태로 저장
  const handleEditorChange = (value) => setKeyword(value);

  return (
    <Container fluid className="mt-4">
      {/* 상단 버튼 그룹 */}
      <Row className="mb-3 justify-content-center">
        {/* 언어 선택 드롭다운 */}
        <Col md={3}>
          <select 
            className="select-language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="CSharp">C#</option>
            <option value="CPlusPlus">C++</option>
            <option value="C">C</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Kotlin">Kotlin</option>
            <option value="Ruby">Ruby</option>
            <option value="PHP">PHP</option>
          </select>
        </Col>
        <Col>
        {/* 추가 기능 버튼 */}
          <Button className="content-top-btn">기록</Button>
          <Button className="content-top-btn">다운로드</Button>
          <Button className="content-top-btn">저장</Button>
          <Button type="input" accept=".java, .js, .txt, .py" id="fileUpload">
            <label htmlFor="fileUpload" className="content-top-btn">업로드</label>
          </Button>
        </Col>
      </Row>

      {/* 요청 제한 메시지 */}
      {errorMessage && (
        <Alert variant="danger" className="text-center">
          {errorMessage}
        </Alert>
      )}

      {/* 번역 영역 */}
      <Row>
        <Col>
          <Card className="content-mid-translateDiv-left">
            <Card.Header className="text-center fw-bold">Original Text</Card.Header>
            <Card.Body>
              <Editor 
                height="200px"
                defaultLanguage="java"
                value={keyword}
                onChange={handleEditorChange}
                options={{ minimap: { enabled: false } }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="content-mid-translateDiv-right">
            <Card.Header className="text-center fw-bold">Changed Text</Card.Header>
            <Card.Body>
              <Editor 
                height="200px"
                defaultLanguage="java"
                value={translation}
                options ={{
                  readOnly: true,
                  minimap: { enabled: false }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 번역 버튼 */}
      <Row className="mt-3">
        <Button className="content-top-btn" onClick={handleTranslate}>번역하기</Button> 
      </Row>

      {/* 사용자 정보 표시 */}
      <Alert variant="secondary" className="mt-3 text-center">
        🔍 현재 사용자: {username} ({ipAddress})
      </Alert>
    </Container>
  );
}

export default TranslateComponent;