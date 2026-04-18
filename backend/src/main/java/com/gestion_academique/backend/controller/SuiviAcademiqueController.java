package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.MoyenneResponseDTO;
import com.gestion_academique.backend.dto.SuiviAcademiqueRequestDTO;
import com.gestion_academique.backend.dto.SuiviAcademiqueResponseDTO;
import com.gestion_academique.backend.service.SuiviAcademiqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suivi-academique")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SuiviAcademiqueController {

    private final SuiviAcademiqueService suiviService;

    @GetMapping("/apprenant/{apprenantId}")
    public ResponseEntity<List<SuiviAcademiqueResponseDTO>> getByApprenant(@PathVariable Long apprenantId) {
        return ResponseEntity.ok(suiviService.getByApprenant(apprenantId));
    }

    @GetMapping("/apprenant/{apprenantId}/semestre/{semestre}")
    public ResponseEntity<List<SuiviAcademiqueResponseDTO>> getByApprenantAndSemestre(
            @PathVariable Long apprenantId, @PathVariable String semestre) {
        return ResponseEntity.ok(suiviService.getByApprenantAndSemestre(apprenantId, semestre));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuiviAcademiqueResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(suiviService.getById(id));
    }

    @GetMapping("/apprenant/{apprenantId}/moyenne")
    public ResponseEntity<MoyenneResponseDTO> getMoyenne(
            @PathVariable Long apprenantId,
            @RequestParam(required = false) String semestre) {
        return ResponseEntity.ok(suiviService.calculerMoyenne(apprenantId, semestre));
    }

    @PostMapping
    public ResponseEntity<SuiviAcademiqueResponseDTO> create(@Valid @RequestBody SuiviAcademiqueRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(suiviService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuiviAcademiqueResponseDTO> update(@PathVariable Long id, @Valid @RequestBody SuiviAcademiqueRequestDTO dto) {
        return ResponseEntity.ok(suiviService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        suiviService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
