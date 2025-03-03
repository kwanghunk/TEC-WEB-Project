package com.tecProject.tec.auth;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;

import com.tecProject.tec.controller.LoginController;
import com.tecProject.tec.service.LoginService;

import io.jsonwebtoken.Claims;

public class RefreshTokenTest {
    
	private static final Logger logger = LoggerFactory.getLogger(RefreshTokenTest.class);
	
    @Mock
    private JWTUtil jwtUtil;

    @Mock
    private LoginService loginService;

    @InjectMocks
    private LoginController loginController;

    private String testUsername = "testUser";
    private String testRole = "ROLE_USER";
    private String tokenFamily;
    private String validAccessToken;
    private String validRefreshToken;
    private String expiredRefreshToken;
    private String reusedRefreshToken;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        tokenFamily = UUID.randomUUID().toString();
        validAccessToken = "mockValidAccessToken";
        validRefreshToken = "mockValidRefreshToken";
        expiredRefreshToken = "mockExpiredRefreshToken";
        reusedRefreshToken = "mockReusedRefreshToken";

        Claims mockClaims = mock(Claims.class);
        
        // Mock 설정: Refresh Token이 정상적으로 파싱되도록 보강
        when(jwtUtil.parseToken(validRefreshToken)).thenReturn(mockClaims);
        when(mockClaims.get("username", String.class)).thenReturn(testUsername);
        when(mockClaims.get("tokenFamily", String.class)).thenReturn(tokenFamily);

        // Mock 설정: Access Token이 정상적으로 생성되도록 보강
        when(jwtUtil.isRefreshTokenValid(validRefreshToken)).thenReturn(true);
        when(jwtUtil.createAccessToken(eq(testUsername), eq(testRole), anyLong())).thenReturn(validAccessToken);
        when(jwtUtil.createRefreshToken(eq(testUsername), eq(testRole), eq(tokenFamily))).thenReturn(validRefreshToken);

        when(jwtUtil.isRefreshTokenValid(expiredRefreshToken)).thenReturn(false);
        when(jwtUtil.isRefreshTokenValid(reusedRefreshToken)).thenReturn(false);
    }

    @Test
    void testRefreshTokenSuccess() {
        ResponseEntity<?> response = loginController.refreshAccessToken(validRefreshToken);

        logger.info("✅ Refresh Token 사용하여 새로운 Access Token 발급 요청");
        logger.info("🛠️ Response Status: {}", response.getStatusCodeValue());

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());

        @SuppressWarnings("unchecked")
        Map<String, String> responseBody = (Map<String, String>) response.getBody();

        // 디버깅 로그 추가
        logger.info("🛠️ New Access Token: {}", responseBody.get("accessToken"));
        logger.info("🛠️ New Refresh Token: {}", responseBody.get("refreshToken"));

        // Access Token이 생성되지 않으면 로그로 확인
        if (responseBody.get("accessToken") == null) {
            logger.error("🚨 Access Token이 NULL 입니다! JWTUtil.createAccessToken()을 확인하세요.");
        }

        assertNotNull(responseBody.get("accessToken"));
        assertNotNull(responseBody.get("refreshToken"));
    }

    @Test
    void testRefreshTokenExpired() {
        ResponseEntity<?> response = loginController.refreshAccessToken(expiredRefreshToken);

        logger.warn("❌ 만료된 Refresh Token 사용 시도");
        logger.warn("🛠️ Response Status: {}", response.getStatusCodeValue());

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("만료 또는 사용할 수 없는 토큰입니다.", response.getBody());
    }

    @Test
    void testRefreshTokenReuseDetection() {
        ResponseEntity<?> response = loginController.refreshAccessToken(reusedRefreshToken);

        logger.warn("🚨 재사용된 Refresh Token 감지!");
        logger.warn("🛠️ Response Status: {}", response.getStatusCodeValue());

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("만료 또는 사용할 수 없는 토큰입니다.", response.getBody());
    }
}
