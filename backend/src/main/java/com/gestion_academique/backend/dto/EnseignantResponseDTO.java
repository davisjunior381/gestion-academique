package com.gestion_academique.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EnseignantResponseDTO {

    private Long codeUtilisateur;
    private String nom;
    private String prenom;
    private String email;
    private String grade;
    private String specialite;
    private String departement;
    private LocalDate dateCreation;
    private String roleNom;
}
