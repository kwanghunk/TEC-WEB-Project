package com.tecProject.tec.dto.support;

import java.time.LocalDateTime;

import com.tecProject.tec.domain.UserSupport;
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
public class SupportReplyUpdateDTO {
    private int inquiryNo;        // 부모 문의 번호
    private int replyNo;          // 답글 번호
    private String content;       // 답글 내용
    private LocalDateTime modifiedDate; // 수정일

    // Entity → DTO 변환 (조회 시 사용)
    public static SupportReplyUpdateDTO fromEntity(UserSupport entity) {
        return SupportReplyUpdateDTO.builder()
                .inquiryNo(entity.getParentInquiry().getInquiryNo()) // 부모 문의 번호
                .replyNo(entity.getInquiryNo()) // 답글 번호
                .content(entity.getContent())
                .modifiedDate(entity.getModifiedDate())
                .build();
    }
}
