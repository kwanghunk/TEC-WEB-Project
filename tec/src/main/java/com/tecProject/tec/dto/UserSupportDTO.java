package com.tecProject.tec.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.tecProject.tec.domain.UserSupport;
import com.tecProject.tec.domain.UserSupport.InquiryCategory;
import com.tecProject.tec.domain.UserSupport.InquiryStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSupportDTO {
	private Integer inquiryNo;
	private String title;
	private String content;
	private InquiryStatus status;
	private String username;
	private InquiryCategory category;
	private LocalDateTime createDate;
	private LocalDateTime modifiedDate;
	private String isDeleted;
	private LocalDateTime deletedDate;
	private List<String> replies;
	
	// (사용자)문의 등록 생성자
	public UserSupportDTO(String title, String content, InquiryStatus inquiryStatus, InquiryCategory category, String isDeleted) {
		this.title = title;
		this.content = content;
		this.status = inquiryStatus;
		this.category = category;
		this.isDeleted = isDeleted;
	}
	
	// (사용자)문의 수정 생성자
	public UserSupportDTO(String title, String content, InquiryCategory category) {
		this.title = title;
		this.content = content;
		this.category = category;
	}
	
	// (사용자)문의 삭제 생성자
	public UserSupportDTO(String isDeleted) {
		this.isDeleted = isDeleted;
	}
	
	// (사용자)문의 조회 생성자
	public UserSupportDTO(Integer inquiryNo, InquiryStatus inquiryStatus, InquiryCategory category, String title, LocalDateTime createDate) {
		this.inquiryNo = inquiryNo;
		this.status = inquiryStatus;
		this.title = title;
		this.category = category;
		this.createDate = createDate;
	}
	
	// (사용자)문의 상세조회 생성자
	public UserSupportDTO(Integer inquiryNo, InquiryStatus inquiryStatus, InquiryCategory category, String title, String content, LocalDateTime createDate, LocalDateTime modifiedDate) {
		this.inquiryNo = inquiryNo;
		this.status = inquiryStatus;
		this.category = category;
		this.title = title;
		this.content = content;
		this.createDate = createDate;
		this.modifiedDate = modifiedDate;
	}
	
    public UserSupportDTO(UserSupport inquiry) {
        this.inquiryNo = inquiry.getInquiryNo();
        this.title = inquiry.getTitle();
        this.content = inquiry.getContent();
        this.status = inquiry.getStatus();
        this.username = inquiry.getUsername();
        this.createDate = inquiry.getCreatedDate();
        
        // Lazy Loading 방지: replies를 String 리스트로 변환하여 미리 로딩
        this.replies = inquiry.getReplies().stream()
                .map(UserSupport::getContent)
                .collect(Collectors.toList());
    }
}
