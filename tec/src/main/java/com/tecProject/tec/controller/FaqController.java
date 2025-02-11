package com.tecProject.tec.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tecProject.tec.auth.JWTUtil;
import com.tecProject.tec.domain.Faq;
import com.tecProject.tec.service.FaqService;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/faq")
@RequiredArgsConstructor
@Slf4j //로그 남김
public class FaqController {
	
	private final FaqService faqService;
	private final JWTUtil jwtUtil;
    
    // 모든 FAQ 가져오기
    @GetMapping("/faqs")
    public ResponseEntity<List<Faq>> getAllFaqs() {
        List<Faq> faqs = faqService.getAllFaqs();
        return ResponseEntity.ok(faqs);
    }
    
//    // 특정 FAQ 가져오기
//    @GetMapping("/{userId}")
//    public ResponseEntity<Faq> getFaqById(@PathVariable Long id) {
//        Optional<Faq> faq = faqService.findFaqById(id); // 수정된 findById 호출
//        return faq.map(ResponseEntity::ok)
//                  .orElse(ResponseEntity.notFound().build());
//    }
    
    //관리자 권한 확인
    @GetMapping("/check-admin")
    public ResponseEntity<String> checkAdminStatus(@RequestHeader("Authorization") String token) {
        try {
        	Claims claims = jwtUtil.parseToken(token.replace("Bearer ", ""));
            String username = claims.get("username", String.class);
            boolean isAdmin = faqService.isAdmin(username);
            return ResponseEntity.ok(isAdmin ? "ROLE_ADMIN" : "Not Admin");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
    }
    
    //FAQ 추가 (관리자 권한 확인 포함)
    @PostMapping("/Admin/faqs")
    public ResponseEntity<String> addFaq(@RequestBody Faq faq, @RequestHeader("Authorization") String token) {
        try {
            // JWT에서 사용자 이름 추출
        	Claims claims = jwtUtil.parseToken(token.replace("Bearer ", ""));
            String username = claims.get("username", String.class);
        	// FAQ 추가
        	faqService.submitFaq(faq, username);
            return ResponseEntity.ok("FAQ 추가 성공");
        } catch (SecurityException e) {
            log.error("권한 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 오류: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("잘못된 요청: {}", e.getMessage());
            return ResponseEntity.badRequest().body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            log.error("FAQ 추가 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("FAQ 추가 실패");
        }
    }
    
//    //
//    @GetMapping("/Admin/faqs")
//    public ResponseEntity<?> getAllFaqs(@RequestHeader("Authorization") String token) {
//        try {
//            String username = jwtUtil.getUsername(token.replace("Bearer ", ""));
//
//            return ResponseEntity.ok(faqService.getAllFaqs(username));
//        } catch (SecurityException e) {
//            log.error("권한 오류: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 오류: " + e.getMessage());
//        } catch (Exception e) {
//            log.error("FAQ 조회 실패: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("FAQ 조회 실패");
//        }
//    }

//    // FAQ 삭제
//    @DeleteMapping("/Admin/faqs/{id}")
//    public ResponseEntity<String> deleteFaq(@PathVariable Long id, @RequestHeader("Authorization") String token) {
//        try {
//            String username = jwtUtil.getUsername(token.replace("Bearer ", ""));
//
//            faqService.deleteFaq(id, username);
//            return ResponseEntity.ok("FAQ 삭제 성공");
//        } catch (SecurityException e) {
//            log.error("권한 오류: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("권한 오류: " + e.getMessage());
//        } catch (IllegalArgumentException e) {
//            log.error("잘못된 요청: {}", e.getMessage());
//            return ResponseEntity.badRequest().body("잘못된 요청: " + e.getMessage());
//        } catch (Exception e) {
//            log.error("FAQ 삭제 실패: {}", e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("FAQ 삭제 실패");
//        }
//    }
}