package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ApprenantRequestDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    private String prenom;

    @Email(message = "L'email doit être valide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    private String motDePasse;

    @NotBlank(message = "Le numéro étudiant est obligatoire")
    @Pattern(regexp = "^ETU\\d{3,}$", message = "Format attendu : ETU suivi de 3 chiffres ou plus")
    private String numEtudiant;

    private Long filiereId;
    private Long promotionId;
    private Long roleId;
}
