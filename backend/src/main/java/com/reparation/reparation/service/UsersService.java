package com.reparation.reparation.service;

import com.reparation.reparation.controllers.dto.DtoResposeUsers;
import com.reparation.reparation.controllers.dto.DtoUserRegistry;
import com.reparation.reparation.entities.Users;
import com.reparation.reparation.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired TokenService tokenService;

    public DtoResposeUsers createUsers(DtoUserRegistry dto) {
        if (usersRepository.findByEmail(dto.email()) != null ) {
            throw new RuntimeException(); // usar manejador de errores
        }

        Users users = new Users();
        users.setEmail(dto.email());
        users.setPassword(passwordEncoder.encode(dto.password()));
        usersRepository.save(users);
        var token = tokenService.generarToken(users);
        return new DtoResposeUsers(users.getId(),users.getEmail(),token);
    }
}
