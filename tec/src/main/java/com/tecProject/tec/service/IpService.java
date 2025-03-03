package com.tecProject.tec.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tecProject.tec.auth.IpUtil;
import com.tecProject.tec.domain.Ip;
import com.tecProject.tec.repository.IpRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class IpService {

    private final IpRepository ipRepository;
    private final IpUtil ipUtil;
    
    private static final int GUEST_LIMIT = 30; // 비회원 요청 제한
    
    public IpService(IpRepository ipRepository, IpUtil ipUtil) {
    	this.ipRepository = ipRepository;
    	this.ipUtil = ipUtil;
    }
    
    
    // 비회원 요청 가능여부 확인 및 요청 카운트 증가
    @Transactional
    public boolean isRequestAllowed(HttpServletRequest request) {
    	String ipAddress =  ipUtil.getClientIp(request);    	
    	
    	Optional<Ip> ipRecord = ipRepository.findByIpAddress(ipAddress);
    	Ip ipData = ipRecord.orElseGet(() -> createNewIp(ipAddress));
    	
    	if (ipData.getRequestCount() >= GUEST_LIMIT) return false; // 요청 제한 초과
    	
    	// 요청이 가능하면 카운트 증가 후 DB 저장
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

}