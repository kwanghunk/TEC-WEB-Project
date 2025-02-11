package com.tecProject.tec.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tecProject.tec.domain.Code;
import com.tecProject.tec.service.AdminCodeService;

@RestController
@RequestMapping("/admin/code")
public class AdminCodeController {

	private final AdminCodeService adminService;
	
    // 서비스 사용 준비
    public AdminCodeController(AdminCodeService adminService) {
        this.adminService = adminService;
    }
    
    // 자동완성 키워드 검색 기능
    @GetMapping("/suggestions")
    public ResponseEntity<?> getSeggestions(@RequestParam("query") String query) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
		}
		// ROLE_ADMIN 권한 검증
		if (!authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
		}
    	List<String> suggestions = adminService.getSuggestions(query);
    	return ResponseEntity.ok(suggestions);
    }
    
    // 특정 키워드의 상세 번역 정보 조회
    @GetMapping("/details")
    public ResponseEntity<?> getDetails(@RequestParam("keyword") String keyword) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
		}
		// ROLE_ADMIN 권한 검증
		if (!authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
		}
    	return adminService.getCodeDetails(keyword)
    			.map(ResponseEntity::ok)
    			.orElse(ResponseEntity.notFound().build());
    }

    // 번역데이터 저장 또는 수정 기능
    @PostMapping("/addKeyword")
    public ResponseEntity<?> saveCode(@RequestBody Code code) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
		}
		// ROLE_ADMIN 권한 검증
		if (!authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"))) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
		}
        if (code.getOriginCode() == null || code.getOriginCode().trim().isEmpty()) {        	
            return ResponseEntity.badRequest().body("originCode는 null이 될 수 없습니다.");
        }
        if (code.getTranslateCode() == null || code.getTranslateCode().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("translateCode는 null이 될 수 없습니다.");
        }
        
    	Code savedCode = adminService.saveCode(code);
    	return ResponseEntity.ok(savedCode);
    }
    
    @GetMapping("/auth")
    public ResponseEntity<?> checkAuth() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
		}
	    // ROLE_ADMIN 권한 검증
	    boolean isAdmin = authentication.getAuthorities().stream()
	            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
	    System.out.println("isAdmin: " + isAdmin);
	    if (!isAdmin) {
	        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한이 없습니다.");
	    }
	    // 권한 확인 성공
	    return ResponseEntity.ok(true);
    }

}