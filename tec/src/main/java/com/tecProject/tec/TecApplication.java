package com.tecProject.tec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing //날짜 기록 기능이 활성화
public class TecApplication {

	public static void main(String[] args) {
		SpringApplication.run(TecApplication.class, args);
	}

}
