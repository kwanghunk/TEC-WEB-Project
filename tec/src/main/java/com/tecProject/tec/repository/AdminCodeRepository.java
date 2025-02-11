package com.tecProject.tec.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecProject.tec.domain.Code;

@Repository
public interface AdminCodeRepository extends JpaRepository<Code, Integer>{

	// 특정 키워드로 시작하는 데이터 검색
	List<Code> findByOriginCodeStartingWith(String query);

	// 특정 키워드를 기준으로 상세 데이터 조회
	Optional<Code> findByOriginCode(String keyword);
}