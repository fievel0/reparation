package com.reparation.reparation.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.hibernate.Hibernate;
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

import com.reparation.reparation.controllers.dto.CustomerDTO;
import com.reparation.reparation.controllers.dto.EmployeeDTO;
import com.reparation.reparation.controllers.dto.EquipmentDTO;
import com.reparation.reparation.controllers.dto.PaymentsDTO;
import com.reparation.reparation.controllers.dto.Rep_orderDTO;
import com.reparation.reparation.entities.Customers;
import com.reparation.reparation.entities.Employee;
import com.reparation.reparation.entities.Equipment;
import com.reparation.reparation.entities.Rep_order;
import com.reparation.reparation.service.ICustomersService;
import com.reparation.reparation.service.IEmployeeService;
import com.reparation.reparation.service.IEquipmentService;
import com.reparation.reparation.service.IRep_orderService;

@RestController
@RequestMapping("/api/ord_rep")
public class Rep_orderController {

    @Autowired
    private IRep_orderService rep_orderService;

    @Autowired
    private ICustomersService customerService;  // Servicio para manejar clientes

    @Autowired
    private IEquipmentService equipmentService;  // Servicio para manejar equipos

    @Autowired
    private IEmployeeService employeeService; // Servicio para manejar empleados

    @GetMapping("/find/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id){
        Optional<Rep_order> rep_orderOptional = rep_orderService.findById(id);

        if (rep_orderOptional.isPresent()){
            Rep_order rep_order = rep_orderOptional.get();
            Rep_orderDTO rep_orderDTO = Rep_orderDTO.builder()
                .id_order(rep_order.getId_order())
                .create_date(rep_order.getCreate_date())
                .deadline(rep_order.getDeadline())
                .tot_pay(rep_order.getTot_pay())
                .addit_details(rep_order.getAddit_details())

                .customer(CustomerDTO.builder()
                    .name(rep_order.getCustomer().getName())
                    .card_identifi(rep_order.getCustomer().getCard_identifi())
                    .phone(rep_order.getCustomer().getPhone())
                    .mail(rep_order.getCustomer().getMail())
                .build())

                .equipment(EquipmentDTO.builder()
                    .model_equip(rep_order.getEquipment().getModel_equip())
                    .brand_equip(rep_order.getEquipment().getBrand_equip())
                    .color_equip(rep_order.getEquipment().getColor_equip())
                    .state_equip(rep_order.getEquipment().getState_equip())
                    .pass_equip(rep_order.getEquipment().getPass_equip())
                    .anti_equip(rep_order.getEquipment().getAnti_equip())
                    .accessor_equip(rep_order.getEquipment().getAccessor_equip())
                    .reported_equip(rep_order.getEquipment().getReported_equip())
                    .detail_phy_equip(rep_order.getEquipment().getDetail_phy_equip())
                    .temp_equip(rep_order.getEquipment().getTemp_equip())
                    .on_off_equip(rep_order.getEquipment().isOn_off_equip())
                    .cau_dam_equip(rep_order.getEquipment().getCau_dam_equip())
                .build())
                
                .payments(rep_order.getPaymentsList().stream()
                    .map(payment -> PaymentsDTO.builder()
                        .id_pay(payment.getId_pay())
                        .date_pay(payment.getDate_pay())
                        .money_pay(payment.getMoney_pay())
                        .money_b_pay(payment.getMoney_b_pay())
                    .build())
                .collect(Collectors.toList()))

                .employee(EmployeeDTO.builder()
                .nameEmployee(rep_order.getEmployee().getNameEmployee())
                .build())

                .build();
            return ResponseEntity.ok(rep_orderDTO);
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/findAll")
    public ResponseEntity<?> findAll(){
        List<Rep_orderDTO> rep_orderList = rep_orderService.findAll()
            .stream()
            .map(rep_order -> {
                // Inicializa la lista de pagos
                Hibernate.initialize(rep_order.getPaymentsList());

                return Rep_orderDTO.builder()
                    .id_order(rep_order.getId_order())
                    .create_date(rep_order.getCreate_date())
    

                    .customer(CustomerDTO.builder()
                        .id_customer(rep_order.getCustomer().getId_customer())
                        .name(rep_order.getCustomer().getName())
                    .build())

                    .equipment(EquipmentDTO.builder()
                        .id_equip(rep_order.getEquipment().getId_equip())
                        .model_equip(rep_order.getEquipment().getModel_equip())
                    .build())

                    .payments(rep_order.getPaymentsList().stream()
                        .map(payment -> PaymentsDTO.builder()
                            .date_pay(payment.getDate_pay())
                        .build())
                        .collect(Collectors.toList()))
                    
                        .employee(EmployeeDTO.builder()
                        .idEmployee(rep_order.getEmployee().getIdEmployee())
                        .nameEmployee(rep_order.getEmployee().getNameEmployee())
                        .build())
                    
                    .build();

            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(rep_orderList);
    }
    

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Rep_orderDTO orderDTO) throws URISyntaxException{
        if (orderDTO.getCreate_date() == null) {
            return ResponseEntity.badRequest().body("La fecha de recepción es obligatoria");
        }

        // Verifica si el cliente con el id proporcionado existe
        Optional<Customers> optionalCustomer = customerService.findById(orderDTO.getCustomer().getId_customer());
        if (!optionalCustomer.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cliente no existe, por favor verifique su ID");
        }
        Customers customer = optionalCustomer.get();

        // Verifica si el equipo con el id proporcionado existe
        Optional<Equipment> optionalEquipment = equipmentService.findById(orderDTO.getEquipment().getId_equip());
       
        if (!optionalEquipment.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Equipo no existe, por favor verifique su ID");
        }
        Equipment equipment = optionalEquipment.get();

        Optional<Employee> optionalEmployee = employeeService.findById(orderDTO.getEmployee().getIdEmployee());
        if(!optionalEmployee.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El empleado ingresado no existe");
        }

        Employee employee = optionalEmployee.get();

        // Construye el objeto Rep_order utilizando el builder
        Rep_order repOrder = Rep_order.builder()
            .create_date(orderDTO.getCreate_date())
            .deadline(orderDTO.getDeadline())
            .tot_pay(orderDTO.getTot_pay())
            .addit_details(orderDTO.getAddit_details())
            .customer(customer)
            .equipment(equipment)
            .employee(employee)
            
        .build();

        rep_orderService.save(repOrder);

        return ResponseEntity.created(new URI("/api/order_rep/save")).build();
    }

    
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateRep_order(@PathVariable Long id, @RequestBody Rep_orderDTO rep_orderDTO){
        try {
            Optional<Rep_order> repOrderOptional = rep_orderService.findById(id);

        if(repOrderOptional.isPresent()){

            Rep_order rep_order = repOrderOptional.get();


            rep_order.setCreate_date(rep_order.getCreate_date());
            rep_order.setDeadline(rep_orderDTO.getDeadline());
            rep_order.setTot_pay(rep_orderDTO.getTot_pay());
            rep_order.setAddit_details(rep_orderDTO.getAddit_details());
            
           // Actualiza el cliente asociado
        Optional<Customers> customerOptional = customerService.findById(rep_orderDTO.getCustomer().getId_customer());
        if (customerOptional.isPresent()) {
            Customers customer = customerOptional.get();
            rep_order.setCustomer(customer);
        } else {
            return ResponseEntity.badRequest().body("Cliente no existe");
        }

            // Actualiza el equipo asociado
            Optional<Equipment> equipmentOptional = equipmentService.findById(rep_orderDTO.getEquipment().getId_equip());
            if (equipmentOptional.isPresent()) {
                Equipment equipment = equipmentOptional.get();
                rep_order.setEquipment(equipment);
            } else {
                return ResponseEntity.badRequest().body("El Id del equipo no existe");
            }

            //Actualiza el Empleado asociado
            Optional<Employee> employeeOptional = employeeService.findById(rep_orderDTO.getEmployee().getIdEmployee());
            if(employeeOptional.isPresent()){
                Employee employee = employeeOptional.get();
                rep_order.setEmployee(employee);
            } else {
                return ResponseEntity.badRequest().body("El Id del empleado no existe");
            }
        // Guarda el objeto actualizado
        rep_orderService.save(rep_order);
            return ResponseEntity.ok("Registro Actualizado");
            } else {
                return ResponseEntity.notFound().build();
            }
    } catch(Exception e){
        e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error en el servidor: " + e.getMessage());
    }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Long id){

        if(id != null){
            rep_orderService.deleteById(id);
            return ResponseEntity.ok("Registro Eliminado");
        }

        return ResponseEntity.badRequest().build();
    }

}