package com.reparation.reparation.persistence.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.reparation.reparation.entities.Payments;
import com.reparation.reparation.persistence.IPaymentsDAO;
import com.reparation.reparation.repository.PaymentsRepository;

@Component
public class PaymentsDAOimpl implements IPaymentsDAO{

    @Autowired
    private PaymentsRepository paymentsRepository;

    @Override
    public List<Payments> findAll() {
        return (List<Payments>) paymentsRepository.findAll();
    }

    @Override
    public Optional<Payments> findById(Long id_pay) {
        return paymentsRepository.findById(id_pay);
    }

    @Override
    public void save(Payments payments) {
        paymentsRepository.save(payments);
    }

    @Override
    public void deleteById(Long id_pay) {
        paymentsRepository.deleteById(id_pay);
    }
    
}
