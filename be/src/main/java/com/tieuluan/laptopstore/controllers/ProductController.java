package com.tieuluan.laptopstore.controllers;

import com.tieuluan.laptopstore.dto.ProductDto;
import com.tieuluan.laptopstore.entities.Product;
import com.tieuluan.laptopstore.repositories.ProductRepository;
import com.tieuluan.laptopstore.services.ProductService;

import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID typeId,
            @RequestParam(required = false) String slug,
            HttpServletResponse response
    ) {
        List<ProductDto> productList = new ArrayList<>();

        if (StringUtils.isNotBlank(slug)) {
            ProductDto productDto = productService.getProductBySlug(slug);
            if (productDto != null) productList.add(productDto);
        } else {
            productList = productService.getAllProducts(categoryId, typeId);
        }

        response.setHeader("Content-Range", String.valueOf(productList.size()));
        return new ResponseEntity<>(productList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable UUID id){
        ProductDto productDto = productService.getProductById(id);
        return new ResponseEntity<>(productDto, HttpStatus.OK);
    }

    //   create Product
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductDto productDto){
        Product product = productService.addProduct(productDto);
        return new ResponseEntity<>(product,HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@RequestBody ProductDto productDto,@PathVariable UUID id){
        Product product = productService.updateProduct(productDto,id);
        return new ResponseEntity<>(product,HttpStatus.OK);
    }

    @GetMapping("/filters")
    public ResponseEntity<List<Product>> filterProducts(
            // @RequestParam(required = false) UUID brandId,
            @RequestParam(required = false) UUID categoryTypeId) {

        // if (brandId != null) {
        //     return ResponseEntity.ok(productService.getProductsByBrand(brandId));
        // }
        if (categoryTypeId != null) {
            return ResponseEntity.ok(productService.getProductsByCategoryType(categoryTypeId));
        }
        return ResponseEntity.ok(productRepository.findAll());
    }

}
