package com.tecProject.tec.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.tecProject.tec.domain.User;
import com.tecProject.tec.dto.JoinDTO;
import com.tecProject.tec.repository.UserRepository;

@Service
public class JoinService {

	private final UserRepository userRepository;
	
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	
	public JoinService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
		this.userRepository = userRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
	}

    // 회원가입 처리
    public User joinProcess(JoinDTO joinDTO) {
        validateJoinDTO(joinDTO);

        if (!checkIdAvailability(joinDTO.getUsername())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        if (!checkEmailAvailability(joinDTO.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        User user = new User();
        user.setUsername(joinDTO.getUsername());
        user.setPassword(bCryptPasswordEncoder.encode(joinDTO.getPassword()));
        user.setName(joinDTO.getName());
        user.setEmail(joinDTO.getEmail());
        user.setPhone(joinDTO.getPhone());
        user.setSsnFirst(joinDTO.getSsnFirst());
        user.setSsnSecond(joinDTO.getSsnSecond());
        user.setUserType("ROLE_USER");

        return userRepository.save(user);
    }

    // 아이디 중복 확인
    public boolean checkIdAvailability(String username) {
        return !userRepository.existsByUsername(username);
    }

    // 이메일 중복 확인
    public boolean checkEmailAvailability(String email) {
        return !userRepository.existsByEmail(email);
    }

    // DTO 유효성 검사
    private void validateJoinDTO(JoinDTO joinDTO) {
        if (!StringUtils.hasText(joinDTO.getUsername()) || joinDTO.getUsername().length() < 3) {
            throw new IllegalArgumentException("아이디는 최소 3자 이상이어야 합니다.");
        }

        if (!StringUtils.hasText(joinDTO.getEmail()) || !joinDTO.getEmail().contains("@")) {
            throw new IllegalArgumentException("유효한 이메일을 입력하세요.");
        }

        if (joinDTO.getPassword().length() < 8) {
            throw new IllegalArgumentException("비밀번호는 최소 8자 이상이어야 합니다.");
        }

        if (!joinDTO.getSsnFirst().matches("\\d{6}") || !joinDTO.getSsnSecond().matches("\\d{7}")) {
            throw new IllegalArgumentException("유효한 주민등록번호를 입력하세요.");
        }
    }
}
