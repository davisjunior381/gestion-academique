package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.PromotionRequestDTO;
import com.gestion_academique.backend.dto.PromotionResponseDTO;
import com.gestion_academique.backend.service.PromotionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Promotions", description = "Gestion des promotions")
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping
    @Operation(summary = "Lister toutes les promotions")
    public ResponseEntity<List<PromotionResponseDTO>> getAll() {
        return ResponseEntity.ok(promotionService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une promotion par ID")
    public ResponseEntity<PromotionResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(promotionService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Créer une promotion")
    public ResponseEntity<PromotionResponseDTO> create(@Valid @RequestBody PromotionRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(promotionService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une promotion")
    public ResponseEntity<PromotionResponseDTO> update(@PathVariable Long id, @Valid @RequestBody PromotionRequestDTO dto) {
        return ResponseEntity.ok(promotionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une promotion")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        promotionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}