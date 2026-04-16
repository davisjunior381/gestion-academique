package com.gestion_academique.backend.dto;

import com.gestion_academique.backend.enums.StatutStage;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StageResponseDTO {

    private Long refStage;
    private String titre;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Integer duree;
    private String objectif;
    private StatutStage statut;

    private String apprenantNom;
    private String apprenantPrenom;
    private Long apprenantId;

    private String encadrantNom;
    private String encadrantPrenom;
    private Long encadrantId;

    private String entrepriseNom;
    private Long entrepriseId;
}
