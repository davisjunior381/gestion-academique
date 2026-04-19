package com.gestion_academique.backend.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequestDTO {

    @Email
    @NotBlank(message = "Email est requis")
    private String email;

    @NotBlank(message = "Mot de passe est requis")
    private String motDePasse;
}