import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FaqForm from './FaqForm';
import '../Styles/Faq.css';

function Faq() {
  const [faqs, setFaqs] = useState([]); // FAQ 목록
  const [filteredFaqs, setFilteredFaqs] = useState([]); // 검색된 FAQ 목록
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const itemsPerPage = 5; // 한 페이지에 표시할 항목 수
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부

  // 관리자 여부 확인
  const checkAdminStatus = async () => {
    try {
      const response = await axios.get('/faq/check-admin', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // 토큰을 로컬 스토리지에서 가져옴
        },
      });
      console.log('관리자 여부:', response.data); // 서버 응답 로그 출력
      setIsAdmin(response.data === 'ROLE_ADMIN'); // ROLE_ADMIN인지 확인
    } catch (error) {
      console.error('관리자 여부 확인 실패:', error);
      setIsAdmin(false); // 실패 시 기본값으로 설정
    }
  };

  // FAQ 목록 가져오기
  useEffect(() => {
    fetchFaqs();
    checkAdminStatus();
  }, []);
  
  // 검색어 변경 시 필터링
  useEffect(() => {
    if (searchTerm) {
      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaqs(filtered);
    } else {
      setFilteredFaqs(faqs);
    }
    setCurrentPage(1); // 검색 시 페이지를 1로 초기화
  }, [searchTerm, faqs]);

// 서버에서 FAQ 목록 가져오기
const fetchFaqs = async () => {
  try {
    const response = await axios.get('/faq/faqs');
    setFaqs(response.data);
  } catch (error) {
    console.error('FAQ 목록 로드 실패:', error);
  }
};
    
  // 페이지 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFaqs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="faq-all">
      <h1 className="faq-title">자주 묻는 질문</h1>
      <div className="faq-container">
        <input
          type="text"
          className="faq-search"
          placeholder="질문 또는 답변 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* FAQ 목록 */}
        <div className="faq-list">
          {currentItems.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question">
                <strong>질문:</strong> {faq.question}
              </div>
              <div className="faq-answer">
                <strong>답변:</strong> {faq.answer}
              </div>
              <div className="faq-date">
                <strong>생성일자:</strong> {faq.createdDate || '알 수 없음'}
              </div>
            </div>
          ))}
        </div>
        {/* 페이지네이션 */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        {/* FAQ 등록 폼 (관리자만 표시) */}
        {isAdmin && <FaqForm onFaqAdded={(newFaq) => setFaqs([...faqs, newFaq])} />}
      </div>
    </div>
  );
}


export default Faq;