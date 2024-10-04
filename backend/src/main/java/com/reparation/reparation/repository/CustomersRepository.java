package com.reparation.reparation.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.reparation.reparation.entities.Customers;

@Repository
public interface CustomersRepository extends CrudRepository<Customers, Long>{

    Optional<Customers> findByCardIdentifi(String cardIdentifi);

}
