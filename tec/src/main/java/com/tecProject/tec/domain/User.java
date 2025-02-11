package com.tecProject.tec.domain;

import java.time.LocalDateTime;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "USER")

public class User {
	
	//회원번호 (Primary Key)
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "USER_NO")
	private int userNo;
		
		//회원타입 (ROLE_ADMIN=관리자, ROLE_USER=회원)
		@Column(name = "USER_TYPE", nullable = false)
		private String userType;
		
		//로그인여부 (true = 회원, false = 비회원 : 회원 무조건 1 반환) *IP때문에 추가
		@Builder.Default //빌더초기화해제
		@Column(name = "IS_MEMBER", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
		private Boolean isMember = true;
		
		//사용자 아이디
		@Column(name = "USER_NAME", nullable = false, unique = true, length = 50)
		private String username;
		
		//비밀번호(암호화)
		@Column(name = "PASSWORD", nullable = false, length = 255)
		private String password;
		
		//이름(5자 까지)
		@Column(name = "NAME", nullable = false, length = 50)
		private String name;
		
		//이메일(아이디로 겸용가능)
		@Column(name = "EMAIL", nullable = false, unique = true, length = 100)
		private String email;
		
		//전화번호(전화번호 인증가능)
		@Column(name = "PHONE", length = 20)
		private String phone;
		
		//회원가입 일자
		@Column(name = "CREATE_DATE", nullable = false)
		@CreatedDate
		private LocalDateTime createDate;
		
		//비밀번호 변경일자(3개월주기 변경)
		@Column(name = "CHANGE_PW_DATE",  nullable = false)
		@LastModifiedDate
		private LocalDateTime changePwDate;
		
		//주민등록번호 앞자리
	    @Column(name = "SSN_FIRST", nullable = false, length = 6)
	    private String ssnFirst;

	    //주민등록번호 뒷자리
	    @Column(name = "SSN_SECOND", nullable = false, length = 7)
	    private String ssnSecond;
}