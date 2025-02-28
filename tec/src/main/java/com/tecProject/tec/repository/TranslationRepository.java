package com.tecProject.tec.repository;

import com.tecProject.tec.domain.Code;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TranslationRepository extends JpaRepository<Code, Integer>{
	
	// 데이터베이스에서 origin_code를 기준으로 데이터를 찾는 기능
	Optional<Code> findByOriginCode (String originCode);



}
