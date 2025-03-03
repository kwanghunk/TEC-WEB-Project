package com.tecProject.tec.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tecProject.tec.domain.UserSupport;
import com.tecProject.tec.domain.UserSupport.InquiryCategory;
import com.tecProject.tec.domain.UserSupport.InquiryStatus;
import com.tecProject.tec.dto.UserSupportDTO;
import com.tecProject.tec.dto.support.AdminSupportDetailDTO;
import com.tecProject.tec.dto.support.SupportReplyUpdateDTO;
import com.tecProject.tec.dto.support.SupportReplyWriteDTO;
import com.tecProject.tec.dto.support.UserSupportDetailDTO;
import com.tecProject.tec.dto.support.UserSupportSearchDTO;
import com.tecProject.tec.dto.support.UserSupportWriteDTO;
import com.tecProject.tec.repository.SupportRepository;

@Service
@Transactional
public class SupportService {
	
	private final SupportRepository supportRepository;
    
	public SupportService(SupportRepository supportRepository) {
		this.supportRepository = supportRepository; 
	}

	// 문의 등록
	public UserSupportWriteDTO createInquiry(UserSupportWriteDTO userSupportDTO, String username) {
		UserSupport userSupport = new UserSupport();
		userSupport.setUsername(username); // 사용자 ID
		userSupport.setTitle(userSupportDTO.getTitle()); // 문의 제목
		userSupport.setContent(userSupportDTO.getContent()); // 문의 내용
		userSupport.setCategory(userSupportDTO.getCategory()); // 카테고리
		userSupport.setCreatedDate(LocalDateTime.now()); // 작성시간
		userSupport.setStatus(InquiryStatus.WAITING); // 기본 상태 설정
		userSupport.setIsDeleted("N"); // 삭제 여부 기본값
		UserSupport savedInquiry = supportRepository.save(userSupport);
		return new UserSupportWriteDTO(savedInquiry.getTitle(), savedInquiry.getContent(), 
				savedInquiry.getStatus(), savedInquiry.getCategory(), savedInquiry.getIsDeleted(), null);
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
	    // 문의 상태 검증: 대기 상태(WAITING)일 때만 수정 가능
	    if (inquiry.getStatus() != InquiryStatus.WAITING) {
	        return Optional.empty(); // 진행 중 또는 완료 상태면 수정 불가
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
        if (existingInquiry.isEmpty()) {
            return Optional.empty(); // 문의 없음
        }

        UserSupport inquiryToDelete = existingInquiry.get();

        // 사용자 권한 검증 (작성자만 삭제)
        if (!inquiryToDelete.getUsername().equals(username)) {
            throw new SecurityException("삭제 권한이 없습니다.");
        }

        // 문의상태 검증: 완료 상태인 경우 삭제 불가능
        if (inquiryToDelete.getStatus() == InquiryStatus.COMPLETED) {
            return Optional.empty();
        }

        // 이미 삭제된 문의인지 확인
        if ("Y".equals(inquiryToDelete.getIsDeleted())) {
            return Optional.empty();
        }

        // 소프트 삭제 처리
        inquiryToDelete.setIsDeleted("Y");
        inquiryToDelete.setDeletedDate(LocalDateTime.now());

        return Optional.of(supportRepository.save(inquiryToDelete));
    }

    // 문의내역 전체조회(사용자)
	public List<UserSupportSearchDTO> getInquiryByUsername(String username) {
	    List<UserSupport> inquiries = supportRepository.findByUsernameAndIsDeletedAndParentInquiryIsNull(username, "N");

	    return inquiries.stream()
	            .map(UserSupportSearchDTO::fromEntity) // DTO 변환
	            .toList();
	}
	
	// 문의내역 키워드 조회(사용자)
    public List<UserSupportSearchDTO> getInquiriesByKeyword(String username, String keyword) {
    	List<UserSupport> inquiries;
        if (keyword == null || keyword.trim().isEmpty()) {
            // 키워드가 없으면 전체 조회
            inquiries = supportRepository.findByUsernameAndIsDeletedAndParentInquiryIsNull(username, "N");
        } else {
            // 제목에 키워드가 포함된 문의 조회
            inquiries = supportRepository.findByTitleContainingAndUsernameAndIsDeletedAndParentInquiryIsNull(keyword, username, "N");
        }

        return inquiries.stream()
                .map(UserSupportSearchDTO::fromEntity) // DTO 변환
                .toList();
    }

	// 문의내역 상세조회(사용자)
    @Transactional(readOnly = true)
    public Optional<UserSupportDetailDTO> getInquiryById(int inquiryNo, String username) {
        Optional<UserSupport> inquiry = supportRepository.findById(inquiryNo);

        if (inquiry.isEmpty() && !inquiry.get().getUsername().equals(username)) {
            return Optional.empty(); // 작성자 본인의 문의만 반환
        }
        if ("Y".equals(inquiry.get().getIsDeleted())) {
        	return Optional.empty();
        }
        if (inquiry.isPresent()) {
        	UserSupportDetailDTO dto = UserSupportDetailDTO.fromEntity(inquiry.get());
            dto.setReplies(getRepliesRecursively(inquiry.get())); // 트리 구조 조회
            System.out.println("dto: \n" + dto);
            return Optional.of(dto);
        }
        return Optional.empty();
    }
    
    // 재귀적으로 모든 답변 조회 (하위 답변까지 가져옴)
    private List<UserSupportDetailDTO> getRepliesRecursively(UserSupport parent) {
        List<UserSupport> replies = supportRepository.findAllRepliesByParentInquiryNo(parent.getInquiryNo());

        return replies.stream()
                .filter(reply -> "N".equals(reply.getIsDeleted())) // 삭제되지 않은 데이터만 필터링
                .map(reply -> {
                	UserSupportDetailDTO dto = UserSupportDetailDTO.fromEntity(reply);
                    dto.setReplies(getRepliesRecursively(reply)); // 재귀 호출하여 하위 답변까지 가져오기
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 문의내역 답글 작성(작성자 || 관리자)
	public Optional<SupportReplyWriteDTO> addReply(int inquiryNo, String username, boolean isAdmin, String replyContent, Integer parentInquiryId) {
	    Optional<UserSupport> parentInquiryOpt = (parentInquiryId != null) 
	            ? supportRepository.findById(parentInquiryId)  // 부모 답변이 있는 경우 조회
	            : supportRepository.findById(inquiryNo);  // 부모 답변이 없으면 원문 조회
	    if (parentInquiryOpt.isEmpty() || "Y".equals(parentInquiryOpt.get().getIsDeleted())) {
	        return Optional.empty();
	    }
	    
	    if (!isAdmin && !parentInquiryOpt.get().getUsername().equals(username)) {
	    	return Optional.empty();
	    }
	    
	    if(parentInquiryOpt.get().getStatus().equals(InquiryStatus.COMPLETED)) {
	    	return Optional.empty();
	    }
	    
	    UserSupport parentInquiry = parentInquiryOpt.get();
	    UserSupport reply = UserSupport.builder()
	    		.username(username)
	    		.title("RE: " + parentInquiry.getTitle())
	    		.content(replyContent)
	    		.status(InquiryStatus.IN_PROGRESS)
	    		.category(parentInquiry.getCategory())
	    		.isDeleted("N")
	    		.createdDate(LocalDateTime.now())
	    		.parentInquiry(parentInquiry) // 부모 문의 연결
	    		.build();
       
        supportRepository.save(reply);
        
        // 부모 문의 상태 업데이트 (IN_PROGRESS)
        parentInquiry.setStatus(InquiryStatus.IN_PROGRESS);
        supportRepository.save(parentInquiry);

        return Optional.of(SupportReplyWriteDTO.fromEntity(reply));
	}

	// 문의내역 답글 수정(작성자 || 관리자)
	public Optional<SupportReplyUpdateDTO> editReply(int replyNo, String username, String newContent) {
        Optional<UserSupport> replyOpt = supportRepository.findById(replyNo);
        if (replyOpt.isEmpty()) {
            return Optional.empty();
        }

        UserSupport reply = replyOpt.get();

        if ("Y".equals(reply.getIsDeleted())) {
            return Optional.empty();
        }
        // 본인만 수정 가능
        if (!reply.getUsername().equals(username)) {
            return Optional.empty();
        }
        reply.setContent(newContent);
        reply.setModifiedDate(LocalDateTime.now());
        supportRepository.save(reply);
        return Optional.of(SupportReplyUpdateDTO.fromEntity(reply));
    }

	// 문의내역 답글 삭제(작성자 || 관리자)
    public boolean deleteReply(int replyNo, String username) {
        Optional<UserSupport> replyOpt = supportRepository.findById(replyNo);
        if (replyOpt.isEmpty()) {
            return false;
        }

        UserSupport reply = replyOpt.get();

        // 본인만 삭제 가능
        if (!reply.getUsername().equals(username)) {
            return false;
        }
        
        // DFS방식 하위 답글 먼저 삭제
        deleteRepliesRecursively(reply);
        
        // 부모 답글도 삭제 처리
        reply.setIsDeleted("Y");
        reply.setDeletedDate(LocalDateTime.now());

        supportRepository.save(reply);
        return true;
    }
    
    // 문의내역 상태 업데이트
    public boolean completeInquiry(int inquiryNo, String username, boolean isAdmin) {
        Optional<UserSupport> inquiryOpt = supportRepository.findById(inquiryNo);
        if (inquiryOpt.isEmpty()) {
            return false;
        }

        UserSupport inquiry = inquiryOpt.get();

        // 작성자 또는 관리자만 상태 변경 가능
        if (!inquiry.getUsername().equals(username) && !isAdmin) {
            return false;
        }

        updateStatusRecursively(inquiry, InquiryStatus.COMPLETED);

        return true;
    }
    
    private void deleteRepliesRecursively(UserSupport parentReply) {
        List<UserSupport> childReplies = supportRepository.findByParentInquiry(parentReply);

        for (UserSupport child : childReplies) {
            // 먼저 해당 답글의 하위 답글 삭제
            deleteRepliesRecursively(child);

            // 현재 답글 삭제 처리
            child.setIsDeleted("Y");
            child.setDeletedDate(LocalDateTime.now());
            supportRepository.save(child);
        }
    }
    
    private void updateStatusRecursively(UserSupport inquiry, InquiryStatus status) {
        inquiry.setStatus(status);
        supportRepository.save(inquiry);

        List<UserSupport> replies = supportRepository.findByParentInquiry(inquiry);
        for (UserSupport reply : replies) {
            updateStatusRecursively(reply, status);
        }
    }
}
