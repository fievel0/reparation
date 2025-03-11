package com.reparation.reparation.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Empleado")

public class Employee {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long idEmployee;
    @NotNull
    private String nameEmployee;
    @NotNull
    private String positionEmployee;
    @NotNull
    private String cedEmployee;
    @NotNull
    private String dirEmployee;
    @NotNull
    private String telEmpployee;

    @Builder.Default
    @OneToMany(mappedBy="employee", cascade=CascadeType.ALL, fetch=FetchType.LAZY)
    private List<Rep_order> orders = new ArrayList<>();
}
