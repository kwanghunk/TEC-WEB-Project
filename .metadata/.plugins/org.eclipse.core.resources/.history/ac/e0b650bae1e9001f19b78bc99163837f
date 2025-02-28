package com.tecProject.tec.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.tecProject.tec.auth.IpUtil;
import com.tecProject.tec.auth.JWTUtil;
import com.tecProject.tec.domain.Ip;
import com.tecProject.tec.domain.User;
import com.tecProject.tec.repository.IpRepository;
import com.tecProject.tec.repository.UserRepository;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
public class IpService {

    private final IpRepository ipRepository;
    private final IpUtil ipUtil;
    private final JWTUtil jwtUtil;
    
    private static final int GUEST_LIMIT = 30; // 비회원 요청 제한
    
    public IpService(IpRepository ipRepository, IpUtil ipUtil, JWTUtil jwtUtil) {
    	this.ipRepository = ipRepository;
    	this.ipUtil = ipUtil;
    	this.jwtUtil = jwtUtil;
    }
    
    
    @Transactional
    public boolean isRequestAllowed(HttpServletRequest request) {
    	String ipAddress =  ipUtil.getClientIp(request);
    	boolean isMember = isMember(request);
    	
    	if (isMember) return true; // 회원은 무제한 사용 가능
    	
    	Optional<Ip> ipRecord = ipRepository.findByIpAddress(ipAddress);
    	Ip ipData = ipRecord.orElseGet(() -> createNewIp(ipAddress));
    	
    	if (ipData.getRequestCount() >= GUEST_LIMIT) return false; // 요청 제한 초과
    	
    	ipData.setRequestCount(ipData.getRequestCount() + 1);
    	ipData.setLastRequest(LocalDateTime.now());
    	ipRepository.save(ipData);
    	
    	return true;
    }
    
    // 새로운 IP 정보 저장
    private Ip createNewIp(String ipAddress) {
    	Ip newIp = new Ip();
    	newIp.setIpAddress(ipAddress);
    	newIp.setRequestCount(0);
    	newIp.setLastRequest(LocalDateTime.now());
    	return ipRepository.save(newIp);
    }
    
    // JWT에서 회원 여부 확인
    private boolean isMember(HttpServletRequest request) {
    	try {
    		String token = request.getHeader("Authorization").replace("Bearer ", "");
    		Claims claims = jwtUtil.parseToken(token);
    		String userType = claims.get("userType", String.class);
    		return "ROLE_USER".equals(userType) || "ROLE_ADMIN".equals(userType);
    	} catch (Exception e) {
    		return false;
    	}
    }

}