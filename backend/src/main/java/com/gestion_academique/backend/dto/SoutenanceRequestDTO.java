package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SoutenanceRequestDTO {

    @NotNull(message = "La date est obligatoire")
    private LocalDateTime date;

    private String salle;
    private Integer duree;

    @NotNull(message = "L'id du stage est obligatoire")
    private Long stageId;

    private Long juryId;
}
