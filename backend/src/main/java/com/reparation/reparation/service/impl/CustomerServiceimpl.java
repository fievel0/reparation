package com.reparation.reparation.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.reparation.reparation.entities.Customers;
import com.reparation.reparation.persistence.ICustomersDAO;
import com.reparation.reparation.service.ICustomersService;

@Service
public class CustomerServiceimpl implements ICustomersService{

    @Autowired
    private ICustomersDAO customersDAO;

    @Override
    public List<Customers> findAll() {
        return customersDAO.findAll();
    }

    @Override
    public Optional<Customers> findById(Long id_customer) {
        return customersDAO.findById(id_customer);
    }

    @Override
    public ResponseEntity<?> save(Customers customer) {
        customersDAO.save(customer);
        return ResponseEntity.ok().build();
    }

    @Override
    public void deleteById(Long id_customer) {
        customersDAO.deleteById(id_customer);
    }


}
