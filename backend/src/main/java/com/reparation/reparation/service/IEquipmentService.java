package com.reparation.reparation.service;

import java.util.List;
import java.util.Optional;

import com.reparation.reparation.entities.Equipment;

public interface IEquipmentService {
    List<Equipment> findAll();

    Optional<Equipment> findById(Long id_equip);

    //aqui se pueden definir los metodos necesarios para validar entradas
    //ejemplo
    //List<Equipment> findByAntiguedadInRange(BigDecimal minanti_equip, BigDecimal maxanti_equip);
    //esto es para los Query Methods

    Equipment save(Equipment equipment);

    void deleteById(Long id_equip);
}
