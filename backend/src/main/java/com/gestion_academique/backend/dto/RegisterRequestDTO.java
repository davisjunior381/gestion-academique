package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDTO {

    @NotBlank(message = "Nom est requis")
    @Size(min = 2, max = 100)
    private String nom;

    @NotBlank(message = "Prénom est requis")
    @Size(min = 2, max = 100)
    private String prenom;

    @Email
    @NotBlank(message = "Email est requis")
    private String email;

    @NotBlank(message = "Mot de passe est requis")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String motDePasse;

    @NotBlank(message = "Rôle est requis")
    private String roleNom;
}