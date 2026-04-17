package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StageRequestDTO {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    @NotNull(message = "La date de début est obligatoire")
    private LocalDate dateDebut;

    @NotNull(message = "La date de fin est obligatoire")
    private LocalDate dateFin;

    @NotNull(message = "La durée est obligatoire")
    private Integer duree;

    private String objectif;

    private Long apprenantId;
    private Long encadrantId;
    private Long entrepriseId;
}
