package com.reparation.reparation.controllers;

import java.util.Optional;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reparation.reparation.controllers.dto.CustomerDTO;
import com.reparation.reparation.entities.Customers;
import com.reparation.reparation.service.ICustomersService;

@RestController
@RequestMapping("/api/customer")
public class CustomersController {
    
    @Autowired
    private ICustomersService customerService;
    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id){
        Optional<Customers> customerOptional = customerService.findById(id);

        if (customerOptional.isPresent()){
            Customers customer = customerOptional.get();

            CustomerDTO customerDTO = CustomerDTO.builder()
                .id_customer(customer.getId_customer())
                .name(customer.getName())
                .card_identifi(customer.getCard_identifi())
                .phone(customer.getPhone())
                .mail(customer.getMail())
                .build();

            return ResponseEntity.ok(customerDTO);
        }

        return ResponseEntity.notFound().build();
    }
    @GetMapping("/findAll")
    public ResponseEntity<?> findAll(){
        List<CustomerDTO> customerList = customerService.findAll()
            .stream()
            .map(customer -> CustomerDTO.builder()
                .id_customer(customer.getId_customer())
                .name(customer.getName())
                .card_identifi(customer.getCard_identifi())
                .phone(customer.getPhone())
                .mail(customer.getMail())
                .build())
            .toList();
        return ResponseEntity.ok(customerList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody CustomerDTO customerDTO) throws URISyntaxException{

        if(customerDTO.getName().isBlank()){

            return ResponseEntity.badRequest().build();
        }

        customerService.save(Customers.builder()
        .name(customerDTO.getName())
        .card_identifi(customerDTO.getCard_identifi())
        .phone(customerDTO.getPhone())
        .mail(customerDTO.getMail())
        .build());

        return ResponseEntity.created(new URI("/api/customer/save")).build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCustomers(@PathVariable Long id, @RequestBody CustomerDTO customerDTO){
        Optional<Customers> customerOptional = customerService.findById(id);

        if(customerOptional.isPresent()){

            Customers customer = customerOptional.get();
            customer.setName(customerDTO.getName());
            customerService.save(customer);
            return ResponseEntity.ok("Registro Actualizado");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id){

        if(id != null){
            customerService.deleteById(id);
            return ResponseEntity.ok("Registro Eliminado");
        }

        return ResponseEntity.badRequest().build();
    }

    
}