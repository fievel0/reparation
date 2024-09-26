package com.reparation.reparation.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

import com.reparation.reparation.entities.Employee;

public interface IEmployeeService {
    List<Employee> findAll();

    Optional<Employee> findById(Long idEmploye);

    ResponseEntity<?> save(Employee employee);

    void deleteById(Long idEmployee);
}
