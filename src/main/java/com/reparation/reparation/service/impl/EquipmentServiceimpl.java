package com.reparation.reparation.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.reparation.reparation.entities.Equipment;
import com.reparation.reparation.persistence.IEquipmentDAO;
import com.reparation.reparation.service.IEquipmentService;

@Service
public class EquipmentServiceimpl implements IEquipmentService {

    @Autowired
    private IEquipmentDAO equipmentDAO;

    @Override
    public List<Equipment> findAll() {
        return equipmentDAO.findAll();
    }

    @Override
    public Optional<Equipment> findById(Long id_equip) {
        return equipmentDAO.findById(id_equip);
    }

    @Override
    public void save(Equipment equipment) {
        equipmentDAO.save(equipment);
    }

    @Override
    public void deleteById(Long id_equip) {
        equipmentDAO.deleteById(id_equip);
    }


}
