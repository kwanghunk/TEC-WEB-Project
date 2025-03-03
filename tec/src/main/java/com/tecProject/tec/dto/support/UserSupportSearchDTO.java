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
public class UserSupportSearchDTO {
    private int inquiryNo;        // 문의 번호
    private String username;      // 작성자
    private String title;         // 문의 제목
    private InquiryCategory category; // 카테고리 (일반 문의, 결제 문의 등)
    private InquiryStatus status; // 문의 상태 (WAITING, IN_PROGRESS, COMPLETED)
    private String isDeleted;     // 삭제 여부
    private LocalDateTime createdDate; // 작성일
    private LocalDateTime modifiedDate; // 수정일 (수정 내역 표시)
    
    public static UserSupportSearchDTO fromEntity(UserSupport entity) {
        return UserSupportSearchDTO.builder()
                .inquiryNo(entity.getInquiryNo()) // 문의 번호 포함
                .username(entity.getUsername())
                .title(entity.getTitle())
                .category(entity.getCategory())
                .status(entity.getStatus()) // Enum 상태 반영
                .isDeleted(entity.getIsDeleted())
                .createdDate(entity.getCreatedDate())
                .modifiedDate(entity.getModifiedDate()) // 수정된 시간 표시
                .build();
    }
}
