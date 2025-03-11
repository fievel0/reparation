package com.reparation.reparation.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.reparation.reparation.entities.Employee;
import com.reparation.reparation.persistence.IEmployeeDAO;
import com.reparation.reparation.service.IEmployeeService;

@Service
public class EmployeeService implements IEmployeeService {

    
    @Autowired
    private IEmployeeDAO employeeDAO;

    @Override
    public List<Employee> findAll() {
        return employeeDAO.findAll();
    }

    @Override
    public Optional<Employee> findById(Long idEmployee) {
        return employeeDAO.findById(idEmployee);
    }

    @Override
    public ResponseEntity<?> save(Employee employee) {
        employeeDAO.save(employee);
        return ResponseEntity.ok().build();
    }

    @Override
    public void deleteById(Long idEmployee) {
        employeeDAO.deleteById(idEmployee);
    }
    

}
