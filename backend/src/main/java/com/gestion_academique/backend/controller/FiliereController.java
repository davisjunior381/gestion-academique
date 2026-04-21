package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.FiliereRequestDTO;
import com.gestion_academique.backend.dto.FiliereResponseDTO;
import com.gestion_academique.backend.service.FiliereService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/filieres")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Filières", description = "Gestion des filières")
public class FiliereController {

    private final FiliereService filiereService;

    @GetMapping
    @Operation(summary = "Lister toutes les filières")
    public ResponseEntity<List<FiliereResponseDTO>> getAll() {
        return ResponseEntity.ok(filiereService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une filière par ID")
    public ResponseEntity<FiliereResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(filiereService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Créer une filière")
    public ResponseEntity<FiliereResponseDTO> create(@Valid @RequestBody FiliereRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(filiereService.create(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une filière")
    public ResponseEntity<FiliereResponseDTO> update(@PathVariable Long id, @Valid @RequestBody FiliereRequestDTO dto) {
        return ResponseEntity.ok(filiereService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une filière")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        filiereService.delete(id);
        return ResponseEntity.noContent().build();
    }
}