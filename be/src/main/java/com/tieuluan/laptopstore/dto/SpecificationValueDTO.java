package com.tieuluan.laptopstore.dto;

import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecificationValueDTO {
    private UUID id;
    private String value;
}
