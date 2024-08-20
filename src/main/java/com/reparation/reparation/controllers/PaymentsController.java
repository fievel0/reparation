package com.reparation.reparation.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reparation.reparation.controllers.dto.PaymentsDTO;
import com.reparation.reparation.entities.Payments;
import com.reparation.reparation.entities.Rep_order;
import com.reparation.reparation.service.IPaymentsService;

@RestController
@RequestMapping("/api/payments")
public class PaymentsController {
    
    private final IPaymentsService paymentsService; // Declaración del servicio

    @Autowired
     public PaymentsController(IPaymentsService paymentsService) {
          this.paymentsService = paymentsService;
        }

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id){

        Optional<Payments> paymentsOptional = paymentsService.findById(id);

          if (paymentsOptional.isPresent()){             
            Payments payments = paymentsOptional.get();
            Rep_order order = payments.getOrder();
            PaymentsDTO paymentsDTO = PaymentsDTO.builder()
                .id_pay(payments.getId_pay())
                .date_pay(payments.getDate_pay())
                .money_pay(payments.getMoney_pay())
                .money_b_pay(payments.getMoney_b_pay())
                .order_id(order.getId_order())
                .order_tot_pay(order.getTot_pay())
                .build();
            return ResponseEntity.ok(paymentsDTO);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping("/findAll")
    public ResponseEntity<?> findAll(){
        List<PaymentsDTO> paymentsList = paymentsService.findAll()
       .stream()
         .map(payments -> PaymentsDTO.builder()
        
           .id_pay(payments.getId_pay())
            .date_pay(payments.getDate_pay())
            .money_pay(payments.getMoney_pay())
            .money_b_pay(payments.getMoney_b_pay())

            .order_id(rep_orders.getId_order())
           
            .build())
        .toList();
        return ResponseEntity.ok(paymentsList);
    }

    
}
