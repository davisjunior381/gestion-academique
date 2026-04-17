package com.gestion_academique.backend.dto;

import com.gestion_academique.backend.enums.StatutRapport;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RapportResponseDTO {

    private Long refRapport;
    private String fichierPdf;
    private LocalDate dateDepot;
    private Float note;
    private String commentaire;
    private StatutRapport statut;

    private Long stageId;
    private String stageTitre;

    private String evaluateurNom;
    private String evaluateurPrenom;
    private Long evaluateurId;
}
