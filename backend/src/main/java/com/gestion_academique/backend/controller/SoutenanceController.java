package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.SoutenanceRequestDTO;
import com.gestion_academique.backend.dto.SoutenanceResponseDTO;
import com.gestion_academique.backend.service.SoutenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soutenances")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SoutenanceController {

    private final SoutenanceService soutenanceService;

    @GetMapping
    public ResponseEntity<List<SoutenanceResponseDTO>> getAll() {
        return ResponseEntity.ok(soutenanceService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SoutenanceResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(soutenanceService.getById(id));
    }

    @GetMapping("/stage/{stageId}")
    public ResponseEntity<SoutenanceResponseDTO> getByStage(@PathVariable Long stageId) {
        return ResponseEntity.ok(soutenanceService.getByStage(stageId));
    }

    @PostMapping
    public ResponseEntity<SoutenanceResponseDTO> create(@Valid @RequestBody SoutenanceRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(soutenanceService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SoutenanceResponseDTO> update(@PathVariable Long id, @Valid @RequestBody SoutenanceRequestDTO dto) {
        return ResponseEntity.ok(soutenanceService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        soutenanceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
