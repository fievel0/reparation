package com.reparation.reparation.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.reparation.reparation.entities.Equipment;

@Repository
public interface EquipmentRepository extends CrudRepository<Equipment, Long>{

}
