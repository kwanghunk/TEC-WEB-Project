package com.tecProject.tec.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tecProject.tec.auth.JWTUtil;
import com.tecProject.tec.domain.User;
import com.tecProject.tec.dto.UserDTO;
import com.tecProject.tec.repository.UserRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTUtil jwtUtil;
    
    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, JWTUtil jwtUtil) {
    	this.userRepository = userRepository;
    	this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    	this.jwtUtil = jwtUtil;
    }
    
	public UserDTO getUserInfo(String username) {
		User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }
        
		return new UserDTO(
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getCreateDate(),
                user.getSsnFirst()
        );
	}

	public void updateUserProfile(String username, UserDTO userDTO) {
		Optional<User> userOptional = userRepository.findOptionalByUsername(username);
		User user = userOptional.orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        // 이름, 이메일, 연락처만 업데이트
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPhone(userDTO.getPhone());

        userRepository.save(user);
	}
    
    public boolean changePassword(String username, String currentPassword, String newPassword) {
    	Optional<User> userOptional = userRepository.findOptionalByUsername(username);
        if (userOptional.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = userOptional.get();
        // 현재 비밀번호 확인
        if (!bCryptPasswordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }

        // 새 비밀번호 암호화 후 저장
        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    @Transactional
	public ResponseEntity<?> deleteUser(String username, HttpServletRequest request, HttpServletResponse response) {
		try {
			Optional<User> userOptional = userRepository.findOptionalByUsername(username);
			if (userOptional.isEmpty()) return ResponseEntity.status(404).body("회원정보를 찾을 수 없습니다.");
			jwtUtil.terminateUserSessions(username);
			
			String refreshToken = jwtUtil.getRefreshTokenFromCookie(request);
			if (refreshToken != null) jwtUtil.revokeRefreshToken(refreshToken);
			
			userRepository.deleteByUsername(username);
			
			Cookie cookie = new Cookie("refreshToken", null);
			cookie.setMaxAge(0);
			cookie.setPath("/");
			cookie.setHttpOnly(true);
			cookie.setSecure(true);
			response.addCookie(cookie);
			
			return ResponseEntity.ok("회원탈퇴 되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("서버 오류: " + e.getMessage());
		}
	}



}
