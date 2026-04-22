package com.gestion_academique.backend.dto;

import lombok.Data;

@Data
public class EntrepriseResponseDTO {

    private Long siretEntreprise;
    private String nom;
    private String secteur;
    private String adresse;
    private String emailContact;
}
