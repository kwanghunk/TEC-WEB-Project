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
public class UserSupportWriteDTO {
    private String title;        // 문의 제목
    private String content;      // 문의 내용
    private InquiryStatus status; // 문의 상태 (WAITING, IN_PROGRESS, COMPLETED)
    private InquiryCategory category; // 카테고리 (일반 문의, 결제 문의 등)
    private String isDeleted;    // 삭제 여부
    private LocalDateTime createdDate; // 작성일

    // 문의 등록 시 사용할 생성자 (기본 상태 WAITING 설정)
    public UserSupportWriteDTO(String username, String title, String content, InquiryCategory category) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.status = InquiryStatus.WAITING; // 기본 상태
        this.isDeleted = "N"; // 삭제 여부 기본값
        this.createdDate = LocalDateTime.now();
    }

    // Entity → DTO 변환 (조회용)
    public static UserSupportWriteDTO fromEntity(UserSupport entity) {
        return UserSupportWriteDTO.builder()
                .title(entity.getTitle())
                .content(entity.getContent())
                .status(entity.getStatus()) // Enum 상태 반영
                .category(entity.getCategory())
                .isDeleted(entity.getIsDeleted())
                .createdDate(entity.getCreatedDate())
                .build();
    }
}
