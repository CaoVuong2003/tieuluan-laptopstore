package com.tieuluan.laptopstore.services;

import com.tieuluan.laptopstore.dto.ProductDto;
import com.tieuluan.laptopstore.entities.Product;

import java.util.List;
import java.util.UUID;

public interface ProductService {

    public Product addProduct(ProductDto product);
    
    public List<ProductDto> getAllProducts(UUID categoryId, UUID typeId);

    ProductDto getProductBySlug(String slug);

    ProductDto getProductById(UUID id);

    Product updateProduct(ProductDto productDto, UUID id);

    Product fetchProductById(UUID uuid) throws Exception;

    // public List<Product> getProductsByBrand(UUID brandId);

    public List<Product> getProductsByCategoryType(UUID categoryTypeId);
}
