package com.tecProject.tec.dto;

import java.time.LocalDateTime;

import com.tecProject.tec.domain.UserSupport.InquiryCategory;

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
	private String status;
	private InquiryCategory category;
	private LocalDateTime createDate;
	private LocalDateTime modifiedDate;
	private String isDeleted;
	private LocalDateTime deletedDate;
	private String reply;
	private LocalDateTime replyDate;
	
	// (사용자)문의 등록 생성자
	public UserSupportDTO(String title, String content, String status, InquiryCategory category, String isDeleted) {
		this.title = title;
		this.content = content;
		this.status = status;
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
	public UserSupportDTO(Integer inquiryNo, String status, InquiryCategory category, String title, LocalDateTime createDate) {
		this.inquiryNo = inquiryNo;
		this.status = status;
		this.title = title;
		this.category = category;
		this.createDate = createDate;
	}
	
	// (사용자)문의 상세조회 생성자
	public UserSupportDTO(Integer inquiryNo, String status, InquiryCategory category, String title, String content, LocalDateTime createDate, LocalDateTime modifiedDate, String reply, LocalDateTime replyDate) {
		this.inquiryNo = inquiryNo;
		this.status = status;
		this.category = category;
		this.title = title;
		this.content = content;
		this.createDate = createDate;
		this.modifiedDate = modifiedDate;
		this.reply = reply;
		this.replyDate = replyDate;
	}
}
