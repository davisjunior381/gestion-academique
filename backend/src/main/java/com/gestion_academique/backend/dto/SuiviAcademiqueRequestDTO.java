package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SuiviAcademiqueRequestDTO {

    @NotNull(message = "La moyenne est obligatoire")
    @DecimalMin(value = "0.0", message = "La moyenne doit être >= 0")
    @DecimalMax(value = "20.0", message = "La moyenne doit être <= 20")
    private Float moyenne;

    private String appreciation;

    @NotNull(message = "Le semestre est obligatoire")
    private String semestre;

    @NotNull(message = "L'id de l'apprenant est obligatoire")
    private Long apprenantId;
}
