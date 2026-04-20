package com.gestion_academique.backend.controller;

import com.gestion_academique.backend.dto.PromotionDTo;
import com.gestion_academique.backend.entity.Promotion;
import com.gestion_academique.backend.service.PromotionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
@Tag(name = "Promotions")
public class PromotionController {

    private final PromotionService promotionService;

    @GetMapping
    public ResponseEntity<List<Promotion>> findAll() {
        return ResponseEntity.ok(promotionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Promotion> findById(@PathVariable Long id) {
        return ResponseEntity.ok(promotionService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Promotion> create(@Valid @RequestBody PromotionDTo dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(promotionService.create(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        promotionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}