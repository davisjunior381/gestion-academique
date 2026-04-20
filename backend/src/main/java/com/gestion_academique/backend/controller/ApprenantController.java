package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.service.ApprenantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/apprenants")
@RequiredArgsConstructor
@Tag(name = "Apprenants")
public class ApprenantController {

    private final ApprenantService apprenantService;

    @Operation(summary = "Affecter un apprenant à une filière")
    @PutMapping("/{id}/filiere/{filiereId}")
    public ResponseEntity<Apprenant> affecterFiliere(
            @PathVariable Long id,
            @PathVariable Long filiereId) {
        return ResponseEntity.ok(apprenantService.affecterFiliere(id, filiereId));
    }

    @Operation(summary = "Affecter un apprenant à une promotion")
    @PutMapping("/{id}/promotion/{promotionId}")
    public ResponseEntity<Apprenant> affecterPromotion(
            @PathVariable Long id,
            @PathVariable Long promotionId) {
        return ResponseEntity.ok(apprenantService.affecterPromotion(id, promotionId));
    }

    @Operation(summary = "Désaffecter un apprenant de sa filière")
    @DeleteMapping("/{id}/filiere")
    public ResponseEntity<Apprenant> desaffecterFiliere(@PathVariable Long id) {
        return ResponseEntity.ok(apprenantService.desaffecterFiliere(id));
    }
}