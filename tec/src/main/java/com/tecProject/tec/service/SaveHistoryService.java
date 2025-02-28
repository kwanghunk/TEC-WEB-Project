package com.tecProject.tec.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.tecProject.tec.domain.SaveHistory;
import com.tecProject.tec.domain.UserSupport;
import com.tecProject.tec.domain.UserSupport.InquiryCategory;
import com.tecProject.tec.dto.SaveHistoryDTO;
import com.tecProject.tec.repository.SaveHistoryRepository;

@Service
public class SaveHistoryService {
	
	private final SaveHistoryRepository saveHistoryRepository;
	
	public SaveHistoryService(SaveHistoryRepository saveHistoryRepository) {
		this.saveHistoryRepository = saveHistoryRepository;
	}

	// 히스토리 저장
	public void createHistory(SaveHistoryDTO saveDTO, String username) {
        // 입력값 검증
        if (saveDTO.getRequestCode() == null || saveDTO.getResponseCode() == null || saveDTO.getTypeCode() == null) {
            throw new IllegalArgumentException("필수 값이 누락되었습니다.");
        }
     // 엔티티 생성 및 저장
		SaveHistory entity = SaveHistory.builder()
				.username(username)
				.requestCode(saveDTO.getRequestCode())
				.responseCode(saveDTO.getResponseCode())
				.typeCode(saveDTO.getTypeCode())
				.historyTitle(saveDTO.getHistoryTitle())
				.saveTime(LocalDateTime.now())
				.build();
		saveHistoryRepository.save(entity);
		
	}

	// 히스토리 조회(사용자)
	public Page<SaveHistory> getSavedHistories(String username, PageRequest pageRequest) {
		return saveHistoryRepository.findByUsername(username, pageRequest);
	}

	// 히스토리 상세조회(사용자)
	public SaveHistoryDTO getHistoryById(int saveHistoryNo, String username) {
		Optional<SaveHistory> optionalHistory  = saveHistoryRepository.findBySaveHistoryNoAndUsername(saveHistoryNo, username);
        // 히스토리가 없으면 예외 발생
        if (!optionalHistory.isPresent()) {
            throw new IllegalArgumentException("조회할 히스토리를 찾을 수 없습니다.");
        }
        SaveHistory history = optionalHistory.get();
		return new SaveHistoryDTO(
				history.getSaveHistoryNo(),
				history.getRequestCode(),
				history.getResponseCode(),
				history.getTypeCode()
		);
	}

	// 히스토리 삭제(사용자)
	public boolean  deleteHistory(int saveHistoryNo, String username) {
		Optional<SaveHistory> existingHistory = saveHistoryRepository.findById(saveHistoryNo);
		if (existingHistory.isPresent()) {
			SaveHistory historyDelete = existingHistory.get();
			// 사용자 권한 확인
			if (historyDelete.getUsername().equalsIgnoreCase(username)) {
				saveHistoryRepository.deleteById(saveHistoryNo); // 데이터 삭제
				return true;
			}
		}
		System.out.println("삭제에 실패했습니다.");
		return false; // 삭제 실패 (권한 없음 또는 데이터 없음)
	}

	// DB 히스토리 다운로드(사용자)
	public String generateFileContentFromDB(int saveHistoryNo, String username) {
		Optional<SaveHistory> optionalHistory = saveHistoryRepository.findBySaveHistoryNoAndUsername(saveHistoryNo, username);
		if (optionalHistory.isPresent()) {
			SaveHistory history = optionalHistory.get(); // 조회한 데이터 담기
			// 파일 내용 생성
			StringBuilder fileContent = new StringBuilder();
			fileContent.append(LocalDateTime.now()).append("\n")
				.append("Saved On: ").append(history.getSaveTime()).append("\n\n")
				.append("Language: ").append(history.getTypeCode()).append("\n\n")
				.append("OriginCode:\n").append(history.getRequestCode()).append("\n\n")
				.append("TranslationCode:\n").append(history.getResponseCode()).append("\n\n");
			return fileContent.toString();
		} else {
			throw new IllegalArgumentException("데이터를 찾을 수 없습니다.");
		}
	}

	// 세션 히스토리 다운로드(사용자)
	public String generateFileContentFromSession(Map<String, String> dataToDownload) {
		if (dataToDownload != null) {
			String requestCode = dataToDownload.get("requestCode");
			String responseCode = dataToDownload.get("responseCode");
			String typeCode = dataToDownload.get("typeCode");
			
			StringBuilder fileContent = new StringBuilder();
			fileContent.append(LocalDateTime.now()).append("\n")
					.append("Language: ").append(typeCode).append("\n\n")
					.append("OriginCode:\n").append(requestCode).append("\n\n")
					.append("TranslationCode:\n").append(responseCode).append("\n\n");
		return fileContent.toString();
		}
		throw new IllegalArgumentException("데이터가 없습니다.");
	}

	public Page<SaveHistoryDTO> getSavedHistories(String username, Pageable pageable, String searchType, String searchQuery) {
		Page<SaveHistory> historyPage;
        if (searchType != null && searchQuery != null) { 
            switch (searchType) {
                case "title":
                    historyPage = saveHistoryRepository.findByUsernameAndHistoryTitleContaining(username, searchQuery, pageable);
                    break;
                case "content":
                    historyPage = saveHistoryRepository.findByUsernameAndResponseCodeContaining(username, searchQuery, pageable);
                    break;
                case "all":
                    historyPage = saveHistoryRepository.findByUsernameAndHistoryTitleContainingOrResponseCodeContaining(username, searchQuery, searchQuery, pageable);
                    break;
                default:
                    historyPage = saveHistoryRepository.findByUsername(username, pageable);
            }
        } else if (searchQuery != null) { 
            historyPage = saveHistoryRepository.findByUsernameAndHistoryTitleContainingOrResponseCodeContaining(username, searchQuery, searchQuery, pageable);
        } else { 
            historyPage = saveHistoryRepository.findByUsername(username, pageable);
        }
        return historyPage.map(history -> new SaveHistoryDTO(
                history.getSaveHistoryNo(),
                history.getUsername(),
                history.getHistoryTitle(),
                history.getSaveTime()
        ));
	}



}
