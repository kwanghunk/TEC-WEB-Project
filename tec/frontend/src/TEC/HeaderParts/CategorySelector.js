import React, { useState } from "react";

const categories = {
  코드: ["Java", "Python", "Javascript", "C++"],
  FAQ: ["제목", "내용", "날짜"],
  문의: {
    상태: ["대기", "수정", "답변완료"],
    카테고리: ["일반 문의", "결제/환불 문의", "계정 문의", "기술 지원", "제안 및 피드백", "기타"],
    기타: ["제목", "생성일자", "답변일자"],
  },
  저장된번역: ["제목", "내용", "저장일자"],
};

const CategorySelector = ({ onAddFilter }) => {
  const [mainCategory, setMainCategory] = useState(""); // 1차 태그
  const [subCategory, setSubCategory] = useState(""); // 2차 태그
  const [detailCategory, setDetailCategory] = useState(""); // 3차 태그 (문의 전용)

  const handleAdd = () => {
    if (subCategory) {
      if (detailCategory) {
        onAddFilter(`${mainCategory} > ${subCategory} > ${detailCategory}`);
      } else {
        onAddFilter(`${mainCategory} > ${subCategory}`);
      }
    }
  };

  return (
    <div>
      <h4>카테고리 선택</h4>
      <select onChange={(e) => setMainCategory(e.target.value)} value={mainCategory}>
        <option value="">1차 태그 선택</option>
        {Object.keys(categories).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {mainCategory && mainCategory !== "문의" && (
        <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory}>
          <option value="">2차 태그 선택</option>
          {categories[mainCategory].map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      )}

      {mainCategory === "문의" && (
        <>
          <select onChange={(e) => setSubCategory(e.target.value)} value={subCategory}>
            <option value="">2차 태그 선택</option>
            {Object.keys(categories[mainCategory]).map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {subCategory && (
            <select onChange={(e) => setDetailCategory(e.target.value)} value={detailCategory}>
              <option value="">3차 태그 선택</option>
              {categories[mainCategory][subCategory].map((detail) => (
                <option key={detail} value={detail}>
                  {detail}
                </option>
              ))}
            </select>
          )}
        </>
      )}

      <button onClick={handleAdd}>필터 추가</button>
    </div>
  );
};

export default CategorySelector;
