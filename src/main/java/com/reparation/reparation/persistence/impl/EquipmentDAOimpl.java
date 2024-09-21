package com.reparation.reparation.persistence.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.reparation.reparation.entities.Equipment;
import com.reparation.reparation.persistence.IEquipmentDAO;
import com.reparation.reparation.repository.EquipmentRepository;

@Component
public class EquipmentDAOimpl implements IEquipmentDAO{
    
    @Autowired
    private EquipmentRepository equipmentRepository;
    @Override
    public List<Equipment> findAll() {
        return (List<Equipment>) equipmentRepository.findAll();
    }

    @Override
    public Optional<Equipment> findById(Long id_equip) {
        return equipmentRepository.findById(id_equip);
    }

    @Override
    public void save(Equipment equipment) {
        equipmentRepository.save(equipment);
    }

    @Override
    public void deleteById(Long id_equip) {
        equipmentRepository.deleteById(id_equip);
    }


}
