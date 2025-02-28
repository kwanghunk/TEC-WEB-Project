package com.tecProject.tec.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tecProject.tec.auth.IpUtil;
import com.tecProject.tec.auth.JWTUtil;
import com.tecProject.tec.service.IpService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/ip")
public class IpController {
	
	private final IpService ipService;
	private final IpUtil ipUtil;
	private final JWTUtil jwtUtil;
	
	public IpController(IpService ipService, IpUtil ipUtil, JWTUtil jwtUtil) {
		this.ipService = ipService;
		this.ipUtil = ipUtil;
		this.jwtUtil = jwtUtil;
	}
	
	// 회원, 비회원 확인 - 비회원의 경우 IP반환
    @GetMapping("/check")
    public ResponseEntity<?> checkUserIdentity(
    		@RequestHeader(name = "Authorization", required = false) String authHeader,
            HttpServletRequest request) {
    	
        try {
            // 디버깅 로그 추가
            System.out.println("[IpController] /api/ip/check 호출됨");
            System.out.println("[IpController] Authorization 헤더: " + authHeader);
            
            // Access Token이 존재하면 회원 → 즉시 응답 (IP 확인 불필요)
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
            	String token = authHeader.replace("Bearer ", "");
                
            	// Access Token 검증
                try {
                    Claims claims = jwtUtil.parseToken(token);
                    
                    // Claims 내부 정보 로그 추가
                    System.out.println("🔍 [IpController] Claims 정보: " + claims);
                    
                    // username 값을 올바르게 가져오기
                    String username = claims.get("username", String.class);
                    System.out.println("✅ [IpController] Access Token 검증 성공 - username: " + username);

                    return ResponseEntity.ok(Map.of("isMember", true, "message", "✅ 회원 인증 완료", "username", username));
                } catch (Exception e) {
                    System.out.println("❌ [IpController] Access Token 검증 실패: " + e.getMessage());
                }
            }
            
            // Access Token이 없으면 비회원 → IP 획득 후 응답 반환
            String ipAddress = ipUtil.getClientIp(request);  // IP 주소 가져오기
            Map<String, Object> response = Map.of( // 응답 데이터 구성
                "ip", ipAddress,
                "isMember", false,
                "message", "비회원 - IP 획득 완료"
            );

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "🚨 서버 오류 발생",
                "error", e.getMessage()
            ));
        }
    }
    
    // 비회원 번역 요청 시 요청 가능여부 확인 및 요청 카운트 증가
    @GetMapping("/validate")
    public ResponseEntity<?> validateGuestRequest(HttpServletRequest request) {
    	try {
    		// Access Token이 없으면 비회원 처리
    		String authHeader = request.getHeader("Authorization");
    		boolean isMember = authHeader != null && authHeader.startsWith("Bearer ");
    		
    		if (isMember) {
    			return ResponseEntity.ok(Map.of("isAllowed", true, "message", "회원 요청 허용"));
    		}
    		
    		// 비회원 요청 가능여부 확인
    		boolean isAllowed = ipService.isRequestAllowed(request);
    		
    		return isAllowed
    				? ResponseEntity.ok(Map.of("isAllowed", true, "message", "비회원 요청 가능"))
					: ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("isAllowed", false, "message", "비회원 요청 제한 초과"));
    	} catch (Exception e) {
    		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "message", "🚨 서버 오류 발생",
                "error", e.getMessage()
            ));
    	}
    }
    
}