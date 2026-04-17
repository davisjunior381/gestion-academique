package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

    @Email
    @NotBlank(message = "Email est requis")
    private String email;

    @NotBlank(message = "Mot de passe est requis")
    private String motDePasse;
}