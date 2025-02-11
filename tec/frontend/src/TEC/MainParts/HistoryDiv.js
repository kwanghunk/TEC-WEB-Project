import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";

function HistoryDiv({ historyKeyword, historyTranslation, setHistoryKeyword, setHistoryTranslation }) {
  const [activeDiv, setActiveDiv] = useState(null); // 클릭된 번역 영역

  // 클릭된 번역 이벤트
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest('.content-bottom-historyDiv-left') && 
        !event.target.closest('.content-bottom-historyDiv-right')
      ) {
        setActiveDiv(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <div className="content-bottom-historyDiv">
      <div className="content-historyDiv-title">
        <p className="content-bottom-historyDiv-title">History</p> 
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
            onChange={(value) => setHistoryKeyword(value)} // 값이 변경될 때 마다 상태값 변경
            options ={{
              readOnly: true,
              minimap: { enabled: false } // 미니맵 비활성화
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
            onChange={(value) => setHistoryTranslation(value)}          
            options ={{
              readOnly: true,
              minimap: { enabled: false } // 미니맵 비활성화
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default HistoryDiv;