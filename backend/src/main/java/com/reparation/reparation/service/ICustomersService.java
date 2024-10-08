package com.reparation.reparation.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

import com.reparation.reparation.entities.Customers;

public interface ICustomersService {
    List<Customers> findAll();

    Optional<Customers> findById(Long id_customer);

    Optional<Customers> findByCardIdentifi(String cardIdentifi);

    ResponseEntity<?> save(Customers customer);

    void deleteById(Long id_customer);
}
