package com.tecProject.tec.dto;

import lombok.Data;

@Data
public class ChangePasswordDTO {
	private String currentPassword;
	private String newPassword;
}
