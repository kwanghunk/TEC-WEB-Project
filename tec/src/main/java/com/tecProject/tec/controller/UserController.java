package com.tecProject.tec.controller;

import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.tecProject.tec.auth.JWTUtil;
import com.tecProject.tec.domain.User;
import com.tecProject.tec.dto.ChangePasswordDTO;
import com.tecProject.tec.dto.UserDTO;
import com.tecProject.tec.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@RestController
@RequestMapping("/user")
@ResponseBody
public class UserController {

    @Autowired
    private UserService userService;
    
    public UserController(UserService userService) {
    	this.userService = userService;
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getUserInfo() {   
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
        }
        String username = authentication.getName(); // JWT에서 username 추출
		try {
			UserDTO userInfo = userService.getUserInfo(username);
			return ResponseEntity.ok(userInfo);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("회원정보 조회 실패: " + e.getMessage());
		}
    }
    
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserDTO userDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
        }
        String username = authentication.getName(); // JWT에서 username 추출
        try {
            userService.updateUserProfile(username, userDTO);
            return ResponseEntity.ok("회원정보가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("회원정보 수정 실패: " + e.getMessage());
        }
    }
    
    @PutMapping("/profile/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
        }
        String username = authentication.getName(); // JWT에서 username 추출
        try {
            boolean isPasswordChanged = userService.changePassword(username, changePasswordDTO.getCurrentPassword(), changePasswordDTO.getNewPassword());

            if (isPasswordChanged) {
                return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
            } else {
                return ResponseEntity.status(400).body("현재 비밀번호가 올바르지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("비밀번호 변경 실패: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 후 이용 가능합니다.");
        }
        String username = authentication.getName();
        return userService.deleteUser(username, request, response);
    }
    
}
