package com.tieuluan.laptopstore.services;

import com.tieuluan.laptopstore.dto.BrandDto;
import com.tieuluan.laptopstore.dto.CategoryDto;
import com.tieuluan.laptopstore.dto.CategoryFiltersDto;
import com.tieuluan.laptopstore.dto.CategoryTypeDto;
import com.tieuluan.laptopstore.dto.SpecificationDTO;
import com.tieuluan.laptopstore.dto.SpecificationValueDTO;
import com.tieuluan.laptopstore.entities.Category;
import com.tieuluan.laptopstore.entities.Brand;
import com.tieuluan.laptopstore.entities.CategoryType;
import com.tieuluan.laptopstore.entities.Product;
import com.tieuluan.laptopstore.entities.ProductSpecAttribute;
import com.tieuluan.laptopstore.entities.SpecificationValue;
import com.tieuluan.laptopstore.exceptions.ResourceNotFoundEx;
import com.tieuluan.laptopstore.repositories.CategoryRepository;
import com.tieuluan.laptopstore.repositories.ProductRepository;
import com.tieuluan.laptopstore.repositories.ProductSpecificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductSpecificationRepository productSpecificationRepository;

    // public CategoryFiltersDto getFiltersByCategory(UUID categoryId) {

    //     // 2. Lấy tất cả product thuộc category
    //     List<Product> products = productRepository.findAllByCategoryId(categoryId);

    //     // 4. Lấy distinct categoryTypes từ products
    //     List<CategoryTypeDto> typeDtos = products.stream()
    //             .map(Product::getCategoryType)
    //             .filter(Objects::nonNull)
    //             .distinct()
    //             .map(type -> CategoryTypeDto.builder()
    //                     .id(type.getId())
    //                     .name(type.getName())
    //                     .code(type.getCode())
    //                     .description(type.getDescription())
    //                     .imgCategory(type.getImgCategory())
    //                     .build())
    //             .collect(Collectors.toList());


    //     // 5. Lấy specs + values
    //     List<Object[]> rawSpecsAndValues = productSpecificationRepository.findSpecsAndValuesByCategoryId(categoryId);

    //     Map<UUID, ProductSpecAttribute> specsMap = new HashMap<>();
    //     Map<UUID, Set<SpecificationValueDTO>> specValueMap = new HashMap<>();

    //     for (Object[] row : rawSpecsAndValues) {
    //         ProductSpecAttribute spec = (ProductSpecAttribute) row[0];
    //         SpecificationValue value = (SpecificationValue) row[1];

    //         specsMap.put(spec.getId(), spec);

    //         SpecificationValueDTO valDto = SpecificationValueDTO.builder()
    //                 .id(value.getId())
    //                 .value(value.getValue())
    //                 .build();

    //         specValueMap.computeIfAbsent(spec.getId(), k -> new HashSet<>()).add(valDto);
    //     }

    //     List<SpecificationDTO> specDtos = specsMap.values().stream()
    //             .map(spec -> SpecificationDTO.builder()
    //                     .id(spec.getId())
    //                     .name(spec.getLabel())
    //                     .specificationValues(new ArrayList<>(specValueMap.getOrDefault(spec.getId(), Collections.emptySet())))
    //                     .build())
    //             .collect(Collectors.toList());

    //     return CategoryFiltersDto.builder()
    //             .types(typeDtos)
    //             .specifications(specDtos)
    //             .build();
    // }

    

    public Optional<Category> getCategoryByCode(String code) {
        return categoryRepository.findByCode(code.toLowerCase());
    }

    public Category getCategory(UUID categoryId){
        Optional<Category> category = categoryRepository.findById(categoryId);
        return category.orElse(null);
    }

    public Category createCategory(CategoryDto categoryDto){
        Category category = mapToEntity(categoryDto);
        return categoryRepository.save(category);
    }

    private Category mapToEntity(CategoryDto categoryDto){
        Category category = Category.builder()
                .code(categoryDto.getCode())
                .name(categoryDto.getName())
                .description(categoryDto.getDescription())
                .build();

        if (categoryDto.getCategoryTypes() != null) {
            List<CategoryType> categoryTypes = mapToCategoryTypesList(categoryDto.getCategoryTypes(), category);
            category.setCategoryTypes(categoryTypes);
        }

        return category;
    }

    private List<CategoryType> mapToCategoryTypesList(List<CategoryTypeDto> categoryTypeList, Category category) {
        return categoryTypeList.stream().map(categoryTypeDto -> {
            CategoryType categoryType = new CategoryType();
            categoryType.setCode(categoryTypeDto.getCode());
            categoryType.setName(categoryTypeDto.getName());
            categoryType.setDescription(categoryTypeDto.getDescription());
            categoryType.setCategory(category);
            return categoryType;
        }).collect(Collectors.toList());
    }


    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    public Category updateCategory(CategoryDto categoryDto, UUID categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(()-> new ResourceNotFoundEx("Category not found with Id "+categoryDto.getId()));

        if(null != categoryDto.getName()){
            category.setName(categoryDto.getName());
        }
        if(null != categoryDto.getCode()){
            category.setCode(categoryDto.getCode());
        }
        if(null != categoryDto.getDescription()){
            category.setDescription(categoryDto.getDescription());
        }

        List<CategoryType> existing = category.getCategoryTypes();
        List<CategoryType> list= new ArrayList<>();

        if(categoryDto.getCategoryTypes() != null){
            categoryDto.getCategoryTypes().forEach(categoryTypeDto -> {
                if(null != categoryTypeDto.getId()){
                   Optional<CategoryType> categoryType = existing.stream().filter(t -> t.getId().equals(categoryTypeDto.getId())).findFirst();
                   CategoryType categoryType1= categoryType.get();
                   categoryType1.setCode(categoryTypeDto.getCode());
                   categoryType1.setName(categoryTypeDto.getName());
                   categoryType1.setDescription(categoryTypeDto.getDescription());
                    list.add(categoryType1);
                }
                else{
                    CategoryType categoryType = new CategoryType();
                    categoryType.setCode(categoryTypeDto.getCode());
                    categoryType.setName(categoryTypeDto.getName());
                    categoryType.setDescription(categoryTypeDto.getDescription());
                    categoryType.setCategory(category);
                    list.add(categoryType);
                }
            });
        }
        category.setCategoryTypes(list);

        return  categoryRepository.save(category);
    }

    public void deleteCategory(UUID categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
