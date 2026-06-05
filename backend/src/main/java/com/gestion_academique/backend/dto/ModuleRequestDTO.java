package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO de creation et de mise a jour d un module.
 */
@Data
public class ModuleRequestDTO {

    @NotBlank(message = "Le nom du module est obligatoire")
    @Size(max = 100, message = "Le nom du module ne peut pas depasser 100 caracteres")
    private String nom;

    @Size(max = 1000, message = "La description ne peut pas depasser 1000 caracteres")
    private String description;
}
