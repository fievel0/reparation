package com.reparation.reparation.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reparation.reparation.controllers.dto.EquipmentDTO;
import com.reparation.reparation.entities.Equipment;
import com.reparation.reparation.service.IEquipmentService;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private IEquipmentService equipmentService;
    
    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id){

        Optional<Equipment> equipmentOptional = equipmentService.findById(id);

         if (equipmentOptional.isPresent()){
            Equipment equipment = equipmentOptional.get();

            EquipmentDTO equipmentDTO = EquipmentDTO.builder()
                .id_equip(equipment.getId_equip())
                .model_equip(equipment.getModel_equip())
                .brand_equip(equipment.getBrand_equip())
                .color_equip(equipment.getColor_equip())
                .state_equip(equipment.getState_equip())
                .pass_equip(equipment.getPass_equip())
                .anti_equip(equipment.getAnti_equip())
                .accessor_equip(equipment.getAccessor_equip())
                .reported_equip(equipment.getReported_equip())
                .detail_phy_equip(equipment.getDetail_phy_equip())
                .temp_equip(equipment.getTemp_equip())
                .on_off_equip(equipment.isOn_off_equip())
                .cau_dam_equip(equipment.getCau_dam_equip())
                .build();
            return ResponseEntity.ok(equipmentDTO);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAll(){
        List<EquipmentDTO> equipmentList = equipmentService.findAll()
            .stream()
            .map(equipment -> EquipmentDTO.builder()
                .id_equip(equipment.getId_equip())
                .model_equip(equipment.getModel_equip())
                .brand_equip(equipment.getBrand_equip())
                .color_equip(equipment.getColor_equip())
                .state_equip(equipment.getState_equip())
                .pass_equip(equipment.getPass_equip())
                .anti_equip(equipment.getAnti_equip())
                .accessor_equip(equipment.getAccessor_equip())
                .reported_equip(equipment.getReported_equip())
                .detail_phy_equip(equipment.getDetail_phy_equip())
                .temp_equip(equipment.getTemp_equip())
                .on_off_equip(equipment.isOn_off_equip())
                .cau_dam_equip(equipment.getCau_dam_equip())
                .build())
            .toList();
        return ResponseEntity.ok(equipmentList);
    }


    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody EquipmentDTO equipmentDTO) throws URISyntaxException{

        if(equipmentDTO.getModel_equip().isBlank()){

            return ResponseEntity.badRequest().build();
        }

        equipmentService.save(Equipment.builder()
            .model_equip(equipmentDTO.getModel_equip())
            .brand_equip(equipmentDTO.getBrand_equip())
            .color_equip(equipmentDTO.getColor_equip())
            .state_equip(equipmentDTO.getState_equip())
            .pass_equip(equipmentDTO.getPass_equip())
            .anti_equip(equipmentDTO.getAnti_equip())
            .accessor_equip(equipmentDTO.getAccessor_equip())
            .reported_equip(equipmentDTO.getReported_equip())
            .detail_phy_equip(equipmentDTO.getDetail_phy_equip())
            .temp_equip(equipmentDTO.getTemp_equip())
            .on_off_equip(equipmentDTO.isOn_off_equip())
            .cau_dam_equip(equipmentDTO.getCau_dam_equip())
        .build());

        return ResponseEntity.created(new URI("/api/equipment/save")).build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEquipment(@PathVariable Long id, @RequestBody EquipmentDTO equipmentDTO){
        Optional<Equipment> equipmentOptional = equipmentService.findById(id);

        if(equipmentOptional.isPresent()){

            Equipment equipment = equipmentOptional.get();
            equipment.setModel_equip(equipmentDTO.getModel_equip());
            equipment.setBrand_equip(equipmentDTO.getBrand_equip());
            equipment.setColor_equip(equipmentDTO.getColor_equip());
            equipment.setState_equip(equipmentDTO.getState_equip());
            equipment.setPass_equip(equipmentDTO.getPass_equip());
            equipment.setAnti_equip(equipmentDTO.getAnti_equip());
            equipment.setAccessor_equip(equipmentDTO.getAccessor_equip());
            equipment.setReported_equip(equipmentDTO.getReported_equip());
            equipment.setDetail_phy_equip(equipmentDTO.getDetail_phy_equip());
            equipment.setTemp_equip(equipmentDTO.getTemp_equip());
            equipment.setOn_off_equip(equipmentDTO.isOn_off_equip());
            equipment.setCau_dam_equip(equipmentDTO.getCau_dam_equip());
            equipmentService.save(equipment);
            return ResponseEntity.ok("Registro Actualizado");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id){

        if(id != null){
            equipmentService.deleteById(id);
            return ResponseEntity.ok("Registro Eliminado");
        }

        return ResponseEntity.badRequest().build();
    }
}
