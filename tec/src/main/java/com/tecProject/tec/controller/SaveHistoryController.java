package com.tecProject.tec.controller;

import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriUtils;

import com.tecProject.tec.domain.SaveHistory;
import com.tecProject.tec.dto.SaveHistoryDTO;
import com.tecProject.tec.service.SaveHistoryService;

import io.jsonwebtoken.io.IOException;

@RestController
@RequestMapping("/api/history")
public class SaveHistoryController {

	private final SaveHistoryService saveHistoryService;
	
	public SaveHistoryController(SaveHistoryService saveHistoryService) {
		this.saveHistoryService = saveHistoryService;
	}
	
	// 히스토리 저장(사용자)
	@PostMapping
	public ResponseEntity<?> saveTranslationHistory(@RequestBody SaveHistoryDTO saveDTO) {
		// 인증 정보 가져오기    
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
        }
        String username = authentication.getName(); // JWT에서 username 추출
		try {
			saveHistoryService.createHistory(saveDTO, username);
			return ResponseEntity.ok("기록이 저장되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("기록 저장 실패: " + e.getMessage());
		}
	}
	
	// 히스토리 조회(사용자)
	@GetMapping("/load")
	public ResponseEntity<?> loadSavedHistory(
			@RequestParam(name = "page", defaultValue = "0") int page, 
			@RequestParam(name = "size", defaultValue = "10") int size, 
			@RequestParam(name = "searchType", required = false) String searchType, 
			@RequestParam(name = "keyword", required = false) String searchQuery ) {
		//인증 정보 가져오기    
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
        }
        String username = authentication.getName(); // JWT에서 username 추출
        try {
        	Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "saveTime"));
            Page<SaveHistoryDTO> result = saveHistoryService.getSavedHistories(username, pageable, searchType, searchQuery);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("히스토리 조회 실패: " + e.getMessage());
		}
	}
	
	// 히스토리 상세조회(사용자)
	@GetMapping("/detail/{saveHistoryNo}")
	public ResponseEntity<?> loadDetailSaveHistory(@PathVariable("saveHistoryNo") int saveHistoryNo) {
		//인증 정보 가져오기    
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
        }
        String username = authentication.getName(); // JWT에서 username 추출
        try {
        	SaveHistoryDTO history = saveHistoryService.getHistoryById(saveHistoryNo, username);
        	return ResponseEntity.ok(history);
        } catch (IllegalArgumentException e) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).body("저장된 번역 기록을 조회할 수 없습니다.");
        } catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("알 수 없는 오류가 발생했습니다.");
        }
	}
	
	// 히스토리 삭제(사용자)
	@DeleteMapping("/delete/{saveHistoryNo}")
	public ResponseEntity<?> deleteHistory(@PathVariable("saveHistoryNo") int saveHistoryNo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
        }
        String username = authentication.getName(); // JWT에서 username 추출
        try {
        	boolean isDeleted = saveHistoryService.deleteHistory(saveHistoryNo, username);
            if (isDeleted) {
            	return ResponseEntity.ok("히스토리가 성공적으로 삭제되었습니다.");
            } else {
            	return ResponseEntity.status(HttpStatus.FORBIDDEN).body("히스토리 삭제 권한이 없습니다.");
            }
        } catch (IllegalArgumentException e) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).body("히스토리 삭제 권한이 없습니다.");
        } catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("알 수 없는 오류가 발생했습니다.");
        }
	}

	// DB 히스토리 다운로드(사용자)
	@PostMapping("/download/{saveHistoryNo}")
	public ResponseEntity<?> downloadTranslation(
			@PathVariable(value= "saveHistoryNo") int saveHistoryNo, 
			@RequestParam(value= "fileName", defaultValue = "DECOBET") String fileName) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
        }
        String username = authentication.getName();
        try {
			// DB 데이터 조회 + 파일 내용 생성
			String fileContent = saveHistoryService.generateFileContentFromDB(saveHistoryNo, username);
			// UTF-8 인코딩된 파일명 설정
			String encodedFileName = UriUtils.encode(fileName, StandardCharsets.UTF_8);
			
			return ResponseEntity.ok()
					.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
					.contentType(MediaType.APPLICATION_OCTET_STREAM)
					.body(fileContent.getBytes(StandardCharsets.UTF_8)); // 바이트 배열 반환
        } catch (IllegalArgumentException e) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).body("다운로드 권한이 없습니다.");
        } catch (Exception e) {
        	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 생성 중 오류가 발생했습니다.");
        }
	}
	
	// 세션 히스토리 다운로드(사용자)
	@PostMapping("/sessionDownload")
	public ResponseEntity<?> downloadSessionHistory(@RequestBody Map<String, String> dataToDownload) {
		try {
			// 파일 내용 생성
			String fileContent = saveHistoryService.generateFileContentFromSession(dataToDownload);
			// 파일 이름 추출
			String fileName = dataToDownload.get("fileName") != null ? dataToDownload.get("fileName") : "DECOBET"; 
			String encodedFileName = UriUtils.encode(fileName, StandardCharsets.UTF_8);
			return ResponseEntity.ok()
					.header("Content-Disposition", "attachment; filename*=UTF-8''" + encodedFileName + ".txt")
					.contentType(MediaType.TEXT_PLAIN)
					.body(fileContent);
		} catch (BadCredentialsException e) {
			return ResponseEntity.status(401).body("로그인이 필요한 기능입니다.");
		}catch (Exception e) {
			e.printStackTrace();
        	return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 생성 중 오류가 발생했습니다.");
        }
	}
}
