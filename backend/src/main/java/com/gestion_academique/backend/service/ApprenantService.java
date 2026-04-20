package com.gestion_academique.backend.service;

import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.Filiere;
import com.gestion_academique.backend.entity.Promotion;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.ApprenantRepository;
import com.gestion_academique.backend.repository.FiliereRepository;
import com.gestion_academique.backend.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApprenantService {

    private final ApprenantRepository apprenantRepository;
    private final FiliereRepository filiereRepository;
    private final PromotionRepository promotionRepository;

    // ── Affectation filière ───────────────────────────────────────────────────
    @Transactional
    public Apprenant affecterFiliere(Long apprenantId, Long filiereId) {
        Apprenant apprenant = apprenantRepository.findById(apprenantId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Apprenant", "id", apprenantId));

        Filiere filiere = filiereRepository.findById(filiereId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Filiere", "id", filiereId));

        apprenant.setFiliere(filiere);
        return apprenantRepository.save(apprenant);
    }

    // Désaffectation filière
    @Transactional
    public Apprenant desaffecterFiliere(Long apprenantId) {
        Apprenant apprenant = apprenantRepository.findById(apprenantId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Apprenant", "id", apprenantId));

        apprenant.setFiliere(null);
        return apprenantRepository.save(apprenant);
    }

    // Affectation promotion
    @Transactional
    public Apprenant affecterPromotion(Long apprenantId, Long promotionId) {
        Apprenant apprenant = apprenantRepository.findById(apprenantId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Apprenant", "id", apprenantId));

        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Promotion", "id", promotionId));

        apprenant.setPromotion(promotion);
        return apprenantRepository.save(apprenant);
    }
}