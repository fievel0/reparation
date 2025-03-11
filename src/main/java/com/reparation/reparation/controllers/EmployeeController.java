package com.reparation.reparation.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.reparation.reparation.controllers.dto.EmployeeDTO;
import com.reparation.reparation.controllers.dto.Rep_orderDTO;
import com.reparation.reparation.entities.Employee;
import com.reparation.reparation.service.IEmployeeService;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    @Autowired
    private IEmployeeService employeeService;

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Employee> employeeOptional = employeeService.findById(id);

        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();

            EmployeeDTO employeeDTO = EmployeeDTO.builder()
                .idEmployee(employee.getIdEmployee())
                .nameEmployee(employee.getNameEmployee())
                .positionEmployee(employee.getPositionEmployee())
                .cedEmployee(employee.getCedEmployee())
                .dirEmployee(employee.getDirEmployee())
                .telEmpployee(employee.getTelEmpployee())
                .orders(employee.getOrders().stream()
                    .map(order -> Rep_orderDTO.builder()
                        .id_order(order.getId_order())
                        .create_date(order.getCreate_date())
                        .deadline(order.getDeadline())
                        .build())
                    .collect(Collectors.toList()))
                .build();
            
            return ResponseEntity.ok(employeeDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Empleado no existe");
        }
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAll(){
        List<EmployeeDTO> employeeList = employeeService.findAll()
        .stream()
        .map(employee -> EmployeeDTO.builder()
            .idEmployee(employee.getIdEmployee())
            .nameEmployee(employee.getNameEmployee())
            .positionEmployee(employee.getPositionEmployee())
            .cedEmployee(employee.getCedEmployee())
            .dirEmployee(employee.getDirEmployee())
            .telEmpployee(employee.getTelEmpployee())
            .orders(employee.getOrders().stream()
                .map(order -> Rep_orderDTO.builder()
                    .id_order(order.getId_order())
                    .create_date(order.getCreate_date())
                    .deadline(order.getDeadline())
                    .build())
                .collect(Collectors.toList()))
            .build())
        .collect(Collectors.toList());
        return ResponseEntity.ok(employeeList);
    }


    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody EmployeeDTO employeeDTO) throws URISyntaxException{

        if(employeeDTO.getNameEmployee().isEmpty()){

            return ResponseEntity.badRequest().build();
        }

        employeeService.save(Employee.builder()
        .nameEmployee(employeeDTO.getNameEmployee())
        .positionEmployee(employeeDTO.getPositionEmployee())
        .cedEmployee(employeeDTO.getCedEmployee())
        .dirEmployee(employeeDTO.getDirEmployee())
        .telEmpployee(employeeDTO.getTelEmpployee())
        .build());

        return ResponseEntity.created(new URI("/api/employee/save")).build();
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody EmployeeDTO employeeDTO){
        Optional<Employee> employeeOptional = employeeService.findById(id);

        if(employeeOptional.isPresent()){

            Employee employee = employeeOptional.get();
            employee.setNameEmployee(employeeDTO.getNameEmployee());
            employee.setPositionEmployee(employeeDTO.getPositionEmployee());
            employee.setCedEmployee(employeeDTO.getCedEmployee());
            employee.setDirEmployee(employeeDTO.getDirEmployee());
            employee.setTelEmpployee(employeeDTO.getTelEmpployee());
            employeeService.save(employee);
            return ResponseEntity.ok("Registro Actualizado");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id){

        if(id != null){
            employeeService.deleteById(id);
            return ResponseEntity.ok("Registro Eliminado");
        }

        return ResponseEntity.badRequest().build();
    }


}

