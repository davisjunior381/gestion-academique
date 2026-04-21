package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PromotionRequestDTO {

    @NotNull(message = "L'année est obligatoire")
    private Integer annee;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
}