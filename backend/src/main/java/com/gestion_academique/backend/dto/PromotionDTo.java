package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PromotionDTo {
    private Long codePromotion;

    @NotNull(message = "L'année est obligatoire")
    private Integer annee;

    @NotBlank(message = "Le nom est obligatoire")
    private String nom;
}
