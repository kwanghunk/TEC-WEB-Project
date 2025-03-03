package com.tecProject.tec.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tecProject.tec.domain.Code;
import com.tecProject.tec.repository.AdminCodeRepository;

@Service
public class AdminCodeService {

	private final AdminCodeRepository adminRepository;
	
	//리포지토리 사용 준비
	public AdminCodeService(AdminCodeRepository adminRepository) {
        this.adminRepository = adminRepository;
    }
	
	// 자동완성 키워드 검색
	public List<String> getSuggestions(String query) {
		
		return adminRepository.findByOriginCodeStartingWith(query)
				.stream()
				.map(Code::getOriginCode)
				.collect(Collectors.toList());
	}
	
	// 특정 키워드의 상세 정보 조회
	public Optional<Code> getCodeDetails(String keyword) {
		return adminRepository.findByOriginCode(keyword);
	}

	// 번역 데이터 저장 또는 수정 기능
	public Code saveCode(Code code) {
		// 기존 데이터 확인
		Optional<Code> existingCode = adminRepository.findByOriginCode(code.getOriginCode());
		
		if (existingCode.isPresent()) {
			// 기존 데이터 수정
			Code existing = existingCode.get();
			existing.setTranslateCode(code.getTranslateCode());// 번역 데이터 수정
			return adminRepository.save(existing); // 업데이트로 진행
		} else {
			// 새 데이터로 추가(저장)
			return adminRepository.save(code);
		}
	}
}