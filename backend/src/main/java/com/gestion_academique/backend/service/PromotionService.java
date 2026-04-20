package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.PromotionDTo;
import com.gestion_academique.backend.entity.Promotion;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public List<Promotion> findAll() {
        return promotionRepository.findAll();
    }

    public Promotion findById(Long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Promotion", "id", id));
    }

    public Promotion create(PromotionDTo dto) {
        Promotion promotion = new Promotion();
        promotion.setNom(dto.getNom());
        promotion.setAnnee(dto.getAnnee());
        return promotionRepository.save(promotion);
    }

    public void delete(Long id) {
        findById(id);
        promotionRepository.deleteById(id);
    }
}