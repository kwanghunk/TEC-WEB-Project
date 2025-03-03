package com.tecProject.tec.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Queue;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tecProject.tec.domain.UserSupport;
import com.tecProject.tec.domain.UserSupport.InquiryCategory;
import com.tecProject.tec.domain.UserSupport.InquiryStatus;
import com.tecProject.tec.dto.support.AdminSupportDetailDTO;
import com.tecProject.tec.repository.SupportRepository;
import com.tecProject.tec.repository.UserRepository;

@Service
public class AdminSupportService {
	private final SupportRepository supportRepository;
	private final UserRepository userRepository;
	
	public AdminSupportService(SupportRepository supportRepository, UserRepository userRepository) {
		this.supportRepository = supportRepository;
		this.userRepository = userRepository;
	}
	
    // 문의내역 전체조회(관리자)
	public Page<UserSupport> getFilteredInquiries(Pageable pageable, InquiryStatus status, InquiryCategory category, String keyword) {
	    if (status != null && category != null && keyword != null) { // 문의상태 + 카테고리 + 키워드 조회
	        return supportRepository.findByStatusAndCategoryAndTitleContainingAndIsDeletedAndParentInquiryIsNull(status, category, keyword, "N", pageable);
	    } else if (status != null && category != null) { // 문의상태 + 카테고리
	    	return supportRepository.findByStatusAndCategoryAndIsDeletedAndParentInquiryIsNull(status, category, "N", pageable);
	    } else if (status != null && keyword != null) { // 문의상태 + 키워드
	    	return supportRepository.findByStatusAndTitleContainingAndIsDeletedAndParentInquiryIsNull(status, keyword, "N", pageable);
	    } else if (category != null && keyword != null) { // 카테고리 + 키워드
	    	return supportRepository.findByCategoryAndTitleContainingAndIsDeletedAndParentInquiryIsNull(category, keyword, "N", pageable);
	    } else if (status != null) { // 문의상태 조회
	        return supportRepository.findByStatusAndIsDeletedAndParentInquiryIsNull(status, "N", pageable);
	    } else if (category != null) { // 카테고리 조회
	        return supportRepository.findByCategoryAndIsDeletedAndParentInquiryIsNull(category, "N", pageable);
	    } else if (keyword != null) { // 키워드 조회
	        return supportRepository.findByTitleContainingAndIsDeletedAndParentInquiryIsNull(keyword, "N", pageable);
	    } // 기본 전체 조회
	    return supportRepository.findByIsDeletedAndParentInquiryIsNull("N", pageable); 
	}

    @Transactional(readOnly = true)
    public Optional<AdminSupportDetailDTO> getInquiryById(int inquiryNo) {
        Optional<UserSupport> inquiry = supportRepository.findById(inquiryNo);

        if (inquiry.isPresent()) {
            AdminSupportDetailDTO dto = AdminSupportDetailDTO.fromEntity(inquiry.get());
            dto.setReplies(getRepliesRecursively(inquiry.get())); // 트리 구조 조회
            System.out.println("dto: \n" + dto);
            return Optional.of(dto);
        }
        return Optional.empty();
    }
	
    // 재귀적으로 모든 답변 조회 (하위 답변까지 가져옴)
    private List<AdminSupportDetailDTO> getRepliesRecursively(UserSupport parent) {
        List<UserSupport> replies = supportRepository.findAllRepliesByParentInquiryNo(parent.getInquiryNo());

        return replies.stream()
                .filter(reply -> "N".equals(reply.getIsDeleted())) // 삭제되지 않은 데이터만 필터링
                .map(reply -> {
                    AdminSupportDetailDTO dto = AdminSupportDetailDTO.fromEntity(reply);
                    dto.setReplies(getRepliesRecursively(reply)); // 재귀 호출하여 하위 답변까지 가져오기
                    return dto;
                })
                .collect(Collectors.toList());
    }
}