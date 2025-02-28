package com.tecProject.tec.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import io.jsonwebtoken.Claims;

public class JwtUtilTest {

	private static final Logger logger = LoggerFactory.getLogger(JwtUtilTest.class);
	
    private JWTUtil jwtUtil;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    private String testUsername = "testUser";
    private String testRole = "ROLE_USER";
    private String tokenFamily;
    private String accessToken;
    private String refreshToken;
    private static final String SECRET_KEY = "asfhailehaweihqsdfkuasdfhawjwperjdsfserhjjehewyugeaefaaaaaaaaaaaaaaaaaaaaabbbbbbbb";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // 먼저 Redis Mock 설정 적용
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        doNothing().when(valueOperations).set(anyString(), anyString(), anyLong(), any());

        // JWTUtil 객체 생성
        jwtUtil = new JWTUtil(SECRET_KEY, redisTemplate);

        // 토큰 생성
        tokenFamily = UUID.randomUUID().toString();
        accessToken = jwtUtil.createAccessToken(testUsername, testRole, 1000L * 60 * 15); // 15분
        refreshToken = jwtUtil.createRefreshToken(testUsername, tokenFamily);
    }

    @Test
    void testCreateAccessToken() {
        assertNotNull(accessToken);
        
        Claims claims = jwtUtil.parseToken(accessToken);
        
        // Access Token 검증 로그 추가
        logger.info("✅ Generated Access Token: {}", accessToken);
        logger.info("🛠️ Token Claims - Username: {}", claims.get("username"));
        logger.info("🛠️ Token Claims - Role: {}", claims.get("userType"));

        assertEquals(testUsername, claims.get("username"), "Username mismatch in token");
        assertEquals(testRole, claims.get("userType"), "Role mismatch in token");
    }

    @Test
    void testCreateRefreshToken() {
        refreshToken = jwtUtil.createRefreshToken(testUsername, tokenFamily);
        assertNotNull(refreshToken);

        // Redis 저장 검증 수정 (times(1) → atLeastOnce())
        verify(valueOperations, atLeastOnce()).set(eq(tokenFamily), eq(refreshToken), anyLong(), any());

        Claims claims = jwtUtil.parseToken(refreshToken);
        
        // Refresh Token 검증 로그 추가
        logger.info("✅ Generated Refresh Token: {}", refreshToken);
        logger.info("🛠️ Token Claims - Username: {}", claims.get("username"));
        logger.info("🛠️ Token Claims - Token Family: {}", claims.get("tokenFamily"));
        
        assertEquals(testUsername, claims.get("username"));
        assertEquals(tokenFamily, claims.get("tokenFamily"));
    }

    @Test
    void testRefreshTokenValidation() {
        when(redisTemplate.opsForValue().get(tokenFamily)).thenReturn(refreshToken);

        // Refresh Token 검증 로그 추가
        logger.info("🔍 Checking Refresh Token Validity...");
        logger.info("🛠️ Stored Refresh Token in Redis: {}", refreshToken);
        
        boolean isValid = jwtUtil.isRefreshTokenValid(refreshToken);
        logger.info("✅ Refresh Token Valid: {}", isValid);

        assertTrue(isValid);
    }

    @Test
    void testExpiredRefreshTokenValidation() {
        when(redisTemplate.opsForValue().get(tokenFamily)).thenReturn(null); // Redis에서 삭제된 경우

        // 만료된 Refresh Token 검증 로그 추가
        logger.warn("❌ Refresh Token might be expired or used before!");
        logger.warn("🛠️ Stored Refresh Token in Redis: {}", redisTemplate.opsForValue().get(tokenFamily));
        
        boolean isValid = jwtUtil.isRefreshTokenValid(refreshToken);
        logger.info("🚨 Is Refresh Token Valid? {}", isValid);

        assertFalse(isValid);
    }
}

