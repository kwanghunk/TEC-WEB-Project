package com.tecProject.tec.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tecProject.tec.domain.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	Boolean existsByUsername(String username);

	User findByUsername(String username);

	boolean existsByEmail(String email);
}