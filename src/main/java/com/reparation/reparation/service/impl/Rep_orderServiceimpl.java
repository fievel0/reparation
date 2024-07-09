package com.reparation.reparation.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.reparation.reparation.entities.Rep_order;
import com.reparation.reparation.persistence.IRep_orderDAO;

@Service
public class Rep_orderServiceimpl implements IRep_orderDAO{

    @Autowired
    private IRep_orderDAO rep_orderDAO;
    
    @Override
    public List<Rep_order> findAll() {
        return rep_orderDAO.findAll();
    }

    @Override
    public Optional<Rep_order> findById(Long id_order) {
        return rep_orderDAO.findById(id_order);
    }

    @Override
    public void save(Rep_order rep_order) {
        rep_orderDAO.save(rep_order);
    }

    @Override
    public void deleteById(Long id_order) {
        rep_orderDAO.deleteById(id_order);
    }


}
