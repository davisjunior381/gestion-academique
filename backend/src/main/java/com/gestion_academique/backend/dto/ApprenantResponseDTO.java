package com.gestion_academique.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ApprenantResponseDTO {

    private Long codeUtilisateur;
    private String nom;
    private String prenom;
    private String email;
    private String numEtudiant;
    private LocalDate dateInscription;
    private LocalDate dateCreation;
    private String filiereNom;
    private Long filiereId;
    private String promotionNom;
    private Long promotionId;
    private String roleNom;
}
