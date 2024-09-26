package com.reparation.reparation.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.reparation.reparation.entities.Employee;

@Repository
public interface EmployeeRepository extends CrudRepository <Employee, Long>{

}
