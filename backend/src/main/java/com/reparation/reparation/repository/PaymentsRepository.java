package com.reparation.reparation.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.reparation.reparation.entities.Payments;

@Repository
public interface PaymentsRepository extends CrudRepository<Payments, Long>{

}
