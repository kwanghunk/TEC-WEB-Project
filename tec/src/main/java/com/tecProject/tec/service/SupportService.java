package com.tecProject.tec.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tecProject.tec.domain.UserSupport;
import com.tecProject.tec.domain.UserSupport.InquiryCategory;
import com.tecProject.tec.dto.UserSupportDTO;
import com.tecProject.tec.repository.SupportRepository;

@Service
public class SupportService {
	
	private final SupportRepository supportRepository;
	
	private SupportService(SupportRepository supportRepository) {
		this.supportRepository = supportRepository;
	}

	// 문의 등록
	public UserSupportDTO createInquiry(UserSupportDTO userSupportDTO, String username) {
		UserSupport userSupport = new UserSupport();
		userSupport.setUsername(username); // 사용자 ID
		userSupport.setTitle(userSupportDTO.getTitle()); // 문의 제목
		userSupport.setContent(userSupportDTO.getContent()); // 문의 내용
		userSupport.setCategory(userSupportDTO.getCategory()); // 카테고리
		userSupport.setCreatedDate(LocalDateTime.now()); // 작성시간
		userSupport.setStatus("대기"); // 기본 상태 설정
		userSupport.setIsDeleted("N"); // 삭제 여부 기본값
		UserSupport savedInquiry = supportRepository.save(userSupport);
		return new UserSupportDTO(savedInquiry.getTitle(), savedInquiry.getContent(), 
				savedInquiry.getStatus(), savedInquiry.getCategory(), savedInquiry.getIsDeleted());
	}

	// 문의 수정
	public Optional<UserSupport> updateInquiry(int inquiryNo, String username, String title, String content, InquiryCategory category) {
		Optional<UserSupport> existingInquiry = supportRepository.findById(inquiryNo);
	    if (existingInquiry.isEmpty()) {
	        return Optional.empty(); // 문의 없음
	    }

	    UserSupport inquiry = existingInquiry.get();

	    // 사용자 권한 확인
	    if (!inquiry.getUsername().equals(username)) {
	        throw new SecurityException("수정 권한이 없습니다."); // 권한 문제 시 예외 발생
	    }
        inquiry.setTitle(title);
        inquiry.setContent(content);
        inquiry.setCategory(category);
        inquiry.setModifiedDate(LocalDateTime.now());
		
		return Optional.of(supportRepository.save(inquiry));
	}

    // 문의 삭제
    public Optional<UserSupport> deleteInquiry(int inquiryNo, String username) {
    	Optional<UserSupport> existingInquiry = supportRepository.findById(inquiryNo);
    	if (existingInquiry.isPresent()) {
    		UserSupport inquiryToDelete = existingInquiry.get();
            // 사용자 권한 확인
            if (!inquiryToDelete.getUsername().equals(username)) {
                return Optional.empty(); // 권한 없음
            }
            // 삭제 상태 업데이트
    		inquiryToDelete.setIsDeleted("Y"); // 삭제상태 "Y"로 업데이트
    		inquiryToDelete.setDeletedDate(LocalDateTime.now()); 
    		return Optional.of(supportRepository.save(inquiryToDelete));
    	}
    	return Optional.empty();
    }

    // 문의내역 전체조회(사용자)
	public List<UserSupport> getInquiryByUsername(String username) {
		return supportRepository.findByUsernameAndIsDeleted(username, "N");
	}
	
	// 문의내역 키워드 조회(사용자)
    public List<UserSupport> getInquiriesByKeyword(String username, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return supportRepository.findByUsernameAndIsDeleted(username, "N"); // 모든 문의 리스트 반환
        }
        return supportRepository.findByTitleContainingAndUsernameAndIsDeleted(keyword, username, "N"); // 키워드 기반 검색
    }

	// 문의내역 상세조회(사용자)
    public Optional<UserSupport> getInquiryById(int inquiryNo, String username) {
        Optional<UserSupport> inquiry = supportRepository.findById(inquiryNo);

        if (inquiry.isPresent() && inquiry.get().getUsername().equals(username)) {
            return inquiry; // 작성자 본인의 문의만 반환
        }
        return Optional.empty();
    }
}
