package com.tecProject.tec.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecProject.tec.domain.Code;
import com.tecProject.tec.repository.TranslationRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class TranslationService {

	private final TranslationRepository translationRepository;
	private final ObjectMapper objectMapper; // JSON 파싱용
	
	//리포지토리 사용 준비
	public TranslationService(TranslationRepository translationRepository, ObjectMapper objectMapper) {
        this.translationRepository = translationRepository;
        this.objectMapper = objectMapper;
	}
	
    // 문장을 번역하면서 특수문자를 유지
    public String translateSentence(String originSentence, String language) {
    	
        // 특수문자와 단어를 구분하는 정규식
        String[] parts = originSentence.split("(?<=[^a-zA-Z0-9])|(?=[^a-zA-Z0-9])");
        
        // 결과를 담을 StringBuilder
        StringBuilder translatedSentence = new StringBuilder();

        // 각 부분을 번역 또는 그대로 둠
        for (String part : parts) {
            if (part.matches("[a-zA-Z0-9]+")) { // 영어 단어라면
                String translatedWord = translationRepository.findByOriginCode(part)
                        .map(Code::getTranslateCode) // 번역 결과 가져오기
                        .map(translateCode -> getTranslationForLanguage(translateCode, language, part)) // 언어별 번역 처리
                        .orElse(part); // 번역 결과가 없으면 원본 사용
                translatedSentence.append(translatedWord);
            } else {
                translatedSentence.append(part); // 특수문자는 그대로 유지
            }
        }
        // 번역된 문장을 반환
        return translatedSentence.toString();
    }
    // JSON 데이터를 언어별로 처리하는 헬퍼 메서드
    private String getTranslationForLanguage(String translateCode, String language, String defaultValue) {
        try {
            var jsonNode = objectMapper.readTree(translateCode);
            return jsonNode.has(language) ? jsonNode.get(language).asText() : defaultValue;
            
        } catch (Exception e) {
            // JSON 파싱 실패 시 기본값 반환
            return defaultValue;
        }
    }
    
    // a~z 태그로 검색
	public List<Code> getByAlphabet(String alphabet) {
		return translationRepository.findByOriginCodeStartingWith(alphabet);
	}
	// 키워드 검색 ** 완성된 키워드가 아닐 경우 입력된 키워드로 시작하는 데이터들 조회 **
	public List<Code> getByKeyword(String keyword) {
		return translationRepository.findByOriginCodeStartingWith(keyword);
	}
		
		
	


}