package com.reparation.reparation.persistence;

import java.util.List;
import java.util.Optional;

import com.reparation.reparation.entities.Employee;

public interface IEmployeeDAO {
    List<Employee> findAll();

    Optional<Employee> findById(Long idEmployee);

    void save(Employee employee);

    void deleteById(Long idEmployee);


}
