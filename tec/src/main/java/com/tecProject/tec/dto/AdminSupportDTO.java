package com.tecProject.tec.dto;

import java.time.LocalDateTime;

import com.tecProject.tec.domain.UserSupport.InquiryCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminSupportDTO {
	private int inquiryNo;
	private String title;
	private String status;
	private InquiryCategory category;
	private LocalDateTime createdDate;
	private LocalDateTime modifiedDate;
	
	public AdminSupportDTO(int inquiryNo, String title, InquiryCategory category, LocalDateTime createdDate, LocalDateTime modifiedDate) {
		this.inquiryNo = inquiryNo;
		this.title = title;
		this.category = category;
		this.createdDate = createdDate;
		this.modifiedDate = modifiedDate;
	}
}
