package com.tecProject.tec.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.tecProject.tec.domain.UserSupport;
import com.tecProject.tec.domain.UserSupport.InquiryCategory;
import com.tecProject.tec.dto.AdminSupportDTO;
import com.tecProject.tec.service.AdminSupportService;

@RestController
@RequestMapping("/admin/support")
public class AdminSupportController {
	private final AdminSupportService adminSupportService;
	
	public AdminSupportController(AdminSupportService adminSupportService) {
		this.adminSupportService = adminSupportService;
	}
    // 문의내역 전체조회(관리자)
	@GetMapping
	public ResponseEntity<?> getFilteredInquiries(
			@RequestParam(name = "page", defaultValue = "0") int page,
	        @RequestParam(name = "size", defaultValue = "10") int size,
	        @RequestParam(name = "category", required = false) InquiryCategory category,
	        @RequestParam(name = "keyword", required = false) String keyword) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
		}
		// ROLE_ADMIN 권한 검증
		if (!authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
		}
	    Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdDate"));
	    Page<UserSupport> inquiries = adminSupportService.getFilteredInquiries(pageable, category, keyword);
	    System.out.println("inquiries: " + inquiries);
	    // DTO 변환
	    Page<AdminSupportDTO> dtoInquiries = inquiries.map(inquiry -> new AdminSupportDTO(
	    		inquiry.getInquiryNo(),
	    		inquiry.getTitle(),
	    		inquiry.getStatus(),
	    		inquiry.getCategory(),
	    		inquiry.getCreatedDate(),
	    		inquiry.getModifiedDate()
		));
	    System.out.println("dtoInquiries: " + dtoInquiries);
	    return ResponseEntity.ok(dtoInquiries);
	}
	
	// 문의내역 상세조회(관리자)
	@GetMapping("/{inquiryNo}")
	public ResponseEntity<?> getInquiryById(@PathVariable("inquiryNo") int inquiryNo) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
		}
		// ROLE_ADMIN 권한 검증
		if (!authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
		}
		Optional<UserSupport> inquiry = adminSupportService.getInquiryById(inquiryNo);
		if (inquiry.isPresent()) {
			return ResponseEntity.ok(inquiry.get());
		} else {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("문의 정보를 조회할 수 없습니다.");
		}
	}
	
	// 문의내역 답변 작성/수정(관리자)
	@PutMapping("{inquiryNo}")
	public ResponseEntity<?> updqteInquiry(
			@PathVariable("inquiryNo") int inquiryNo, 
			@RequestBody Map<String, String> requestBody) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
		}
		// ROLE_ADMIN 권한 검증
		if (!authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
		}
		String reply = requestBody.get("reply");
		if (reply == null || reply.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("답변 내용이 없습니다.");
		}
		Optional<UserSupport> updatedInquiry = adminSupportService.updateInquiry(inquiryNo, reply);
	    if (updatedInquiry.isPresent()) {
	        return ResponseEntity.ok(updatedInquiry.get());
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("문의가 존재하지 않습니다.");
	    }
	}
	
}
