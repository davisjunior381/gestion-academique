package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FiliereRequestDTO {

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    private String description;
}