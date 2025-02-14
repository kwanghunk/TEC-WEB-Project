package com.tecProject.tec.service;


import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.tecProject.tec.auth.JWTUtil;
import com.tecProject.tec.domain.User;
import com.tecProject.tec.dto.LoginDTO;
import com.tecProject.tec.repository.UserRepository;

@Service
public class LoginService {

	private final UserRepository userRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	private final JWTUtil jwtUtil;
	
	public LoginService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, JWTUtil jwtUtil) {
		this.userRepository = userRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
		this.jwtUtil = jwtUtil;
	}
	
	public User authenticateUser(LoginDTO loginDTO) {
		User user = userRepository.findByUsername(loginDTO.getUsername());
		
		if (user == null) {
		    throw new BadCredentialsException("아이디가 존재하지 않습니다.");
		}
		
		if (!bCryptPasswordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
			throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
		}
		return user;
	}
}
