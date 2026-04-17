package com.gestion_academique.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SoutenanceResponseDTO {

    private Long refSoutenance;
    private LocalDateTime date;
    private String salle;
    private Integer duree;
    private String statut;

    private Long stageId;
    private String stageTitre;

    private Long juryId;
    private String juryIntitule;
}
