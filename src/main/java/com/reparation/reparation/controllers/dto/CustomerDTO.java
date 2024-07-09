package com.reparation.reparation.controllers.dto;

import java.util.ArrayList;
import java.util.List;

import com.reparation.reparation.entities.Rep_order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerDTO {
    
    private Long id_customer;
   
    private String name;
   
    private String card_identifi;
    
    private String phone;
  
    private String mail;
    @Builder.Default
    private List<Rep_order> rep_orderList = new ArrayList<>();
}
