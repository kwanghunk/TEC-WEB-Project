package com.tecProject.tec.dto;

import java.time.LocalDateTime;

import com.tecProject.tec.domain.UserSupport.InquiryCategory;
import com.tecProject.tec.domain.UserSupport.InquiryStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminSupportDTO {
	private int inquiryNo;
	private String title;
	private InquiryStatus status;
	private String userName;
	private InquiryCategory category;
	private LocalDateTime createdDate;
	private LocalDateTime modifiedDate;
	
	public AdminSupportDTO(int inquiryNo, InquiryStatus inquiryStatus, String userName, InquiryCategory category, LocalDateTime createdDate, LocalDateTime modifiedDate) {
		this.inquiryNo = inquiryNo;
		this.title = title;
		this.userName = userName;
		this.category = category;
		this.createdDate = createdDate;
		this.modifiedDate = modifiedDate;
	}
}
