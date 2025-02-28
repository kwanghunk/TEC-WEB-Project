package com.tecProject.tec.dto.support;

import java.time.LocalDateTime;
import java.util.List;

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
public class SupportReplyWriteDTO {
    private int inquiryNo;        // 문의 번호
    private String title;		  // 문의 제목
    private String content;       // 문의 내용
    private InquiryCategory category; // 카테고리 (일반 문의, 결제 문의 등)
    private InquiryStatus status; // 문의 상태 (WAITING, IN_PROGRESS, COMPLETED)
    private String isDeleted;     // 삭제 여부
    private LocalDateTime createdDate; // 작성일
    private LocalDateTime modifiedDate; // 수정일
    private List<SupportReplyWriteDTO> replies; // 답글 리스트 추가
    
    public static SupportReplyWriteDTO fromEntity(UserSupport entity) {
        return SupportReplyWriteDTO.builder()
                .inquiryNo(entity.getInquiryNo())
                .content(entity.getContent())
                .category(entity.getCategory())
                .status(entity.getStatus())
                .isDeleted(entity.getIsDeleted())
                .createdDate(entity.getCreatedDate())
                .modifiedDate(entity.getModifiedDate())
                .build();
    }
}
