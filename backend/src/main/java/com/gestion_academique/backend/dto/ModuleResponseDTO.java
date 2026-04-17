package com.gestion_academique.backend.dto;

import lombok.Data;

@Data
public class ModuleResponseDTO {

    private Long codeModule;
    private String nom;
    private String description;
}
