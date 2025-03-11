package com.reparation.reparation.controllers.dto;

import jakarta.validation.constraints.NotBlank;

public record DtoUsersAuthenticate(
        @NotBlank
        String email,
        @NotBlank
        String password) {
}
