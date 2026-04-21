package com.gestion_academique.backend.dto;

import lombok.Data;

@Data
public class PromotionResponseDTO {

    private Long codePromotion;
    private Integer annee;
    private String nom;
}