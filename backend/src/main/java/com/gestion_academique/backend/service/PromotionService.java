package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.PromotionRequestDTO;
import com.gestion_academique.backend.dto.PromotionResponseDTO;
import com.gestion_academique.backend.entity.Promotion;
import com.gestion_academique.backend.repository.PromotionRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;

    public List<PromotionResponseDTO> getAll() {
        return promotionRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PromotionResponseDTO getById(Long id) {
        return toDTO(findOrThrow(id));
    }

    public PromotionResponseDTO create(PromotionRequestDTO dto) {
        Promotion promotion = new Promotion();
        promotion.setAnnee(dto.getAnnee());
        promotion.setNom(dto.getNom());
        return toDTO(promotionRepository.save(promotion));
    }

    public PromotionResponseDTO update(Long id, PromotionRequestDTO dto) {
        Promotion promotion = findOrThrow(id);
        promotion.setAnnee(dto.getAnnee());
        promotion.setNom(dto.getNom());
        return toDTO(promotionRepository.save(promotion));
    }

    public void delete(Long id) {
        findOrThrow(id);
        promotionRepository.deleteById(id);
    }

    public Promotion findOrThrow(Long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Promotion non trouvée avec l'id : " + id));
    }

    private PromotionResponseDTO toDTO(Promotion p) {
        PromotionResponseDTO dto = new PromotionResponseDTO();
        dto.setCodePromotion(p.getCodePromotion());
        dto.setAnnee(p.getAnnee());
        dto.setNom(p.getNom());
        return dto;
    }
}