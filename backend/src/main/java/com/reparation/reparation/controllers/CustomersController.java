package com.reparation.reparation.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

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
    
    
@GetMapping("/cedula/{cardIdentifi}")
/***********************BUSQUEDA DE CLIENTES POR CEDULA******************************************* */
public ResponseEntity<?> getCustomersByCardIdentifi(@PathVariable("cardIdentifi") String cardIdentifi) {
    Optional<Customers> customerOptional = customerService.findByCardIdentifi(cardIdentifi);
    
    if (customerOptional.isPresent()){
        Customers customer = customerOptional.get();

        CustomerDTO customerDTO = CustomerDTO.builder()
            .id_customer(customer.getId_customer())
            .name(customer.getName())
            .cardIdentifi(customer.getCardIdentifi())
            .phone(customer.getPhone())
            .mail(customer.getMail())
            .build();
        return ResponseEntity.ok(customerDTO);
    }
    return ResponseEntity.notFound().build();
}


    /***********************BUSQUEDA DE CLIENTES POR ID******************************************* */    
    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id){
        Optional<Customers> customerOptional = customerService.findById(id);
        if (customerOptional.isPresent()){
            Customers customer = customerOptional.get();

            CustomerDTO customerDTO = CustomerDTO.builder()
                .id_customer(customer.getId_customer())
                .name(customer.getName())
                .cardIdentifi(customer.getCardIdentifi())
                .phone(customer.getPhone())
                .mail(customer.getMail())
                .build();
            return ResponseEntity.ok(customerDTO);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping
    public ResponseEntity<?> getAllCustomers() {
        return findAll(); // Llama al método findAll() para obtener la lista de clientes
    }

    /***********************listado de todos los clientes ordenados en forma alfabetica******************************************* */
    @GetMapping("/findAll")
    public ResponseEntity<?> findAll(){
        List<CustomerDTO> customerList = customerService.findAll()
            .stream()
            .sorted(Comparator.comparing(Customers::getName)) // Ordenar por nombre
            .map(customer -> CustomerDTO.builder()
                .id_customer(customer.getId_customer())
                .name(customer.getName())
                .cardIdentifi(customer.getCardIdentifi())
                .phone(customer.getPhone())
                .mail(customer.getMail())
                .build())
            .toList();
        return ResponseEntity.ok(customerList);
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody CustomerDTO customerDTO) throws URISyntaxException{

    // Verificar si el campo cardIdentifi está vacío
    if (customerDTO.getName().isEmpty()) {
        return ResponseEntity.badRequest().body("El nombre del cliente no puede estar vacío.");
    } 


       // Verificar si ya existe un cliente con el mismo cardIdentifi
       Optional<Customers> existingCustomer = customerService.findByCardIdentifi(customerDTO.getCardIdentifi());
       if (existingCustomer.isPresent()) {
           return ResponseEntity.badRequest().body("LA CEDULA DEL CLIENTE QUE INTENTA GUARDAR YA EXISTE!!!");
       }

        customerService.save(Customers.builder()
        .name(customerDTO.getName())
        .cardIdentifi(customerDTO.getCardIdentifi())
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
            customer.setCardIdentifi(customerDTO.getCardIdentifi());
            customer.setPhone(customerDTO.getPhone());
            customer.setMail(customerDTO.getMail());
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