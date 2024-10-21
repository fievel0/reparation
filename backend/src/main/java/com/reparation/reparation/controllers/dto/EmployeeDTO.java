package com.reparation.reparation.controllers.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeDTO {
     private Long idEmployee;
    
    private String nameEmployee;

    private String positionEmployee;

    private String cedEmployee;
    
    private String dirEmployee;
    
    private String telEmployee;
    
    private List<Rep_orderDTO> orders;
}
