package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RapportRequestDTO {

    @NotNull(message = "L'id du stage est obligatoire")
    private Long stageId;
}
