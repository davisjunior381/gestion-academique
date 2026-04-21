package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.ApprenantRequestDTO;
import com.gestion_academique.backend.dto.ApprenantResponseDTO;
import com.gestion_academique.backend.service.ApprenantService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apprenants")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ApprenantController {

    private final ApprenantService apprenantService;

    @GetMapping
    public ResponseEntity<List<ApprenantResponseDTO>> getAll() {
        return ResponseEntity.ok(apprenantService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApprenantResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(apprenantService.getById(id));
    }

    @GetMapping("/filiere/{filiereId}")
    public ResponseEntity<List<ApprenantResponseDTO>> getByFiliere(@PathVariable Long filiereId) {
        return ResponseEntity.ok(apprenantService.getByFiliere(filiereId));
    }

    @GetMapping("/promotion/{promotionId}")
    public ResponseEntity<List<ApprenantResponseDTO>> getByPromotion(@PathVariable Long promotionId) {
        return ResponseEntity.ok(apprenantService.getByPromotion(promotionId));
    }

    @PostMapping
    public ResponseEntity<ApprenantResponseDTO> create(@Valid @RequestBody ApprenantRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(apprenantService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApprenantResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ApprenantRequestDTO dto) {
        return ResponseEntity.ok(apprenantService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        apprenantService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // PUT /api/apprenants/{id}/filiere/{filiereId}
    @PutMapping("/{id}/filiere/{filiereId}")
    @Operation(summary = "Affecter un apprenant à une filière")
    public ResponseEntity<ApprenantResponseDTO> affecterFiliere(
            @PathVariable Long id,
            @PathVariable Long filiereId) {
        return ResponseEntity.ok(apprenantService.affecterFiliere(id, filiereId));
    }

    // DELETE /api/apprenants/{id}/filiere
    @DeleteMapping("/{id}/filiere")
    @Operation(summary = "Désaffecter un apprenant de sa filière")
    public ResponseEntity<ApprenantResponseDTO> desaffecterFiliere(@PathVariable Long id) {
        return ResponseEntity.ok(apprenantService.desaffecterFiliere(id));
    }

    // PUT /api/apprenants/{id}/promotion/{promotionId}
    @PutMapping("/{id}/promotion/{promotionId}")
    @Operation(summary = "Affecter un apprenant à une promotion")
    public ResponseEntity<ApprenantResponseDTO> affecterPromotion(
            @PathVariable Long id,
            @PathVariable Long promotionId) {
        return ResponseEntity.ok(apprenantService.affecterPromotion(id, promotionId));
    }




}
