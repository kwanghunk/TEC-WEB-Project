package com.tecProject.tec.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.tecProject.tec.domain.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	Boolean existsByUsername(String username);

	boolean existsByEmail(String email);

	User findByUsername(String username);
	
	Optional<User> findOptionalByUsername(String username);

	void deleteByUsername(String username);

	@Query("SELECT u.username FROM User u WHERE u.userType = 'ROLE_ADMIN'")
	List<String> findAllAdmins();
}