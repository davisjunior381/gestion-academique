package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EntrepriseRequestDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String secteur;
    private String adresse;

    @Email(message = "L'email doit être valide")
    private String emailContact;
}
