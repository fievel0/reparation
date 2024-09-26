package com.reparation.reparation.repository;

import com.reparation.reparation.entities.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository <Users, Long> {
    Users findByEmail(String email);
}
