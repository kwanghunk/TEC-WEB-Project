package com.tecProject.tec.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tecProject.tec.auth.JWTUtil;
import com.tecProject.tec.domain.User;
import com.tecProject.tec.dto.LoginDTO;
import com.tecProject.tec.service.LoginService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/user")
public class LoginController {

	private final LoginService loginService;
	private final JWTUtil jwtUtil;

	public LoginController(LoginService loginService, JWTUtil jwtUtil) {
		this.loginService = loginService;
		this.jwtUtil = jwtUtil;
	}
	
	// 로그인 검증 및 AT, RT 발급 API
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
		try {
			// 로그인 시 유효한 사용자 인증 수행
			User user = loginService.authenticateUser(loginDTO);
			
			if (user == null) {
				throw new BadCredentialsException("아이디 또는 비밀번호가 잘못되었습니다.");
			}
			
			// Access Token 및 Refresh Token 생성
			String tokenFamily = UUID.randomUUID().toString(); // Refresh Token 관리용 고유 ID
			String accessToken = jwtUtil.createAccessToken(user.getUsername(), user.getUserType(), 1000L * 60 * 15); // 15분
			String refreshToken = jwtUtil.createRefreshToken(user.getUsername(), user.getUserType(), tokenFamily);
			
			// Refresh Token을 쿠키에 저장
			ResponseCookie refreshTokenCookie = ResponseCookie.from("refreshToken", refreshToken)
					.httpOnly(true)
					.secure(true)
					.sameSite("Strict") // CSRF 방어설정
					.path("/")
					.maxAge(24 * 60 * 60) // 24시간
					.build();
			
			// 쿠키 설정 추가
			return ResponseEntity.ok()
					.header("Set-Cookie", refreshTokenCookie.toString())
					.body(Map.of("accessToken", accessToken, "username", user.getUsername(), "userType", user.getUserType()));
		} catch (BadCredentialsException e) {
			return ResponseEntity.status(401).body("아이디 또는 비밀번호가 잘못되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("서버 오류가 발생했습니다.");
		}
	}
	
	// 로그인 후 && 새로고침 시 사용자 검증 API
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(name = "Authorization", required = false) String token) {
        // 1️⃣ Access Token이 없는 경우 → 비회원 응답 반환
        if (token == null || !token.startsWith("Bearer ")) {
        	System.out.println("token: " + token);
            Map<String, String> response = new HashMap<>();
            response.put("username", "Guest");
            response.put("userType", "GUEST");
            return ResponseEntity.ok(response);
        }
    	try {
            Claims claims = jwtUtil.parseToken(token.replace("Bearer ", "")); // JWT 토큰 검증
            String username = claims.get("username", String.class);
            String userType = claims.get("userType", String.class);

            Map<String, String> response = new HashMap<>();
            response.put("username", username);
            response.put("userType", userType);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
        	System.out.println("/user/me - Access Token 검증 실패: " + e.getMessage()); // 디버깅 로그
            return ResponseEntity.status(401).body("Unauthorized");
        }
    }
	
	// 로그아웃 시 Redis의 RT 제거 API
	@PostMapping("/logout")
	public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
		
	    Cookie deleteCookie = new Cookie("refreshToken", null);
	    deleteCookie.setHttpOnly(true);
	    deleteCookie.setSecure(true);
	    deleteCookie.setPath("/");
	    deleteCookie.setMaxAge(0); // 쿠키 즉시 삭제
	    response.addCookie(deleteCookie);

	    // 헤더에서 Refresh Token 가져오기
	    String refreshToken = request.getHeader("Refresh-Token");

	    // Redis에서 Refresh Token 삭제
	    if (refreshToken != null) {
	        jwtUtil.revokeRefreshToken(refreshToken);
	    }

	    return ResponseEntity.ok("로그아웃 성공! Refresh Token 삭제 완료");
	}
}

