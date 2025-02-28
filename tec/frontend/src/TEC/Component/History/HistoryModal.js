import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import "./HistoryModal.css";

function HistoryModal({ historys, selectedItem, setSelectedItem, closeModal, applySelectedHistory }) {
  return (
    <Modal show onHide={closeModal} centered backdrop="static" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">번역 요청 기록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {historys.length === 0 ? (
          <p>저장된 번역 기록이 없습니다.</p>
        ) : (
          <ListGroup className="history-list">
            {historys.map((item, index) => (
              <ListGroup.Item 
                key={index}
                action
                className={`history-item ${selectedItem === item ? 'active' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                <strong>원본:</strong> {item.original.length > 50 ? `${item.original.slice(0, 50)}...` : item.original}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={applySelectedHistory}>선택</Button>
        <Button variant="secondary" onClick={closeModal}>닫기</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HistoryModal;