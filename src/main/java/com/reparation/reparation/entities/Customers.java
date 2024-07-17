package com.reparation.reparation.entities;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "clientes")
public class Customers {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_customer;
    @Column(name = "nombre")
    private String name;
    @Column(name = "cedula")
    private String card_identifi;
    @Column(name = "telefono")
    private String phone;
  //  @Column(name = "firma")
   // private Object signature;
    @Column(name = "correo")
    private String mail;

    
    @Builder.Default
    @OneToMany(mappedBy="customer", cascade=CascadeType.REMOVE, fetch=FetchType.LAZY, orphanRemoval=true)
    @JsonIgnore
    private List<Rep_order> rep_orderList = new ArrayList<>();

}
