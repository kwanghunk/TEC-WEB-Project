import { Button, Col, Container, ListGroup, Row } from "react-bootstrap"
import "../Styles/HistoryDetail.css";
import { Editor } from "@monaco-editor/react";
import axiosInstance from "../../../utils/FuncAxios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const HistoryDetail = ({ selectedHistoryId, setSelectedHistoryId, setActiveTab }) => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]); // 좌측 목록
  const [historyDetail, setHistoryDetail] = useState(null); // 상세 데이터

  const fetchHistoryList = async () => {
    try {
      const response = await axiosInstance.get(`/api/history/load`, {
        params: { page: 0, size: 10 }
      });
      setHistoryList(response.data.content);
    } catch (e) {
      console.error("API 요청 실패: ", e);
      if (e.response && e.response.status === 401) {
        alert("로그인이 필요한 기능입니다.");
      } else {
        alert("요청 실패: " + (e.response?.data?.message || "히스토리 조회 중 오류가 발생했습니다."));
      }
    }
  };

  const fetchHistoryDetail = async () => {
    try {
      const response = await axiosInstance.get(`/api/history/detail/${selectedHistoryId}`);
      setHistoryDetail(response.data);
    } catch (e) {
      console.error("API 요청 실패: ", e);
      if (e.response && e.response.status === 401) {
        alert("로그인이 필요한 기능입니다.");
      } else {
        alert("요청 실패: " + (e.response?.data?.message || "히스토리 조회 중 오류가 발생했습니다."));
      }
    }
  };

  useEffect(() => {
    if (selectedHistoryId) {
      fetchHistoryDetail();
      fetchHistoryList();
    }
  }, [selectedHistoryId]);

  const handleDelete = async () => {
    const confirm = window.confirm("해당 기록을 삭제하시겠습니까?");
    if (!confirm) return;
    try {
      await axiosInstance.delete(`/api/history/delete/${selectedHistoryId}`);
      alert("히스토리가 삭제되었습니다.");
      setSelectedHistoryId(null);
      setActiveTab("history");
    } catch (e) {
      console.error("API 요청 실패: ", e);
      if (e.response && e.response.status === 401) {
        alert("로그인이 필요한 기능입니다.");
      } else {
        alert("요청 실패: " + (e.response?.data?.message || "히스토리 삭제 중 오류가 발생했습니다."));
      }
    }
  };

  const handleDownload = async () => {
    const confirmed = window.confirm("현재 번역 기록을 다운로드 하시겠습니까?");
    if (!confirmed) return;
    try {
      const fileName = prompt("(선택)파일 이름을 입력하세요: ", "")|| "DECOBET";

      const response = await axiosInstance.post(
        `/api/history/download/${selectedHistoryId}`, null, 
        { params: { fileName }, responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `${fileName}.txt`);
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url); // 메모리 정리
    } catch (e) {
      console.error("다운로드 실패: ", e);
      // 401 에러인 경우, Blob 데이터를 JSON으로 변환하여 메시지 추출
      if (e.response && e.response.status === 401) {
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const errorMessage = JSON.parse(reader.result).message || "로그인이 필요한 기능입니다.";
            alert(errorMessage);
          } catch {
            alert("로그인이 필요한 기능입니다.");
          }
        };
        reader.readAsText(e.response.data); // Blob을 JSON으로 변환
      } else {
        alert("다운로드 실패: 알 수 없는 오류가 발생했습니다.");
      }
    };
  }

  return(
    <Container className="history-detail-container">
      <Row>
        <Col md={3} className="sidebar">
          <ListGroup>
            {historyList.map((history) => (
              <ListGroup.Item 
                key={history.saveHistoryNo} 
                action 
                active={selectedHistoryId === history.saveHistoryNo}
                onClick={() => {setSelectedHistoryId(history.saveHistoryNo);}}
              >
                {history.historyTitle}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={9}>
          {historyDetail ? (
            <>
              {/* 상단 requestCode */}
              <Editor
                height="250px"
                defaultLanguage="java"
                value={historyDetail.requestCode}
                options={{ readOnly: true, minimap: { enabled: false } }}
              />

              {/* 하단 responseCode */}
              <Editor
                height="250px"
                defaultLanguage="java"
                value={historyDetail.responseCode}
                options={{ readOnly: true, minimap: { enabled: false } }}
              />

              {/* 버튼 그룹 */}
              <Row className="mt-3 text-center">
                <Col>
                  <Button variant="primary" onClick={handleDownload}>다운로드</Button>
                  <Button variant="danger" onClick={handleDelete}>삭제하기</Button>
                  <Button variant="secondary" onClick={() => {
                    setSelectedHistoryId(null);  
                    setActiveTab("history"); 
                  }}>뒤로가기</Button>
                </Col>
              </Row>
            </>
          ) : (
            <p>히스토리를 불러오는 중...</p>
          )}
        </Col>
      </Row>
    </Container>
  )
};

export default HistoryDetail;