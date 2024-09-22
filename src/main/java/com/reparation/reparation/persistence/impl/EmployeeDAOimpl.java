package com.reparation.reparation.persistence.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.reparation.reparation.entities.Employee;
import com.reparation.reparation.persistence.IEmployeeDAO;
import com.reparation.reparation.repository.EmployeeRepository;


@Component
public class EmployeeDAOimpl implements IEmployeeDAO{
     @Autowired
    private EmployeeRepository employeeRepository;
    
    @Override
    public List<Employee> findAll() {
        return (List<Employee>) employeeRepository.findAll();
    }

    @Override
    public Optional<Employee> findById(Long idEmployee) {
        return employeeRepository.findById(idEmployee);
    }

    @Override
    public void save(Employee employee) {
        employeeRepository.save(employee);
    }

    @Override
    public void deleteById(Long idEmployee) {
        employeeRepository.deleteById(idEmployee);
    }

}
