package com.reparation.reparation.controllers.dto;

import java.util.ArrayList;
import java.util.List;

import com.reparation.reparation.entities.Rep_order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EquipmentDTO {
    private Long id_equip;

    private String model_equip;

    private String brand_equip;

    private String color_equip;

    private String state_equip;

    private String pass_equip;

    private String anti_equip;

    private String accessor_equip;

    private String reported_equip;

    private String detail_phy_equip;

    private String temp_equip;

    private boolean on_off_equip;

    private String cau_dam_equip;
    @Builder.Default
    private List<Rep_order> rep_order_equipList = new ArrayList<>();

}
