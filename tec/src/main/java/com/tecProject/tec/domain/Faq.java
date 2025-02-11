package com.tecProject.tec.domain;

import java.time.LocalDateTime;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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
@Table(name = "FAQ")

public class Faq {
	
	//FAQ 번호 (Primary Key)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "FAQ_NO", nullable = false)
	private Long faqNo;
		
		//회원 ID
		@Column(name = "USER_NAME", nullable = false, length = 50)
		private String username;
		  
		//질문 내용(500자 제한, 필수)
		@Column(name = "QUESTION", nullable = false, length = 500)
		private String question;
		  
		//답변 내용(1000자 제한, 필수)
		@Column(name = "ANSWER", nullable = false, length = 1000)
		private String answer;
		 
		//생성일자(필수)
		@Column(name = "CREATED_DATE", nullable = false)
		private LocalDateTime createDate;
		
		//수정일자
		@Column(name = "MODIFIED_DATE", nullable = true)
		private LocalDateTime modifiedDate;
		  
		//삭제여부(YorN 필수)
	    @Column(name = "Y0RN_DELETED", nullable = false, length = 1)
	    private String isDeleted; // 삭제 여부 ("Y" 또는 "N", 필수)
	    
		//글삭제일자
		@Column(name = "DELETED_DATE", nullable = true) //null 허용
		private LocalDateTime deletedDate;
}