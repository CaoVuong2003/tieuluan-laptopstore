package com.tieuluan.laptopstore.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tieuluan.laptopstore.entities.ProductSpecAttribute;

public interface ProductSpecAttributeRepository extends JpaRepository<ProductSpecAttribute, UUID> {
}