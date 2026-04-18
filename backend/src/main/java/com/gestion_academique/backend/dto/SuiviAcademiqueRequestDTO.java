package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SuiviAcademiqueRequestDTO {

    @NotNull(message = "La moyenne est obligatoire")
    private Float moyenne;

    private String appreciation;

    @NotNull(message = "Le semestre est obligatoire")
    private String semestre;

    @NotNull(message = "L'id de l'apprenant est obligatoire")
    private Long apprenantId;
}
