package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.ModuleRequestDTO;
import com.gestion_academique.backend.dto.ModuleResponseDTO;
import com.gestion_academique.backend.service.ModuleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints REST pour la gestion des modules pedagogiques.
 * Les ecritures sont reservees a l administrateur ; la lecture est ouverte aux
 * utilisateurs authentifies (notamment pour le front qui peuple les selects).
 */
@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    @GetMapping
    public ResponseEntity<List<ModuleResponseDTO>> getAll() {
        return ResponseEntity.ok(moduleService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ModuleResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(moduleService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ModuleResponseDTO> create(@Valid @RequestBody ModuleRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(moduleService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ModuleResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ModuleRequestDTO dto) {
        return ResponseEntity.ok(moduleService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        moduleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
