package com.reparation.reparation.controllers.dto;

import java.math.BigDecimal;
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
public class PaymentsDTO {

    private Long id_pay;
    private String date_pay;
    private BigDecimal money_pay;
    private BigDecimal money_b_pay;
    //private Rep_order order;
    
    private Long order_id;
    
    private BigDecimal order_tot_pay;
    
   // private List<Rep_orderDTO> rep_orders;

}
