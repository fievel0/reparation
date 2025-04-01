package com.reparation.reparation.controllers;

import com.reparation.reparation.controllers.dto.DtoResposeUsers;
import com.reparation.reparation.controllers.dto.DtoUserRegistry;
import com.reparation.reparation.service.UsersService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/login")
public class UserController {

    @Autowired
    private UsersService usersService;

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> usersRegistry(@RequestBody @Valid DtoUserRegistry dto) {
        var users = usersService.createUsers(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(users);
    }

    @GetMapping("/findAll")
    @Transactional(readOnly = true)
    public ResponseEntity<List<DtoResposeUsers>> findAllUsers() {
        List<DtoResposeUsers> usersList = usersService.findAllUsers();
        return ResponseEntity.ok(usersList);
    }

    // Nuevo endpoint para buscar usuario por id
    @GetMapping("/findd/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<DtoResposeUsers> findUserById(@PathVariable("id") Long id) {
        DtoResposeUsers user = usersService.findUserById(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(user);
    }

    // Nuevo endpoint para eliminar usuario por id
    @DeleteMapping("/deletee/{id}")
    @Transactional
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id) {
        boolean deleted = usersService.deleteUser(id);
        if (deleted) {
            return ResponseEntity.ok("Usuario eliminado exitosamente");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
    }
}
