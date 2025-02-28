package com.tecProject.tec.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tecProject.tec.service.IpService;
import com.tecProject.tec.service.TranslationService;


@RestController
@RequestMapping("/api/code")
public class TranslationController {
	
	private final TranslationService translationService;
	
    // 서비스 사용 준비
    public TranslationController(TranslationService transltionService) {
    	this.translationService = transltionService;
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
    
    
}