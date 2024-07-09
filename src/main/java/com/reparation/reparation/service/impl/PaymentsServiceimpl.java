package com.reparation.reparation.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.reparation.reparation.entities.Payments;
import com.reparation.reparation.persistence.IPaymentsDAO;

@Service
public class PaymentsServiceimpl implements IPaymentsDAO {

    @Autowired
    private IPaymentsDAO paymentsDAO;

    @Override
    public List<Payments> findAll() {
        return paymentsDAO.findAll();
    }

    @Override
    public Optional<Payments> findById(Long id_pay) {
        return paymentsDAO.findById(id_pay);
    }

    @Override
    public void save(Payments payments) {
        paymentsDAO.save(payments);
    }

    @Override
    public void deleteById(Long id_pay) {
        paymentsDAO.deleteById(id_pay);
    }




}
