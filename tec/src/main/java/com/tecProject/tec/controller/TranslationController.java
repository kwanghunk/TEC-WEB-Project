package com.tecProject.tec.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tecProject.tec.domain.Code;
import com.tecProject.tec.service.IpService;
import com.tecProject.tec.service.TranslationService;


@RestController
@RequestMapping("/api/code")
public class TranslationController {
	
	private final TranslationService translationService;
	private final IpService ipService;
	
    // 서비스 사용 준비
    public TranslationController(TranslationService transltionService, IpService ipService) {
    	this.translationService = transltionService;
    	this.ipService = ipService;

    }
    // 문장 번역 API
    @GetMapping
    public ResponseEntity<String> getTranslation(
    		@RequestParam("origin") String originSentence,
    		@RequestParam("language") String language
	) {
        String translatedSentence = translationService.translateSentence(originSentence, language);
        return ResponseEntity.ok(translatedSentence);
    }
    
    // 필터 검색
    /*
    @GetMapping("/filterSearch")
    public ResponseEntity<?> getByfilterSearch(
    		@RequestParam(name = "alphabet", required = false) String alphabet,
    		@RequestParam(name = "keyword", required = false) String keyword) {
    	if (alphabet != null) { // 언어태그 + a~z 태그로 검색
    		List<Code> results = translationService.getByAlphabet(alphabet);
    		System.out.println("alphabet cont: " + results);
    		if (!results.isEmpty()) { return ResponseEntity.ok(results); }
    		else { return ResponseEntity.status(HttpStatus.NOT_FOUND).body("결과가 없습니다."); }
    	}
    	if (keyword != null) { // 언어태그 + 키워드로 검색 ** 완성된 키워드가 아닐 경우 입력된 키워드로 시작하는 데이터들 조회 **
    		List<Code> results = translationService.getByKeyword(keyword);
    		System.out.println("keyword cont: " + results);
    		if (!results.isEmpty()) { return ResponseEntity.ok(results); }
    		else { return ResponseEntity.status(HttpStatus.NOT_FOUND).body("결과가 없습니다."); }
    	}
    	return ResponseEntity.badRequest().body("잘못된 요청입니다.");
    }
    */
    
}