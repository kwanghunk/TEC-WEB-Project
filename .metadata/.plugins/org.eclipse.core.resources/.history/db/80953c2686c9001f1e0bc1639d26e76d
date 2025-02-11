package com.tecProject.tec.domain;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table (name = "CODE")

public class Code {
	
	//번역코드의 고유식별자_Primary Key
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "CODE_ID", nullable = false)
    private Integer codeId;
		
		//원본코드
		@Column(name = "ORIGIN_CODE", length = 100, nullable = true)
		private String originCode;
		
		//번역결과 JSON
		@Column(name = "TRANSLATE_CODE", nullable = false, columnDefinition = "TEXT")
		private String translateCode;
}