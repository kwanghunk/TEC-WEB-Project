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
import com.tecProject.tec.service.TranslationService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ip")
public class IpController {
	
	private final IpService ipService;
	private final IpUtil ipUtil;
	
	public IpController(IpService ipService, IpUtil ipUtil) {
		this.ipService = ipService;
		this.ipUtil = ipUtil;
	}
	
    @GetMapping("/check")
    public ResponseEntity<?> checkRequestLimit(HttpServletRequest request) {
        /*
    	boolean isAllowed = ipService.isRequestAllowed(request);

        if (isAllowed) {
            return ResponseEntity.ok("✅ 요청 가능");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("🚫 요청 제한 초과");
        }*/
    	
        try {
            String ipAddress = ipUtil.getClientIp(request);  // ✅ IP 주소 가져오기
            String username = ipUtil.getUsernameFromToken(request);  // ✅ JWT에서 사용자 이름 가져오기
            boolean isAllowed = ipService.isRequestAllowed(request); // ✅ 요청 가능 여부 확인

            // 응답 데이터 구성
            Map<String, Object> response = Map.of(
                "ip", ipAddress,
                "user", username,
                "isAllowed", isAllowed,
                "message", isAllowed ? "✅ 요청 가능" : "🚫 요청 제한 초과"
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
}