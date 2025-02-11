package com.tecProject.tec.domain;

import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "USER_SUPPORT")

public class UserSupport {
	
	//고객문의번호
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "INQUIRY_NO", nullable = false)
	private int inquiryNo;
	
		//회원 ID
		@Column(name = "USER_NAME", nullable = false, length = 50)
		private String username;
		
		//문의글 제목
		@Column(name = "TITLE", nullable = false, length = 100)
		private String title;
		
		//문의 내용
		@Column(name = "CONTENT", columnDefinition = "TEXT")
		private String content;
		
		//관리자 답변
		@Column(name = "REPLY", columnDefinition = "TEXT")
		private String reply;
		
		//관리자 답변 작성 일자
		@Column(name = "REPLY_DATE")
		private LocalDateTime replyDate;
		
		//문의 상태: 대기, 수정, 답변 완료
		@Column(name = "STATUS", nullable = false)
		private String status;
		
		//생성일자
		@Column(name = "CREATED_DATE", nullable = false, updatable = false)
		@CreatedDate
		private LocalDateTime createdDate;
		
		//수정 일자
		@Column(name = "MODIFIED_DATE")
		private LocalDateTime modifiedDate;
		
		//글 삭제여부
		@Column(name = "IS_DELETED", nullable = false, length = 2)
		private String isDeleted;
		
		//글 삭제일자
		@Column(name = "DELETED_DATE")
		private LocalDateTime deletedDate;
		
		//카테고리 타입
		@Column(name = "CATEGORY", nullable = false)
		@Enumerated(EnumType.STRING)
		private InquiryCategory category;
		
		public enum InquiryCategory {
			GENERAL("일반 문의"),
			PAYMENT("결제/환불 문의"),
			ACCOUNT_SUPPORT("계정 문의"),
			TECH_SUPPORT("기술 지원"),
			FEEDBACK("제안 및 피드백"),
			OTHER("기타");
			
			private String description;
			
			InquiryCategory(String description) {
				this.description = description;
			}
			
			public String getDescription() {
				return description;
			}
		}
}