package com.tecProject.tec.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tecProject.tec.domain.User;
import com.tecProject.tec.dto.JoinDTO;
import com.tecProject.tec.service.JoinService;

@RestController
@RequestMapping("/user")
public class JoinController {

    private final JoinService joinService;

    public JoinController(JoinService joinService) {
        this.joinService = joinService;
    }

    // 회원가입 API
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody JoinDTO joinDTO) {
        try {
            User newUser = joinService.joinProcess(joinDTO);
            return ResponseEntity.ok(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("서버 오류가 발생했습니다.");
        }
    }

    // 아이디 중복 확인 API
    @PostMapping("/check-id")
    public ResponseEntity<?> checkId(@RequestBody JoinDTO joinDTO) {
        boolean isAvailable = joinService.checkIdAvailability(joinDTO.getUsername());
        return ResponseEntity.ok(isAvailable ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다.");
    }

    // 이메일 중복 확인 API
    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody JoinDTO joinDTO) {
        boolean isAvailable = joinService.checkEmailAvailability(joinDTO.getEmail());
        return ResponseEntity.ok(isAvailable ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.");
    }
}
