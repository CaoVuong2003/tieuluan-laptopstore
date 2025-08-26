package com.tieuluan.laptopstore.auth.repositories;

import com.tieuluan.laptopstore.auth.entities.User;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailRepository extends JpaRepository<User, UUID> {

    User findByEmail(String email);

    Page<User> findAllByEnabled(boolean enabled, Pageable pageable);

    long countByEnabled(boolean enabled);
}

