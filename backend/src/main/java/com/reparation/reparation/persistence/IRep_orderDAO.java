package com.reparation.reparation.persistence;

import java.util.List;
import java.util.Optional;

import com.reparation.reparation.entities.Rep_order;

public interface IRep_orderDAO {

    List<Rep_order> findAll();

    Optional<Rep_order> findById(Long id_order);

    Optional<Rep_order> findLastIdOrder();  // Nuevo método

    void save(Rep_order rep_order);

    void deleteById(Long id_order);
}
