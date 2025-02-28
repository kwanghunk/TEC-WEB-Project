package com.tecProject.tec.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tecProject.tec.domain.SaveHistory;

@Repository
public interface SaveHistoryRepository extends JpaRepository<SaveHistory, Integer> {

    Page<SaveHistory> findByUsername(String username, Pageable pageable);

    Page<SaveHistory> findByUsernameAndHistoryTitleContaining(String username, String searchQuery, Pageable pageable);

    Page<SaveHistory> findByUsernameAndResponseCodeContaining(String username, String searchQuery, Pageable pageable);

    Page<SaveHistory> findByUsernameAndHistoryTitleContainingOrResponseCodeContaining(String username, String titleQuery, String contentQuery, Pageable pageable);

	// 히스토리 상세조회(사용자)
	Optional<SaveHistory> findBySaveHistoryNoAndUsername(int saveHistoryNo, String username);


	
}
