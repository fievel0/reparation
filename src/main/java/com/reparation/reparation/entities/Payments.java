package com.reparation.reparation.entities;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "pagos")

public class Payments {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id_pay;
    
    @Column(name = "fecha_pago")
    private String date_pay;
    @Column(name = "abono")
    private BigDecimal money_pay;
    @Column(name = "saldo")
    private BigDecimal money_b_pay;

    @ManyToOne
    @JoinColumn(name="id_order", nullable=false)
    private Rep_order order;
}
