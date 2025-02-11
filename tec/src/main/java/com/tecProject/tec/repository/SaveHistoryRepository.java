package com.tecProject.tec.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecProject.tec.domain.SaveHistory;

@Repository
public interface SaveHistoryRepository extends JpaRepository<SaveHistory, Integer> {
	// 히스토리 조회(사용자)
	Page<SaveHistory> findByUsername(String username, PageRequest pageRequest);

	// 히스토리 상세조회(사용자)
	Optional<SaveHistory> findBySaveHistoryNoAndUsername(int saveHistoryNo, String username);
	
}
