package com.reparation.reparation.controllers.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
<<<<<<< HEAD
import java.util.Date;
=======
>>>>>>> e1e489fe3e28ba0974d370611032cfed2aad9b5d
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

    private LocalDate create_date;
    
    private LocalDate deadline;
    
    private BigDecimal tot_pay;
    
    private String addit_details;
    
    private CustomerDTO customer;

    private EquipmentDTO equipment;

    private List<PaymentsDTO> payments;

    private EmployeeDTO employee;

}
