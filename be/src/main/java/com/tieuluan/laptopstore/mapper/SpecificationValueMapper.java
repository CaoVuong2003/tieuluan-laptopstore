package com.tieuluan.laptopstore.mapper;

import com.tieuluan.laptopstore.dto.SpecificationValueDTO;
import com.tieuluan.laptopstore.entities.SpecificationValue;

public class SpecificationValueMapper {

    public static SpecificationValueDTO toDTO(SpecificationValue sv) {
        if (sv == null) return null;
        return SpecificationValueDTO.builder()
                .id(sv.getId())
                .value(sv.getValue())
                .build();
    }

    public static SpecificationValue toEntity(SpecificationValueDTO dto) {
        if (dto == null) return null;
        SpecificationValue sv = new SpecificationValue();
        sv.setId(dto.getId());
        sv.setValue(dto.getValue());
        // Không set specification ở đây, set riêng ở service
        return sv;
    }
}
