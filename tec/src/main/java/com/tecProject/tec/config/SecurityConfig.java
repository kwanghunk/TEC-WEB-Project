package com.tecProject.tec.config;

import java.util.List;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.tecProject.tec.auth.JWTFilter;
import com.tecProject.tec.auth.JWTUtil;
import com.tecProject.tec.auth.LoginFilter;
import com.tecProject.tec.auth.RequestThrottleFilter;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	private final AuthenticationConfiguration authenticationConfiguration;
	private final JWTUtil jwtUtil;
	
	public SecurityConfig(AuthenticationConfiguration authenticationConfiguration, JWTUtil jwtUtil) {
		this.authenticationConfiguration = authenticationConfiguration;
		this.jwtUtil = jwtUtil;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}
	
	// 비밀번호 암호화
    @Bean
    public BCryptPasswordEncoder BCryptPasswordEncoder() {
        return new BCryptPasswordEncoder(); // 비밀번호 암호화
    }
    
    //Rate Limiting 필터 추가(Brute Force Attack 방어) - 60초 동안 5번 이상 /user/refresh 요청 시 차단
    @Bean
    public FilterRegistrationBean<RequestThrottleFilter> rateLimitingFilter() {
    	FilterRegistrationBean<RequestThrottleFilter> registrationBean = new FilterRegistrationBean<>();
    	registrationBean.setFilter(new RequestThrottleFilter());
    	registrationBean.addUrlPatterns("/user/refresh"); // /user/refresh API에만 적용
    	return registrationBean;
    }
    
    //보안설정 관리 함수
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 비활성화 (테스트 환경)
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                config.setAllowedOrigins(List.of("http://localhost:3000")); // React 개발 서버 허용
                config.setAllowedMethods(List.of("*"));
                config.setAllowedHeaders(List.of("*"));
                config.setAllowCredentials(true);
                return config;
            }))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // JWT 사용 시 세션 비활성화
            )
            .authorizeHttpRequests(auth -> auth
                // 인증 없이 접근 가능한 경로(모든 사용자 가능)
                .requestMatchers(
                		"/user/login", "/user/refresh", "/user/logout", 
                		"/user/signup", "/user/check-id", "/user/check-email",	
                		"/api/code", "api/ip/**").permitAll() // "/api/code": 메인 번역기능
                
                // 관리자 전용 경로
                .requestMatchers("/admin/**", "/Admin/**").hasRole("ADMIN")
                
                // 로그인한 사용자만 접근 가능한 가능 (비회원 제한)
                .requestMatchers(
                		"/api/history/**", 
                		"/faq/**", 
                		"/user/profile/**", "/user/profile/**", "/user/changePassword/**", 
                		"/user/me", "/user/delete",
                		"/api/user-support", "/api/user-support/**").authenticated()
                
                // 나머지 모든 요청은 기본적으로 인증 필요
                .anyRequest().authenticated()
            )
            .httpBasic(auth -> auth.disable()) // HTTP Basic 인증 비활성화
            .formLogin(form -> form.disable()) // 기본 로그인 폼 비활성화 (REST API 방식 사용)
            .logout(logout -> logout
                    .logoutUrl("/user/logout")
                    .logoutSuccessHandler((request, response, authentication) -> {
                        response.setStatus(HttpServletResponse.SC_OK);
                    })
                    .invalidateHttpSession(true) // 세션 무효화 (JWT에서는 불필요하지만 추가 가능)
                    .deleteCookies("refreshToken") // Refresh Token 쿠키 삭제 (보안 강화)
                    .permitAll()
            )
            .addFilterBefore(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class) // JWT 필터 등록
            .addFilterAt(new LoginFilter(authenticationManager(authenticationConfiguration), jwtUtil), UsernamePasswordAuthenticationFilter.class); // 로그인 필터 추가

        return http.build();
    }
}