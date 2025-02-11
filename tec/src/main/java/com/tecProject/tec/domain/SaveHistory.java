package com.tecProject.tec.domain;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table (name = "SAVEHISTORY")

public class SaveHistory {
	
	//요청ID (Primary Key)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "SAVEHISTORY_NO", nullable = false)
	private Integer saveHistoryNo;
	
		//회원ID
		@Column(name = "USER_NAME", length = 30)
	    private String username;
		
		//번역결과 저장 요청 시간
		@Column(name = "SAVE_TIME", nullable = false)
	    private LocalDateTime saveTime;
		
		//번역할 코드언어
		@Column(name = "TYPE_CODE", length = 20, nullable = false)
	    private String typeCode;
		
		//요청된 원본코드 및 메타데이터
		@Lob // 긴 내용을 저장할 때 사용
		@Column(name = "REQUEST_CODE", columnDefinition = "TEXT")//요청코드와 메타데이를 JSON형태로 저장
	    private String requestCode;
		
		//요청코드에 대한 응답 데이터
		@Lob
		@Column(name = "RESPONSE_CODE", columnDefinition = "TEXT")
	    private String responseCode;
		
		//코드 실행 흐름 또는 코드 역할 설명(코드설명은 추후 openAI API 적용예정)
		@Lob //긴 설명 저장하는데 사용
		@Column(name = "CODE_DESCRIPTION", columnDefinition = "TEXT")
	    private String codeDescription;
		
		@Column(name = "HISTORY_TITLE", length = 255, nullable = false)
		private String historyTitle;
}