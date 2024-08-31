package com.reparation.reparation.controllers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reparation.reparation.controllers.dto.CustomerDTO;
import com.reparation.reparation.controllers.dto.EquipmentDTO;
import com.reparation.reparation.controllers.dto.PaymentsDTO;
import com.reparation.reparation.controllers.dto.Rep_orderDTO;
import com.reparation.reparation.entities.Rep_order;
import com.reparation.reparation.service.IRep_orderService;

@RestController
@RequestMapping("/api/ord_rep")
public class Rep_orderController {

    @Autowired
    private IRep_orderService rep_orderService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id){
        Optional<Rep_order> rep_orderOptional = rep_orderService.findById(id);

        if (rep_orderOptional.isPresent()){
            Rep_order rep_order = rep_orderOptional.get();
            Rep_orderDTO rep_orderDTO = Rep_orderDTO.builder()
                .id_order(rep_order.getId_order())
                .create_date(rep_order.getCreate_date())
                .deadline(rep_order.getDeadline())
                .tot_pay(rep_order.getTot_pay())
                .addit_details(rep_order.getAddit_details())

                .customer(CustomerDTO.builder()
                    .name(rep_order.getCustomer().getName())
                    .card_identifi(rep_order.getCustomer().getCard_identifi())
                    .phone(rep_order.getCustomer().getPhone())
                    .mail(rep_order.getCustomer().getMail())
                .build())

                .equipment(EquipmentDTO.builder()
                    .model_equip(rep_order.getEquipment().getModel_equip())
                    .brand_equip(rep_order.getEquipment().getBrand_equip())
                    .color_equip(rep_order.getEquipment().getColor_equip())
                    .state_equip(rep_order.getEquipment().getState_equip())
                    .pass_equip(rep_order.getEquipment().getPass_equip())
                    .anti_equip(rep_order.getEquipment().getAnti_equip())
                    .accessor_equip(rep_order.getEquipment().getAccessor_equip())
                    .reported_equip(rep_order.getEquipment().getReported_equip())
                    .detail_phy_equip(rep_order.getEquipment().getDetail_phy_equip())
                    .temp_equip(rep_order.getEquipment().getTemp_equip())
                    .on_off_equip(rep_order.getEquipment().isOn_off_equip())
                    .cau_dam_equip(rep_order.getEquipment().getCau_dam_equip())
                .build())
                
                .payments(rep_order.getPaymentsList().stream()
                    .map(payment -> PaymentsDTO.builder()    
                        .id_pay(payment.getId_pay())  
                        .date_pay(payment.getDate_pay())
                        .money_pay(payment.getMoney_pay())
                        .money_b_pay(payment.getMoney_b_pay())
                    .build())
                .collect(Collectors.toList()))

                .build();
            return ResponseEntity.ok(rep_orderDTO);
        }

        return ResponseEntity.notFound().build();     
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAll(){
        List<Rep_orderDTO> rep_orderList = rep_orderService.findAll()
            .stream()
            .map(rep_order -> {
                // Inicializa la lista de pagos
                Hibernate.initialize(rep_order.getPaymentsList());

                return Rep_orderDTO.builder()
                    .id_order(rep_order.getId_order()) 
                    .create_date(rep_order.getCreate_date())
    

                    .customer(CustomerDTO.builder()
                        .id_customer(rep_order.getCustomer().getId_customer())
                        .name(rep_order.getCustomer().getName())
                    .build())

                    .equipment(EquipmentDTO.builder()
                        .id_equip(rep_order.getEquipment().getId_equip())
                        .model_equip(rep_order.getEquipment().getModel_equip())
                    .build())

                    .payments(rep_order.getPaymentsList().stream()
                        .map(payment -> PaymentsDTO.builder()      
                            .date_pay(payment.getDate_pay())
                        .build())
                        .collect(Collectors.toList()))
                    .build();
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(rep_orderList);     
    }   


   /*  @PostMapping("/save")
     public ResponseEntity<?> save(@RequestBody Rep_orderDTO orderDTO) throws URISyntaxException{
        
        if(orderDTO.getCreate_date().isBlank()){
            return ResponseEntity.badRequest().build();
        }

        rep_orderService.save(Rep_order.builder())
            .deadline(orderDTO.getDeadline())
            .tot_pay(orderDTO.getTot_pay())
            .addit_details(orderDTO.getAddit_details())
            
        .build();

        rep_orderService.save(rep_order);

        return ResponseEntity.created(new URI("/api/order_rep/save")).build();
    }*/ 

}
