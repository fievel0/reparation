package com.reparation.reparation.service;

import java.util.List;
import java.util.Optional;

import com.reparation.reparation.entities.Payments;

public interface IPaymentsService {
     List<Payments> findAll();

    Optional<Payments> findById(Long id_pay);

    //aqui se pueden definir los metodos necesarios para validar entradas
    //ejemplo
    //List<Equipment> findByAntiguedadInRange(BigDecimal minanti_equip, BigDecimal maxanti_equip);
    //esto es para los Query Methods

    void save(Payments payments);

    void deleteById(Long id_pay);
}
