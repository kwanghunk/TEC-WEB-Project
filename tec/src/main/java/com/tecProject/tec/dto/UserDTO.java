package com.tecProject.tec.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
	private String username;
	private String password;
	private String name;
	private String email;
	private String phone;
	private LocalDateTime createDate;
	private String ssnFirst;
	private String ssnSecond;
	private LocalDateTime changePwDate;
	
	public UserDTO(String username, String name, String email, String phone, LocalDateTime createDate, String ssnFirst) {
		this.username = username;
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.createDate = createDate;
		this.ssnFirst = ssnFirst;
	}
	
	public UserDTO(String name, String email, String phone) {
		this.name = name;
		this.email = email;
		this.phone = phone;
	}
	
}
