package com.reparation.reparation.persistence.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.reparation.reparation.entities.Customers;
import com.reparation.reparation.persistence.ICustomersDAO;
import com.reparation.reparation.repository.CustomersRepository;

@Component
public class CustomersDAOimpl implements ICustomersDAO{
    
    @Autowired
    private CustomersRepository customersRepository;
    
    @Override
    public List<Customers> findAll() {
        return (List<Customers>) customersRepository.findAll();
    }

    @Override
    public Optional<Customers> findById(Long id_customer) {
        return customersRepository.findById(id_customer);
    }

    @Override
    public void save(Customers customers) {
        customersRepository.save(customers);
    }

    @Override
    public void deleteById(Long id_customers) {
        customersRepository.deleteById(id_customers);
    }

}
