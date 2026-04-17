package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.EvaluationDTO;
import com.gestion_academique.backend.dto.RapportResponseDTO;
import com.gestion_academique.backend.enums.StatutRapport;
import com.gestion_academique.backend.service.RapportStageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/rapports")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RapportStageController {

    private final RapportStageService rapportService;

    @GetMapping
    public ResponseEntity<List<RapportResponseDTO>> getAll() {
        return ResponseEntity.ok(rapportService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RapportResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(rapportService.getById(id));
    }

    @GetMapping("/stage/{stageId}")
    public ResponseEntity<RapportResponseDTO> getByStage(@PathVariable Long stageId) {
        return ResponseEntity.ok(rapportService.getByStage(stageId));
    }

    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<RapportResponseDTO>> getByStatut(@PathVariable StatutRapport statut) {
        return ResponseEntity.ok(rapportService.getByStatut(statut));
    }

    @GetMapping("/evaluateur/{evaluateurId}")
    public ResponseEntity<List<RapportResponseDTO>> getByEvaluateur(@PathVariable Long evaluateurId) {
        return ResponseEntity.ok(rapportService.getByEvaluateur(evaluateurId));
    }

    @PostMapping(value = "/deposer/{stageId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RapportResponseDTO> deposer(
            @PathVariable Long stageId,
            @RequestParam("fichier") MultipartFile fichier) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(rapportService.deposer(stageId, fichier));
    }

    @PostMapping("/{rapportId}/evaluer")
    public ResponseEntity<RapportResponseDTO> evaluer(
            @PathVariable Long rapportId,
            @Valid @RequestBody EvaluationDTO dto) {
        return ResponseEntity.ok(rapportService.evaluer(rapportId, dto));
    }

    @PatchMapping("/{rapportId}/valider")
    public ResponseEntity<RapportResponseDTO> valider(@PathVariable Long rapportId) {
        return ResponseEntity.ok(rapportService.valider(rapportId));
    }

    @PatchMapping("/{rapportId}/rejeter")
    public ResponseEntity<RapportResponseDTO> rejeter(@PathVariable Long rapportId) {
        return ResponseEntity.ok(rapportService.rejeter(rapportId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        rapportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
