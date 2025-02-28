package com.tecProject.tec.auth;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JWTUtil {

	private final SecretKey secretKey;
	private final StringRedisTemplate redisTemplate;
	
	public JWTUtil(@Value("${spring.jwt.secret}")String secret, StringRedisTemplate redisTemplate) {
		this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
		this.redisTemplate = redisTemplate;
	}
	
	// AccessToken 생성
	public String createAccessToken(String username, String userType, Long expiredMs) {
		return Jwts.builder()
				.claim("username", username)
				.claim("userType", userType)
				.issuedAt(new Date(System.currentTimeMillis())) // 현재발행시간
				.expiration(new Date(System.currentTimeMillis() + expiredMs)) // 남은시간
				.signWith(secretKey)
				.compact();
	}
	
	// RefreshToken 생성
	public String createRefreshToken(String username, String userType, String tokenFamily) {
		String refreshToken = Jwts.builder()
				.claim("username", username)
				.claim("userType", userType)
				.claim("tokenFamily", tokenFamily)
				.issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24)) // 24시간
				.signWith(secretKey)
				.compact();
		// Redis에 저장 (24시간 만료)
		redisTemplate.opsForValue().set(tokenFamily, refreshToken, 24, TimeUnit.HOURS);
		return refreshToken;
	}
	
	// RefreshToken 검증
	public boolean isRefreshTokenValid(String refreshToken) {
		Claims claims = parseToken(refreshToken);
		String tokenFamily = claims.get("tokenFamily", String.class);
		String storedToken = redisTemplate.opsForValue().get(tokenFamily);
		
		if (storedToken == null || !storedToken.equals(refreshToken)) {
			System.out.println("Refresh Token 재사용 감지: " + tokenFamily);
			
			// 해당 사용자 세션까지 강제 만료 (username 기준)
			String username = claims.get("username", String.class);
			terminateUserSessions(username);
			return false; // Refresh Token이 만료되었거나 재사용됨
		}
		return true;
	}
	
	// 특정 사용자의 모든 세션을 종료하는 메소드
	public void terminateUserSessions(String username) {
		System.out.println("사용자 " + username + "의 모든 세션 종료 중...");
		
		// Redis에서 해당 사용자의 모든 RefreshToken 삭제
		Set<String> keys = redisTemplate.keys("session:" + username + ":*");
		if(keys != null) {
			redisTemplate.delete(keys);
		}
		// 해당 사용자의 모든 AccessToken 무효화
		redisTemplate.delete("session:" + username);
	}
	
	// RefreshToken 삭제
	public void revokeRefreshToken(String refreshToken) {
		Claims claims = parseToken(refreshToken);
		String tokenFamily = claims.get("tokenFamily", String.class);
		redisTemplate.delete(tokenFamily); // Redis에서 Refresh Token 삭제
	}
	
	// token 검증 후 Claims(토큰 데이터) 추출
    public Claims parseToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims;
    }
    
    // 만료된 토큰에서도 Claims를 가져오는 메소드
    public boolean parseTokenExpirationCheck(String token) {
        try {
	    	Jwts.parser()
	                .verifyWith(secretKey)
	                .build()
	                .parseSignedClaims(token)
	                .getPayload();
	    	return false;
        } catch (ExpiredJwtException e) {
        	return true;
        }
    }
	
    // Refresh Token 쿠키 가져오기
    public String getRefreshTokenFromCookie(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("refreshToken")) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
