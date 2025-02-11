package com.tecProject.tec.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tecProject.tec.domain.User;
import com.tecProject.tec.dto.CustomUserDetails;
import com.tecProject.tec.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;
	
	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User userData = userRepository.findByUsername(username);
		
		if (userData != null) {
			return new CustomUserDetails(userData);
		}
		return null;
	}

}
