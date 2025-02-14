package com.tecProject.tec.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.tecProject.tec.domain.UserSupport;
import com.tecProject.tec.domain.UserSupport.InquiryCategory;
import com.tecProject.tec.dto.AdminSupportDTO;
import com.tecProject.tec.repository.SupportRepository;

@Service
public class AdminSupportService {
	private final SupportRepository supportRepository;
	
	public AdminSupportService(SupportRepository supportRepository) {
		this.supportRepository = supportRepository;
	}
	
    // 문의내역 전체조회(관리자)
	public Page<UserSupport> getFilteredInquiries(Pageable pageable, InquiryCategory category, String keyword) {
	    if (category != null && keyword != null) { // 카테고리 + 키워드 조회
	        return supportRepository.findByCategoryAndTitleContainingAndIsDeleted(category, keyword, "N", pageable);
	    } else if (category != null) { // 카테고리 조회
	        return supportRepository.findByCategoryAndIsDeleted(category, "N", pageable);
	    } else if (keyword != null) { // 키워드 조회
	        return supportRepository.findByTitleContainingAndIsDeleted(keyword, "N", pageable);
	    } // 기본 전체 조회
	    return supportRepository.findByIsDeleted("N", pageable); 
	}

	// 문의내역 상세조회(관리자)
	public Optional<UserSupport> getInquiryById(int inquiryNo) {
		Optional<UserSupport> inquiry = supportRepository.findById(inquiryNo);
		if (inquiry.isPresent()) {
			return inquiry;
		}
		return Optional.empty();
	}

	// 문의내역 답변 작성/수정(관리자)
	public Optional<UserSupport> updateInquiry(int inquiryNo, String reply) {
		Optional<UserSupport> existingInquiry = supportRepository.findById(inquiryNo);
		if (existingInquiry.isEmpty()) {
			return Optional.empty();  // 문의조회 실패
		}
		UserSupport inquiry = existingInquiry.get();
		inquiry.setReply(reply);
		inquiry.setReplyDate(LocalDateTime.now());
		inquiry.setStatus("답변완료");
		
		return Optional.of(supportRepository.save(inquiry));
	}
}
