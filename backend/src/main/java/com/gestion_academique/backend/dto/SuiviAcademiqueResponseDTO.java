package com.gestion_academique.backend.dto;

import lombok.Data;

@Data
public class SuiviAcademiqueResponseDTO {

    private Long codeSuivi;
    private Float moyenne;
    private String appreciation;
    private String semestre;
    private Long apprenantId;
    private String apprenantNom;
    private String apprenantPrenom;
}
