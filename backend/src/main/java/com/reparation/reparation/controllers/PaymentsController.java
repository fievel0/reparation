package com.reparation.reparation.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reparation.reparation.controllers.dto.PaymentsDTO;
import com.reparation.reparation.entities.Payments;
import com.reparation.reparation.entities.Rep_order;
import com.reparation.reparation.service.IPaymentsService;
import com.reparation.reparation.service.IRep_orderService;

@RestController
@RequestMapping("/api/payments")
public class PaymentsController {
    
    private final IPaymentsService paymentsService;
    private final IRep_orderService rep_orderService;

    @Autowired
    public PaymentsController(IPaymentsService paymentsService, IRep_orderService rep_orderService) {
        this.paymentsService = paymentsService;
        this.rep_orderService = rep_orderService;
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
        .map(payments -> {
            Rep_order order = payments.getOrder();
            return PaymentsDTO.builder()

            .id_pay(payments.getId_pay())
            .date_pay(payments.getDate_pay())
            .money_pay(payments.getMoney_pay())
            .money_b_pay(payments.getMoney_b_pay())
            .order_id(order.getId_order())
            .order_tot_pay(order.getTot_pay())
            .build();
        })
        .collect(Collectors.toList());
        return ResponseEntity.ok(paymentsList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody PaymentsDTO paymentsDTO) throws URISyntaxException{
        
        if(paymentsDTO.getDate_pay().isBlank()){
            return ResponseEntity.badRequest().build();
        }

        Optional<Rep_order> rep_orderOptional = rep_orderService.findById(paymentsDTO.getOrder_id());
        if(!rep_orderOptional.isPresent()){
            return ResponseEntity.badRequest().body("Orden de reparacion no existe");
        }
        Payments payments = Payments.builder().date_pay(paymentsDTO.getDate_pay())
            .money_pay(paymentsDTO.getMoney_pay())
            .money_b_pay(paymentsDTO.getMoney_b_pay())
            .order(rep_orderOptional.get())
        .build();
        paymentsService.save(payments);

        return ResponseEntity.created(new URI("/api/equipment/save")).build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePayments(@PathVariable Long id, @RequestBody PaymentsDTO paymentsDTO){
        try {
            Optional<Payments> paymentsOptional = paymentsService.findById(id);

        if(paymentsOptional.isPresent()){

            Payments payments = paymentsOptional.get();
            payments.setDate_pay((paymentsDTO.getDate_pay()));
            payments.setMoney_pay(paymentsDTO.getMoney_pay());
            payments.setMoney_b_pay(paymentsDTO.getMoney_b_pay());

            Optional<Rep_order> repOrderOptional = rep_orderService.findById(paymentsDTO.getOrder_id());
            if(!repOrderOptional.isPresent()){
                return ResponseEntity.badRequest().body("Orden de reparación no existe");
            }
    
            // Asignar el nuevo Rep_order al Payments
            payments.setOrder(repOrderOptional.get());
            // Guardar el objeto actualizado
            paymentsService.save(payments);
            
            return ResponseEntity.ok("Registro Actualizado");
            } else {
            return ResponseEntity.notFound().build();
        }
        } catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id){

        if(id != null){
            paymentsService.deleteById(id);
            return ResponseEntity.ok("Registro Eliminado");
        }

        return ResponseEntity.badRequest().build();
    }

}
