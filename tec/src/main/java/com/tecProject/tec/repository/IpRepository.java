package com.tecProject.tec.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.tecProject.tec.domain.Ip;

@Repository
public interface IpRepository extends JpaRepository<Ip, Long>{
	
	Optional<Ip> findByIpAddress(String ipAddress);
	
	@Modifying
	@Query("UPDATE Ip i SET i.requestCount = 0 WHERE 1 = 1")
	void resetAllRequests(); // 모든 요청횟수 초기화
}
