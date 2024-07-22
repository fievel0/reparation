package com.reparation.reparation.controllers.dto;

import java.math.BigDecimal;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Rep_orderDTO {
    private Long id_order;

    private Date create_date;
    private Date deadline;
    
    private BigDecimal tot_pay;
    
    private BigDecimal addit_details;
    
    private CustomerDTO customer;

    private EquipmentDTO equipment;

    private List<PaymentsDTO> payments;

}
