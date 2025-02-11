import React, { useState } from "react";
import axios from "axios";

const LANGUAGES = {
  Java: "Java",
  Python: "Python",
  JavaScript: "JavaScript",
  "C#": "CSharp",
  "C++": "CPlusPlus",
  C: "C",
  TypeScript: "TypeScript",
  Kotlin: "Kotlin",
  Ruby: "Ruby",
  PHP: "PHP",
};
const ALPHABETS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const FilterSearchModal = ({ onClose }) => {
  const [selectedLanguages, setSelectedLanguages] = useState([]); // 선택된 언어 (Value 저장)
  const [selectedAlphabet, setSelectedAlphabet] = useState(""); // 선택된 알파벳
  const [keyword, setKeyword] = useState(""); // 키워드 입력
  const [results, setResults] = useState([]); // 검색 결과
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 언어 태그 선택/제거
  const toggleLanguage = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((tag) => tag !== language)
        : [...prev, language]
    );
  };

  // 알파벳 태그 선택
  const toggleAlphabet = (alphabet) => {
    setSelectedAlphabet((prev) => (prev === alphabet ? "" : alphabet));
  };

  // 검색
  const handleSearch = async () => {
    const trimmedKeyword = keyword.trim(); // 키워드 앞뒤 공백 제거
    if (!selectedAlphabet && !trimmedKeyword) {
      alert("알파벳 태그 또는 키워드를 입력하세요.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get("/api/code/filterSearch", {
        params: { alphabet: selectedAlphabet, keyword: trimmedKeyword },
      });
      console.log("handleSearch keyword: ", trimmedKeyword);
      // 서버로부터 가져온 데이터를 사용자가 선택한 언어 태그 기준으로 필터링
      const filteredResults = response.data.map((item) => {
        const translations = JSON.parse(item.translateCode);
        return {
          originCode: item.originCode,
          translation: selectedLanguages
            .map((lang) => translations[lang] || "번역 없음")
            .join(", ")
        };
    });

      setResults(filteredResults);
      console.log("검색 결과: ", results);
    } catch (e) {
      console.error("API 요청 실패:", e);
      alert("데이터를 가져오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
};


  return (
    <div className="FilterSearchModal">
      {/* 닫기 버튼 */}
      <div className="FilterSearchModal-header-closeBtn">
        <button onClick={onClose}>닫기</button>
      </div>

      {/* 선택된 태그 */}
      <div className="FilterSearchModal-header-selectedTags">
        {selectedLanguages.map((lang) => (
          <span key={lang} className="selected-tag">
            {lang} <button onClick={() => toggleLanguage(lang)}>x</button>
          </span>
        ))}
        {selectedAlphabet && (
          <span className="selected-tag">
            {selectedAlphabet}{" "}
            <button onClick={() => toggleAlphabet("")}>x</button>
          </span>
        )}
      </div>

      {/* 언어 태그 선택 */}
      <div className="FilterSearchModal-mid-PrimaryTag">
        {Object.entries(LANGUAGES).map(([label, value]) => (
          <button
            key={value}
            onClick={() => toggleLanguage(value)}
            className={selectedLanguages.includes(value) ? "selected" : ""}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 알파벳 태그 선택 */}
      <div className="FilterSearchModal-mid-secondTag">
        {ALPHABETS.map((letter) => (
          <button
            key={letter}
            onClick={() => toggleAlphabet(letter)}
            className={selectedAlphabet === letter ? "selected" : ""}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* 키워드 입력 */}
      <div className="FilterSearchModal-top-input">
        <input
          type="text"
          placeholder="검색어를 입력하세요."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* 조회 버튼 */}
      <div className="FilterSearchModal-actions">
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "검색 중..." : "조회"}
        </button>
        <button onClick={onClose}>닫기</button>
      </div>

      {/* 결과 출력 */}
      <div className="FilterSearchModal-results">
        {results.length > 0 ? (
          results.map((result, idx) => (
            <div key={idx}>
              <strong>{result.originCode}</strong>: {result.translation}
            </div>
          ))
        ) : (
          !loading && <p>결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default FilterSearchModal;