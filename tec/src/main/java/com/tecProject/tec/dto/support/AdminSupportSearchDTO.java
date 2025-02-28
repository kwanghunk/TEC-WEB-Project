package com.tecProject.tec.dto.support;

import java.time.LocalDateTime;

import com.tecProject.tec.domain.UserSupport;
import com.tecProject.tec.domain.UserSupport.InquiryCategory;
import com.tecProject.tec.domain.UserSupport.InquiryStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminSupportSearchDTO {
    private int inquiryNo;        // 문의 번호
    private String title;         // 문의 제목
    private InquiryStatus status; // 문의 상태
    private String username;      // 작성자
    private InquiryCategory category; // 카테고리
    private LocalDateTime createdDate; // 작성일
    private LocalDateTime modifiedDate; // 수정일
	
    public static AdminSupportSearchDTO fromEntity(UserSupport entity) {
        return AdminSupportSearchDTO.builder()
                .inquiryNo(entity.getInquiryNo())
                .title(entity.getTitle())
                .status(entity.getStatus())
                .username(entity.getUsername())
                .category(entity.getCategory())
                .createdDate(entity.getCreatedDate())
                .modifiedDate(entity.getModifiedDate())
                .build();
    }
}
