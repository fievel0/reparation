package com.reparation.reparation.controllers.dto;

import com.reparation.reparation.entities.Users;

public record DtoResposeUsers(
        Long id,
        String email,
        String token) {

}
