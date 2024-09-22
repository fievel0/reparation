package com.reparation.reparation.controllers.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.reparation.reparation.entities.Rep_order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class EmployeeDTO {
     private Long idEmployee;
    private String nameEmployee;
    private String positionEmployee;

    @Builder.Default
    private List<Rep_order> orders = new ArrayList<>();
}
