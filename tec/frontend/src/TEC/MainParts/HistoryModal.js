import React from "react";

function HistoryModal({ historys, selectedItem, setSelectedItem, closeModal, applySelectedHistory }) {
  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않음
      >
        <h4>번역 요청 기록</h4>
        <ul className="history-list">
          {historys.map((item, index) => (
            <li 
              key={index}
              className={`historys-item ${selectedItem === item ? 'active' : ''}`}
              onClick={() => setSelectedItem(item)}
            >
              <p className="historys-item">
                <strong>원본:</strong>{" "}
                {item.original.length > 50 ? `${item.original.slice(0, 50)}...` : item.original}
              </p>
            </li>
          ))}
        </ul>
        <div className="modal-buttons">
          <button onClick={applySelectedHistory}>선택</button>
          <button onClick={closeModal}>닫기</button>
        </div>
      </div>
    </div>
  );
}

export default HistoryModal;