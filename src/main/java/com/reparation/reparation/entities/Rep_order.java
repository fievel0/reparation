package com.reparation.reparation.entities;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
@Table(name = "Orden_reparacion")

public class Rep_order {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_order;

    @Column(name = "fecha_recepcion")
    private Date create_date;
    @Column(name = "fecha_entrega")
    private Date deadline;
    @Column(name = "total_pago")
    private BigDecimal tot_pay;
    @Column(name = "detalles_adicionales")
    private BigDecimal addit_details;
    //@Column(name = "foto")
    //private Object photo;

    @ManyToOne
    @JoinColumn(name="id_customers", nullable=false)
    private Customers customer;

    @ManyToOne
    @JoinColumn(name="id_equip", nullable=false)
    private Equipment equipment;

    @Builder.Default
    @OneToMany(mappedBy="order", cascade=CascadeType.ALL, fetch=FetchType.LAZY, orphanRemoval=true)
    @JsonIgnore
    private List<Payments> paymentsList = new ArrayList<>();
   
    private Payments payment;
}
