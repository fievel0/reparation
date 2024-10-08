package com.reparation.reparation.service;

import java.util.List;
import java.util.Optional;

import com.reparation.reparation.entities.Rep_order;

public interface IRep_orderService {
    List<Rep_order> findAll();

    Optional<Rep_order> findById(Long id);

    Optional<Rep_order> findLast();

    void save(Rep_order rep_order);

    void deleteById(Long id_order);

    
}
