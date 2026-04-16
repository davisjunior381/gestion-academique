package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.StageRequestDTO;
import com.gestion_academique.backend.dto.StageResponseDTO;
import com.gestion_academique.backend.enums.StatutStage;
import com.gestion_academique.backend.service.StageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stages")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class StageController {

    private final StageService stageService;

    @GetMapping
    public ResponseEntity<List<StageResponseDTO>> getAll() {
        return ResponseEntity.ok(stageService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StageResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(stageService.getById(id));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<StageResponseDTO>> getByStatut(@PathVariable StatutStage statut) {
        return ResponseEntity.ok(stageService.getByStatut(statut));
    }

    @GetMapping("/apprenant/{apprenantId}")
    public ResponseEntity<List<StageResponseDTO>> getByApprenant(@PathVariable Long apprenantId) {
        return ResponseEntity.ok(stageService.getByApprenant(apprenantId));
    }

    @GetMapping("/encadrant/{encadrantId}")
    public ResponseEntity<List<StageResponseDTO>> getByEncadrant(@PathVariable Long encadrantId) {
        return ResponseEntity.ok(stageService.getByEncadrant(encadrantId));
    }

    @PostMapping
    public ResponseEntity<StageResponseDTO> create(@Valid @RequestBody StageRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(stageService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StageResponseDTO> update(@PathVariable Long id, @Valid @RequestBody StageRequestDTO dto) {
        return ResponseEntity.ok(stageService.update(id, dto));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<StageResponseDTO> updateStatut(@PathVariable Long id, @RequestParam StatutStage statut) {
        return ResponseEntity.ok(stageService.updateStatut(id, statut));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        stageService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
