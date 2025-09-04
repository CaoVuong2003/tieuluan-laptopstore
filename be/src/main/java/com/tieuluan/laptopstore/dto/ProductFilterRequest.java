package com.tieuluan.laptopstore.dto;

import java.util.*;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductFilterRequest {
    private UUID categoryId;
    private List<UUID> typeIds;
    private List<UUID> brandIds;
    private Map<String, String> specs;
}
