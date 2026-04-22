package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.EntrepriseRequestDTO;
import com.gestion_academique.backend.dto.EntrepriseResponseDTO;
import com.gestion_academique.backend.service.EntrepriseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entreprises")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EntrepriseController {

    private final EntrepriseService entrepriseService;

    @GetMapping
    public ResponseEntity<List<EntrepriseResponseDTO>> getAll() {
        return ResponseEntity.ok(entrepriseService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntrepriseResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(entrepriseService.getById(id));
    }

    @PostMapping
    public ResponseEntity<EntrepriseResponseDTO> create(@Valid @RequestBody EntrepriseRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(entrepriseService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntrepriseResponseDTO> update(@PathVariable Long id, @Valid @RequestBody EntrepriseRequestDTO dto) {
        return ResponseEntity.ok(entrepriseService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        entrepriseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
