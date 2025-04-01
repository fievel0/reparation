package com.reparation.reparation.service;

import com.reparation.reparation.controllers.dto.DtoResposeUsers;
import com.reparation.reparation.controllers.dto.DtoUserRegistry;
import com.reparation.reparation.entities.Users;
import com.reparation.reparation.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    public DtoResposeUsers createUsers(DtoUserRegistry dto) {
        if (usersRepository.findByEmail(dto.email()) != null) {
            throw new RuntimeException(); // usar manejador de errores apropiado
        }

        Users users = new Users();
        users.setEmail(dto.email());
        users.setPassword(passwordEncoder.encode(dto.password()));
        usersRepository.save(users);
        var token = tokenService.generarToken(users);
        return new DtoResposeUsers(users.getId(), users.getEmail(), token);
    }

    public List<DtoResposeUsers> findAllUsers() {
        return usersRepository.findAll()
                .stream()
                .map(user -> new DtoResposeUsers(user.getId(), user.getEmail(), null))
                .collect(Collectors.toList());
    }

    // Método para buscar usuario por id
    public DtoResposeUsers findUserById(Long id) {
        Optional<Users> userOptional = usersRepository.findById(id);
        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            return new DtoResposeUsers(user.getId(), user.getEmail(), null);
        }
        return null;
    }

    // Método para eliminar usuario por id
    public boolean deleteUser(Long id) {
        if (usersRepository.existsById(id)) {
            usersRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
