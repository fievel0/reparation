package com.reparation.reparation.controllers;

import com.reparation.reparation.controllers.dto.DtoUserRegistry;
import com.reparation.reparation.service.UsersService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/register")
public class UserController {

    @Autowired
    private UsersService usersService;

    @PostMapping
    @Transactional
    public ResponseEntity<?> usersRegistry(@RequestBody @Valid DtoUserRegistry dto) {
        var users = usersService.createUsers(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(users);
    }
}