package com.tecProject.tec.auth;

import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.tecProject.tec.dto.CustomUserDetails;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class LoginFilter extends UsernamePasswordAuthenticationFilter{
	
	private final AuthenticationManager authenticationManager;
	//JWTUtil 주입
	private final JWTUtil jwtUtil;
	
	public LoginFilter(AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException{
		//클라이언트 요청에서 username, password 추출
		String username = obtainUsername(request);
		String password = obtainPassword(request);
		//스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함
		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);
		//token에 담은 검증을 위한 AuthenticationManager로 전달
		return authenticationManager.authenticate(authToken);
	}
	
	@Override //로그인 성공 시 AT, RT 반환
	protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) {
						  //UserDetails
		CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
		String username = customUserDetails.getUsername();
		String userType = customUserDetails.getAuthorities().iterator().next().getAuthority();
		
		// AT, RT 생성
		String tokenFamily = UUID.randomUUID().toString(); // tokenFamily(고유ID)
		String accessToken = jwtUtil.createAccessToken(username, userType, 1000L * 60 * 15); // 15분
		String refreshToken = jwtUtil.createRefreshToken(username, userType, tokenFamily);
		
		response.addHeader("Authorization", "Bearer " + accessToken);
		response.addHeader("Refresh-Token", refreshToken);
	}
	
	@Override //로그인 실패시 실행하는 메소드
	protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
		response.setStatus(401);//로그인 실패시 401 응답 코드 반환
	}
}
