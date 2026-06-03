package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.EvaluationDTO;
import com.gestion_academique.backend.dto.RapportResponseDTO;
import com.gestion_academique.backend.enums.StatutRapport;
import com.gestion_academique.backend.security.UserDetailsImpl;
import com.gestion_academique.backend.service.RapportStageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    @PreAuthorize("hasAnyRole('ADMIN', 'ENSEIGNANT')")
    public ResponseEntity<List<RapportResponseDTO>> getAll() {
        return ResponseEntity.ok(rapportService.getAll());
    }

    @GetMapping("/me")
    public ResponseEntity<List<RapportResponseDTO>> getMine(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(rapportService.getMine(user.getId(), user.getRole()));
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
    @PreAuthorize("hasAnyRole('ADMIN', 'ENSEIGNANT')")
    public ResponseEntity<List<RapportResponseDTO>> getByStatut(@PathVariable StatutRapport statut) {
        return ResponseEntity.ok(rapportService.getByStatut(statut));
    }

    @GetMapping("/evaluateur/{evaluateurId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENSEIGNANT')")
    public ResponseEntity<List<RapportResponseDTO>> getByEvaluateur(@PathVariable Long evaluateurId) {
        return ResponseEntity.ok(rapportService.getByEvaluateur(evaluateurId));
    }

    @PreAuthorize("hasRole('APPRENANT')")
    @PostMapping(value = "/deposer/{stageId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RapportResponseDTO> deposer(
            @PathVariable Long stageId,
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestParam("fichier") MultipartFile fichier) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rapportService.deposer(stageId, user.getId(), fichier));
    }

    @PostMapping("/{rapportId}/evaluer")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENSEIGNANT')")
    public ResponseEntity<RapportResponseDTO> evaluer(
            @PathVariable Long rapportId,
            @AuthenticationPrincipal UserDetailsImpl user,
            @Valid @RequestBody EvaluationDTO dto) {
        // L'evaluateur est toujours l'utilisateur authentifie : on ignore dto.evaluateurId.
        return ResponseEntity.ok(rapportService.evaluer(rapportId, user.getId(), dto));
    }

    @PatchMapping("/{rapportId}/valider")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENSEIGNANT')")
    public ResponseEntity<RapportResponseDTO> valider(@PathVariable Long rapportId) {
        return ResponseEntity.ok(rapportService.valider(rapportId));
    }

    @PatchMapping("/{rapportId}/rejeter")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENSEIGNANT')")
    public ResponseEntity<RapportResponseDTO> rejeter(@PathVariable Long rapportId) {
        return ResponseEntity.ok(rapportService.rejeter(rapportId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ENSEIGNANT')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        rapportService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
