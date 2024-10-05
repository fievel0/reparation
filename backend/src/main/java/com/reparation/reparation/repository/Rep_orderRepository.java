package com.reparation.reparation.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.reparation.reparation.entities.Rep_order;

@Repository
public interface Rep_orderRepository extends CrudRepository<Rep_order, Long>{

    @Query("SELECT r FROM Rep_order r WHERE r.id_order = (SELECT MAX(r2.id_order) FROM Rep_order r2)")
    
    Optional<Rep_order> findLastIdOrder();

}
