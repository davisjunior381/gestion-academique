package com.gestion_academique.backend.dto;

import lombok.Data;

@Data
public class MoyenneResponseDTO {

    private Long apprenantId;
    private String apprenantNom;
    private String apprenantPrenom;
    private String semestre;
    private Float moyenneGenerale;
    private int nombreSuivis;
}
