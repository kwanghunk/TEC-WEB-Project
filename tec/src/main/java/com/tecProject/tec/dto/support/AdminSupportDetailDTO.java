package com.tecProject.tec.dto.support;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.tecProject.tec.domain.UserSupport;
import com.tecProject.tec.domain.UserSupport.InquiryCategory;
import com.tecProject.tec.domain.UserSupport.InquiryStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class AdminSupportDetailDTO {
    private int inquiryNo;        // 문의 번호
    private String title;         // 문의 제목
    private String content;       // 문의 내용
    private InquiryStatus status; // 문의 상태
    private String username;      // 작성자
    private InquiryCategory category; // 카테고리
    private String isDeleted;     // 삭제 여부
    private LocalDateTime createdDate; // 작성일
    private LocalDateTime modifiedDate; // 수정일
    private Integer parentInquiry; // 부모 답글 ID
    private List<AdminSupportDetailDTO> replies; // 답글 리스트 추가 (계층형)

    // Entity → DTO 변환 (조회 시 사용)
    public static AdminSupportDetailDTO fromEntity(UserSupport entity) {
        return AdminSupportDetailDTO.builder()
                .inquiryNo(entity.getInquiryNo())
                .title(entity.getTitle())
                .content(entity.getContent())
                .status(entity.getStatus())
                .username(entity.getUsername())
                .category(entity.getCategory())
                .isDeleted(entity.getIsDeleted())
                .createdDate(entity.getCreatedDate())
                .modifiedDate(entity.getModifiedDate())
                .parentInquiry(entity.getParentInquiry() != null ? entity.getParentInquiry().getInquiryNo() : null)
                .replies(new ArrayList<>()) // 계층형 구조로 변환 시 추가
                .build();
    }

}
