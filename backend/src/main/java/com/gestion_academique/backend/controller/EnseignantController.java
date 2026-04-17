package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.EnseignantRequestDTO;
import com.gestion_academique.backend.dto.EnseignantResponseDTO;
import com.gestion_academique.backend.dto.ModuleResponseDTO;
import com.gestion_academique.backend.service.EnseignantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enseignants")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EnseignantController {

    private final EnseignantService enseignantService;

    @GetMapping
    public ResponseEntity<List<EnseignantResponseDTO>> getAll() {
        return ResponseEntity.ok(enseignantService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnseignantResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(enseignantService.getById(id));
    }

    @GetMapping("/specialite/{specialite}")
    public ResponseEntity<List<EnseignantResponseDTO>> getBySpecialite(@PathVariable String specialite) {
        return ResponseEntity.ok(enseignantService.getBySpecialite(specialite));
    }

    @GetMapping("/grade/{grade}")
    public ResponseEntity<List<EnseignantResponseDTO>> getByGrade(@PathVariable String grade) {
        return ResponseEntity.ok(enseignantService.getByGrade(grade));
    }

    @PostMapping
    public ResponseEntity<EnseignantResponseDTO> create(@Valid @RequestBody EnseignantRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(enseignantService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnseignantResponseDTO> update(@PathVariable Long id, @Valid @RequestBody EnseignantRequestDTO dto) {
        return ResponseEntity.ok(enseignantService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        enseignantService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/modules")
    public ResponseEntity<List<ModuleResponseDTO>> getModules(@PathVariable Long id) {
        return ResponseEntity.ok(enseignantService.getModules(id));
    }

    @PostMapping("/{id}/modules/{moduleId}")
    public ResponseEntity<EnseignantResponseDTO> affecterModule(@PathVariable Long id, @PathVariable Long moduleId) {
        return ResponseEntity.ok(enseignantService.affecterModule(id, moduleId));
    }

    @DeleteMapping("/{id}/modules/{moduleId}")
    public ResponseEntity<EnseignantResponseDTO> retirerModule(@PathVariable Long id, @PathVariable Long moduleId) {
        return ResponseEntity.ok(enseignantService.retirerModule(id, moduleId));
    }
}
