package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.JuryRequestDTO;
import com.gestion_academique.backend.dto.JuryResponseDTO;
import com.gestion_academique.backend.service.JuryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jurys")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class JuryController {

    private final JuryService juryService;

    @GetMapping
    public ResponseEntity<List<JuryResponseDTO>> getAll() {
        return ResponseEntity.ok(juryService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<JuryResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(juryService.getById(id));
    }

    @PostMapping
    public ResponseEntity<JuryResponseDTO> create(@RequestBody JuryRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(juryService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JuryResponseDTO> update(@PathVariable Long id, @RequestBody JuryRequestDTO dto) {
        return ResponseEntity.ok(juryService.update(id, dto));
    }

    @PostMapping("/{id}/membres/{enseignantId}")
    public ResponseEntity<JuryResponseDTO> ajouterMembre(@PathVariable Long id, @PathVariable Long enseignantId) {
        return ResponseEntity.ok(juryService.ajouterMembre(id, enseignantId));
    }

    @DeleteMapping("/{id}/membres/{enseignantId}")
    public ResponseEntity<JuryResponseDTO> retirerMembre(@PathVariable Long id, @PathVariable Long enseignantId) {
        return ResponseEntity.ok(juryService.retirerMembre(id, enseignantId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        juryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
