package com.reparation.reparation.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "equipo")
public class Equipment {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_equip;
    @Column(name = "modelo")
    @NotNull
    private String model_equip;
    
    @Column(name = "marca")
    @NotNull
    private String brand_equip;
    @Column(name = "color")
    @NotNull
    private String color_equip;
    @Column(name = "estado_equipo")
    @NotNull
    private String state_equip;
    @Column(name = "clave_equipo")
    private String pass_equip;
    @Column(name = "antiguedad")
    private String anti_equip;
    //En este campo se ingresan detalles como Bandejas, Chip-memoria, Batería-carcasa, Cargador o cables.
    //******************************************************************************************** */
    @Column(name = "accesorios")
    private String accessor_equip;
    //******************************************************************************************** */

    @Column(name = "reporte")
    @NotNull
    private String reported_equip;
    @Column(name = "detalles_fisicos")
    private String detail_phy_equip;

    @Column(name = "calienta")
    private String temp_equip;
    @Column(name = "encendido_apagado")
    private boolean on_off_equip;
    @Column(name = "causa_de_daño")
    private String cau_dam_equip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_customer")
    private Customers customer;

    @Builder.Default
    @OneToMany(mappedBy="equipment", cascade=CascadeType.ALL, fetch=FetchType.LAZY, orphanRemoval=true)
    private List<Rep_order> rep_order_equipList = new ArrayList<>();

}
