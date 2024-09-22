package com.reparation.reparation.controllers;

import  java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reparation.reparation.controllers.dto.EmployeeDTO;
import com.reparation.reparation.entities.Employee;
import com.reparation.reparation.service.IEmployeeService;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    @Autowired
    private IEmployeeService employeeService;
    @GetMapping("/find/{id}")
    
    public ResponseEntity<?> findById(@PathVariable Long id){
        Optional<Employee> employeeOptional = employeeService.findById(id);

        if (employeeOptional.isPresent()){
            Employee employee = employeeOptional.get();

            EmployeeDTO employeeDTO = EmployeeDTO.builder()
                .idEmployee(employee.getIdEmployee())
                .nameEmployee(employee.getNameEmployee())
                .positionEmployee(employee.getPositionEmployee())
                .orders(employee.getOrders())
                .build();

            return ResponseEntity.ok(employeeDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Empleado no existe");
        }
}
}