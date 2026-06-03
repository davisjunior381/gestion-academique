package com.gestion_academique.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EvaluationDTO {

    @NotNull(message = "La note est obligatoire")
    @Min(value = 0, message = "La note doit être >= 0")
    @Max(value = 20, message = "La note doit être <= 20")
    private Float note;

    private String commentaire;

    /**
     * Optionnel et ignore par le controller : l'evaluateur est l'utilisateur
     * authentifie (UserDetailsImpl) cote serveur. Conserve pour compatibilite
     * avec les anciens clients et les tests unitaires qui appellent le service
     * directement.
     */
    private Long evaluateurId;
}
