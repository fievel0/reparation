package com.reparation.reparation.persistence.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.reparation.reparation.entities.Rep_order;
import com.reparation.reparation.persistence.IRep_orderDAO;
import com.reparation.reparation.repository.Rep_orderRepository;

@Component
public class Rep_orderDAOimpl implements IRep_orderDAO {

    @Autowired
    private Rep_orderRepository rep_orderRepository;
    @Override
    public List<Rep_order> findAll() {
        return (List<Rep_order>) rep_orderRepository.findAll();
    }

    @Override
    public Optional<Rep_order> findById(Long id_order) {
        return rep_orderRepository.findById(id_order);
    }

    @Override
    public void save(Rep_order rep_order) {
        rep_orderRepository.save(rep_order);
    }

    @Override
    public void deleteById(Long id_order) {
        rep_orderRepository.deleteById(id_order);
    }

}
