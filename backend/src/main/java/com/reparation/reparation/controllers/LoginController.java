package com.reparation.reparation.controllers;

import com.reparation.reparation.controllers.dto.DtoJwtToken;
import com.reparation.reparation.controllers.dto.DtoUsersAuthenticate;
import com.reparation.reparation.entities.Users;
import com.reparation.reparation.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping
    public ResponseEntity userAuthenticate(@RequestBody @Valid DtoUsersAuthenticate dto) {
        try {
            Authentication authToken = new UsernamePasswordAuthenticationToken(dto.email(), dto.password());
            var userAuthenticated = authenticationManager.authenticate(authToken);
            var JwtToken = tokenService.generarToken((Users) userAuthenticated.getPrincipal());
            return ResponseEntity.ok(new DtoJwtToken(JwtToken, ((Users) userAuthenticated.getPrincipal()).getId()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }
    }
}
