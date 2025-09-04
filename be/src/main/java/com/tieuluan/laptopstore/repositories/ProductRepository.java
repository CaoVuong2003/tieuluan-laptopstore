package com.tieuluan.laptopstore.repositories;

import com.tieuluan.laptopstore.entities.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    List<Product> findByBrandId(UUID brandId);
    List<Product> findByCategoryTypeId(UUID categoryTypeId);

    Product findBySlug(String slug);
    
    @Query("SELECT p FROM Product p " +
        "LEFT JOIN FETCH p.productSpecifications ps " +
        "LEFT JOIN FETCH ps.specification " +
        "LEFT JOIN FETCH ps.specificationValue " +
        "WHERE p.slug = :slug")
    Optional<Product> findBySlugWithSpecifications(@Param("slug") String slug);
}
