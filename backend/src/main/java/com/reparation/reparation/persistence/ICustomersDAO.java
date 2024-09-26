package com.reparation.reparation.persistence;

import java.util.Optional;
import java.util.List;

import com.reparation.reparation.entities.Customers;

public interface ICustomersDAO {

    List<Customers> findAll();

    Optional<Customers> findById(Long id_customer);

    void save(Customers customer);

    void deleteById(Long id_customers);

}
