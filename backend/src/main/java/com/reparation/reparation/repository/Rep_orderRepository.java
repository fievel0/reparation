package com.reparation.reparation.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.reparation.reparation.entities.Rep_order;

@Repository
public interface Rep_orderRepository extends CrudRepository<Rep_order, Long>{

}
