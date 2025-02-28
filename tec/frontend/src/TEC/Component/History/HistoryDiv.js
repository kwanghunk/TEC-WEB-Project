import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Editor } from "@monaco-editor/react";
import "./HistoryDiv.css";

function HistoryDiv({ historyKeyword, historyTranslation, setHistoryKeyword, setHistoryTranslation, closeHistory }) {
  return (
    <div className="history-container">
      <hr/>
      <h3 className="history-title">History</h3>
      <Row>
        <Col md={6}>
          <Card className="history-card">
            <Card.Header className="history-card-header">Original Text</Card.Header>
            <Card.Body>
              <Editor
                height="250px"
                defaultLanguage="java"
                value={historyKeyword}
                options={{ readOnly: true, minimap: { enabled: false } }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="history-card">
            <Card.Header className="history-card-header">Changed Text</Card.Header>
            <Card.Body>
              <Editor
                height="250px"
                defaultLanguage="java"
                value={historyTranslation}
                options={{ readOnly: true, minimap: { enabled: false } }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 기록 닫기 버튼 - React-Bootstrap 적용 */}
      <div className="text-center mt-3">
        <Button variant="danger" onClick={closeHistory}>
          기록 닫기
        </Button>
      </div>
    </div>
  );
}

export default HistoryDiv;
