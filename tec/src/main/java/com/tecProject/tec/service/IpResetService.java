package com.tecProject.tec.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tecProject.tec.repository.IpRepository;

@Service
public class IpResetService {

    private final IpRepository ipRepository;

    public IpResetService(IpRepository ipRepository) {
    	this.ipRepository = ipRepository;
    }
    
    @Transactional
    @Scheduled(cron = "0 0 0 * * ?") // 매일 자정 실행
    public void resetIpRequestCounts() {
        ipRepository.resetAllRequests();
        System.out.println("✅ 모든 IP 요청 횟수 초기화 완료!");
    }
}