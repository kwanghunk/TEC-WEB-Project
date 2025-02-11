package com.tecProject.tec.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tecProject.tec.domain.Faq;
import com.tecProject.tec.domain.User;
import com.tecProject.tec.repository.FaqRepository;
import com.tecProject.tec.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class FaqService {
	
	private final FaqRepository faqrepository;
	private final UserRepository userrepository;
    
    //삭제되지 않은 FAQ를 가져오는 함수
    public List<Faq> getAllFaqs() {
        return faqrepository.findByDeletedDateIsNullOrderByFaqNo();
    }
    
    //관리자 여부 확인
    public boolean isAdmin(String username) {
        //사용자 조회
        User user = userrepository.findByUsername(username);
        //사용자가 존재하지 않거나 ROLE_ADMIN이 아니면 false 반환
        if (user == null || !"ROLE_ADMIN".equals(user.getUserType())) {
            return false;
        }
        return true; //ROLE_ADMIN일 경우 true 반환
    }
    
    //FAQ 추가 (관리자 권한 확인 추가)
    public Faq submitFaq(Faq faq, String username) {
        //사용자 조회
    	User user = userrepository.findByUsername(username);
    	if (user == null || user.getUserType() == null) {
            throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
        }
    	 //관리자 여부 확인
        if (!"ROLE_ADMIN".equals(user.getUserType())) { //안전한 String 비교
            throw new SecurityException("관리자 권한이 필요합니다.");
        }
        //FAQ 저장
        faq.setIsDeleted("N"); //추가되는 FAQ는 삭제되지 않은 상태로 설정
        faq.setUsername(user.getUsername()); // 로그인된 사용자의 ID 설정
        faq.setCreateDate(LocalDateTime.now()); //현재 시간 설정
        faq.setDeletedDate(null); // 삭제되지 않은 상태로 설정
        return faqrepository.save(faq); //받은 FAQ 데이터 저장 후 반환
    }
    
    //FAQ 수정
    public Optional<Faq> editFaq(Long no, Faq updatedFaq) {
    	Optional<Faq> fOption = faqrepository.findByFaqNoAndDeletedDateIsNull(no); // 수정하려는 FAQ가 데이터베이스에 있는지 찾음
        
        //FAQ가 있으면 내용을 수정하고 저장
    	if (fOption.isPresent()) {
    		//기존 FAQ 내용을 새로운 내용으로 업데이트
            Faq existingFaq = fOption.get(); //기존 FAQ 데이터 가져오기
            existingFaq.setQuestion(updatedFaq.getQuestion()); //질문 내용 수정
            existingFaq.setAnswer(updatedFaq.getAnswer()); //답변 내용 수정
            existingFaq.setModifiedDate(LocalDateTime.now()); //수정 일자 설정

            return Optional.of(faqrepository.save(existingFaq)); //수정된 FAQ 저장 후 반환
        }
        return Optional.empty(); //FAQ를 찾지 못한 경우 빈 Optional 반환
    }
    
    //FAQ 삭제
    public Optional<Faq> deleteFaq(Long no) {
    	Optional<Faq> fOption = faqrepository.findById(no);

        // FAQ가 있으면 삭제 상태 설정
    	if (fOption.isPresent()) {
    		Faq existingFaq = fOption.get();
            existingFaq.setIsDeleted("Y"); //삭제 상태 설정
            existingFaq.setDeletedDate(LocalDateTime.now()); //삭제 일자 설정

            return Optional.of(faqrepository.save(existingFaq)); //수정된 FAQ 저장 후 반환
        }
        return Optional.empty(); //FAQ를 찾지 못한 경우 빈 Optional 반환
    }
}