package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.FiliereDTo;
import com.gestion_academique.backend.entity.Filiere;
import com.gestion_academique.backend.service.FiliereService;
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
@Tag(name = "Filières")
public class FiliereController {

    private final FiliereService filiereService;

    @GetMapping
    public ResponseEntity<List<Filiere>> findAll() {
        return ResponseEntity.ok(filiereService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Filiere> findById(@PathVariable Long id) {
        return ResponseEntity.ok(filiereService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Filiere> create(@Valid @RequestBody FiliereDTo dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(filiereService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        filiereService.delete(id);
        return ResponseEntity.noContent().build();
    }
}