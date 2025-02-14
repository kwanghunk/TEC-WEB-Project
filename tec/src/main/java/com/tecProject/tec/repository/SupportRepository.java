package com.tecProject.tec.repository;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tecProject.tec.domain.UserSupport;
import com.tecProject.tec.domain.UserSupport.InquiryCategory;
import com.tecProject.tec.dto.AdminSupportDTO;

@Repository
public interface SupportRepository extends JpaRepository<UserSupport, Integer> {

	// 문의내역 전체조회(사용자)
	List<UserSupport> findByUsernameAndIsDeleted(String username, String isDeleted);
	
    // 제목 키워드로 삭제되지 않은 문의 조회
    List<UserSupport> findByTitleContainingAndUsernameAndIsDeleted(String title, String username, String isDeleted);
    
    // 문의내역 전체조회(관리자)
    Page<UserSupport> findByCategoryAndTitleContainingAndIsDeleted(InquiryCategory category, String keyword, String isDeleted, Pageable pageable);
    Page<UserSupport> findByCategoryAndIsDeleted(InquiryCategory category, String isDeleted, Pageable pageable);
    Page<UserSupport> findByTitleContainingAndIsDeleted(String keyword, String isDeleted, Pageable pageable);
	Page<UserSupport> findByIsDeleted(String string, Pageable pageable);

}
