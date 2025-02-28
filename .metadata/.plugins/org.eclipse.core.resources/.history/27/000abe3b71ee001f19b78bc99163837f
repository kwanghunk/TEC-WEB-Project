package com.tecProject.tec.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

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
import org.springframework.security.authentication.BadCredentialsException;

import com.tecProject.tec.auth.JWTUtil;
import com.tecProject.tec.domain.User;
import com.tecProject.tec.dto.LoginDTO;
import com.tecProject.tec.service.LoginService;

public class LoginControllerTest {
	
	private static final Logger logger = LoggerFactory.getLogger(LoginControllerTest.class);
	
	@Mock
	private LoginService loginService;

	@Mock
	private JWTUtil jwtUtil;
	
	@InjectMocks
	private LoginController loginController;
	
	private User testUser;
	private String accessToken;
	private String refreshToken;
	private String tokenFamily;
	
	@BeforeEach
	void setUp() {
	    MockitoAnnotations.openMocks(this);

	    testUser = new User();
	    testUser.setUsername("testUser");
	    testUser.setUserType("ROLE_USER");

	    tokenFamily = UUID.randomUUID().toString();
	    accessToken = "mockAccessToken";
	    refreshToken = "mockRefreshToken";

	    when(loginService.authenticateUser(any(LoginDTO.class))).thenReturn(testUser);
	    when(jwtUtil.createAccessToken(eq("testUser"), eq("ROLE_USER"), anyLong())).thenReturn(accessToken);
	    when(jwtUtil.createRefreshToken(eq("testUser"), anyString())).thenReturn(refreshToken); // ✅ anyString()으로 수정
	}
	
	@Test
	void testLoginSuccess() {
		LoginDTO loginDTO = new LoginDTO();
		loginDTO.setUsername("testUser");
		loginDTO.setPassword("password");
		
		ResponseEntity<?> response = loginController.login(loginDTO);
		
		logger.info("✅ Login API Response Status: {}", response.getStatusCodeValue());
		assertEquals(200, response.getStatusCodeValue());
		
		assertNotNull(response.getBody());
		
		@SuppressWarnings("unchecked")
		Map<String, String> responseBody = (Map<String, String>) response.getBody();
		
        logger.info("🛠️ Access Token: {}", responseBody.get("accessToken"));
        logger.info("🛠️ Refresh Token: {}", responseBody.get("refreshToken"));
        logger.info("🛠️ Username: {}", responseBody.get("username"));
        logger.info("🛠️ UserType: {}", responseBody.get("userType"));
        
		assertEquals(accessToken, responseBody.get("accessToken"));
		assertEquals(refreshToken, responseBody.get("refreshToken"));
		assertEquals("testUser", responseBody.get("username"));
		assertEquals("ROLE_USER", responseBody.get("userType"));
	}
	
	@Test
	void testLoginFailure_InvalidCredentials() {
		when(loginService.authenticateUser(any(LoginDTO.class)))
			.thenThrow(new BadCredentialsException("아이디 또는 비밀번호가 잘못되었습니다."));
		
		LoginDTO loginDTO = new LoginDTO();
		loginDTO.setUsername("wrongUser");
		loginDTO.setPassword("wrongPassword");
		
		ResponseEntity<?> response = loginController.login(loginDTO);
		
		logger.warn("❌ Login Failed: {}", response.getBody());
		
		assertEquals(401, response.getStatusCodeValue());
		assertEquals("아이디 또는 비밀번호가 잘못되었습니다.", response.getBody());
	}
}
