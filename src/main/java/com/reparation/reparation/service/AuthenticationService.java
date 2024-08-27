package com.reparation.reparation.service;

import com.reparation.reparation.entities.Users;
import com.reparation.reparation.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService implements UserDetailsService {
    @Autowired
    private UsersRepository usersRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var userMail = usersRepository.findByEmail(username);
        if (userMail != null) {
            return userMail;
        }
        throw new UsernameNotFoundException("Usuario no encontrado");
    }
}
