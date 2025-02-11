package com.tecProject.tec.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.tecProject.tec.domain.User;
import com.tecProject.tec.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    
    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
    	this.userRepository = userRepository;
    	this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public User updateUser(User user) {
        User existingUser = userRepository.findById(user.getUserNo())
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 아이디 변경 처리
        if (!existingUser.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(user.getUsername())) {
                throw new IllegalArgumentException("Username already exists");
            }
            existingUser.setUsername(user.getUsername());
        }

        // 다른 필드 업데이트
        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());

        return userRepository.save(existingUser);
    }
    /*
    public boolean changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found"); // 사용자 없을 경우 예외 처리
        }

        // 현재 비밀번호 확인
        if (!user.getPassword().equals(currentPassword)) {
            return false; // 비밀번호가 맞지 않을 경우 false 반환
        }

        // 비밀번호 변경
        user.setPassword(newPassword);
        userRepository.save(user);
        return true;
    }*/
    
    public boolean changePassword(String username, String currentPassword, String newPassword) {
        User user = userRepository.findByUsername(username);
        
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        // 현재 비밀번호 확인
        if (!bCryptPasswordEncoder.matches(currentPassword, user.getPassword())) {
            return false;
        }

        // 새 비밀번호 암호화 후 저장
        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

}
