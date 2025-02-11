package com.tecProject.tec.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaveHistoryDTO {
	private Integer saveHistoryNo; // 추가: 히스토리 번호(ID)
	private String username; // 사용자 이름
	private String historyTitle; // 제목
	private String requestCode; // 원본 코드
	private String responseCode; // 번역된 코드
	private String typeCode; // 요청 언어
	private LocalDateTime saveTime; // 저장 시간
	
	// 저장 시 사용하는 생성자
	public SaveHistoryDTO(String historyTitle, String requestCode, String responseCode, String typeCode) {
		this.historyTitle = historyTitle;
		this.requestCode = requestCode;
		this.responseCode = responseCode;
		this.typeCode = typeCode;
	}
	
	// 조회 시 사용하는 생성자
	public SaveHistoryDTO(Integer saveHistoryNo, String username, String historyTitle, LocalDateTime saveTime) {
		this.saveHistoryNo = saveHistoryNo;
		this.username = username;
		this.historyTitle = historyTitle;
		this.saveTime = saveTime;
	}
	
    // 상세 조회 시 사용하는 생성자
    public SaveHistoryDTO(Integer saveHistoryNo, String requestCode, String responseCode, String typeCode) {
        this.saveHistoryNo = saveHistoryNo;
        this.requestCode = requestCode;
        this.responseCode = responseCode;
        this.typeCode = typeCode;
    }
}
