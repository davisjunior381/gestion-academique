package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.ApprenantRequestDTO;
import com.gestion_academique.backend.dto.ApprenantResponseDTO;
import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.Filiere;
import com.gestion_academique.backend.entity.Promotion;
import com.gestion_academique.backend.entity.Role;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.ApprenantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ApprenantService {

    private final ApprenantRepository apprenantRepository;
    private final EntityManager entityManager;
    private final FiliereService filiereService;
    private final PromotionService promotionService;

    public List<ApprenantResponseDTO> getAll() {
        return apprenantRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ApprenantResponseDTO getById(Long id) {
        Apprenant apprenant = apprenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apprenant non trouvé avec l'id: " + id));
        return toResponseDTO(apprenant);
    }

    public List<ApprenantResponseDTO> getByFiliere(Long filiereId) {
        return apprenantRepository.findByFiliereCodeFiliere(filiereId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ApprenantResponseDTO> getByPromotion(Long promotionId) {
        return apprenantRepository.findByPromotionCodePromotion(promotionId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ApprenantResponseDTO create(ApprenantRequestDTO dto) {
        Apprenant apprenant = new Apprenant();
        apprenant.setNom(dto.getNom());
        apprenant.setPrenom(dto.getPrenom());
        apprenant.setEmail(dto.getEmail());
        apprenant.setMotDePasse(dto.getMotDePasse());
        apprenant.setNumEtudiant(dto.getNumEtudiant());
        apprenant.setDateInscription(LocalDate.now());

        if (dto.getFiliereId() != null) {
            Filiere filiere = entityManager.find(Filiere.class, dto.getFiliereId());
            if (filiere == null) throw new ResourceNotFoundException("Filière non trouvée avec l'id: " + dto.getFiliereId());
            apprenant.setFiliere(filiere);
        }

        if (dto.getPromotionId() != null) {
            Promotion promotion = entityManager.find(Promotion.class, dto.getPromotionId());
            if (promotion == null) throw new ResourceNotFoundException("Promotion non trouvée avec l'id: " + dto.getPromotionId());
            apprenant.setPromotion(promotion);
        }

        if (dto.getRoleId() != null) {
            Role role = entityManager.find(Role.class, dto.getRoleId());
            if (role == null) throw new ResourceNotFoundException("Rôle non trouvé avec l'id: " + dto.getRoleId());
            apprenant.setRole(role);
        }

        Apprenant saved = apprenantRepository.save(apprenant);
        return toResponseDTO(saved);
    }

    public ApprenantResponseDTO update(Long id, ApprenantRequestDTO dto) {
        Apprenant apprenant = apprenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apprenant non trouvé avec l'id: " + id));

        apprenant.setNom(dto.getNom());
        apprenant.setPrenom(dto.getPrenom());
        apprenant.setEmail(dto.getEmail());
        apprenant.setMotDePasse(dto.getMotDePasse());
        apprenant.setNumEtudiant(dto.getNumEtudiant());

        if (dto.getFiliereId() != null) {
            Filiere filiere = entityManager.find(Filiere.class, dto.getFiliereId());
            if (filiere == null) throw new ResourceNotFoundException("Filière non trouvée avec l'id: " + dto.getFiliereId());
            apprenant.setFiliere(filiere);
        }

        if (dto.getPromotionId() != null) {
            Promotion promotion = entityManager.find(Promotion.class, dto.getPromotionId());
            if (promotion == null) throw new ResourceNotFoundException("Promotion non trouvée avec l'id: " + dto.getPromotionId());
            apprenant.setPromotion(promotion);
        }

        if (dto.getRoleId() != null) {
            Role role = entityManager.find(Role.class, dto.getRoleId());
            if (role == null) throw new ResourceNotFoundException("Rôle non trouvé avec l'id: " + dto.getRoleId());
            apprenant.setRole(role);
        }

        Apprenant saved = apprenantRepository.save(apprenant);
        return toResponseDTO(saved);
    }

    public void delete(Long id) {
        if (!apprenantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Apprenant non trouvé avec l'id: " + id);
        }
        apprenantRepository.deleteById(id);
    }

    private ApprenantResponseDTO toResponseDTO(Apprenant apprenant) {
        ApprenantResponseDTO dto = new ApprenantResponseDTO();
        dto.setCodeUtilisateur(apprenant.getCodeUtilisateur());
        dto.setNom(apprenant.getNom());
        dto.setPrenom(apprenant.getPrenom());
        dto.setEmail(apprenant.getEmail());
        dto.setNumEtudiant(apprenant.getNumEtudiant());
        dto.setDateInscription(apprenant.getDateInscription());
        dto.setDateCreation(apprenant.getDateCreation());

        if (apprenant.getFiliere() != null) {
            dto.setFiliereNom(apprenant.getFiliere().getNom());
            dto.setFiliereId(apprenant.getFiliere().getCodeFiliere());
        }

        if (apprenant.getPromotion() != null) {
            dto.setPromotionNom(apprenant.getPromotion().getNom());
            dto.setPromotionId(apprenant.getPromotion().getCodePromotion());
        }

        if (apprenant.getRole() != null) {
            dto.setRoleNom(apprenant.getRole().getNom());
        }

        return dto;
    }

    // ---- Affectation filière ----
    public ApprenantResponseDTO affecterFiliere(Long apprenantId, Long filiereId) {
        Apprenant apprenant = apprenantRepository.findById(apprenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Apprenant non trouvé avec l'id : " + apprenantId));
        Filiere filiere = filiereService.findOrThrow(filiereId);
        apprenant.setFiliere(filiere);
        return toResponseDTO(apprenantRepository.save(apprenant));
    }

    // ---- Désaffectation filière ----
    public ApprenantResponseDTO desaffecterFiliere(Long apprenantId) {
        Apprenant apprenant = apprenantRepository.findById(apprenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Apprenant non trouvé avec l'id : " + apprenantId));
        apprenant.setFiliere(null);
        return toResponseDTO(apprenantRepository.save(apprenant));
    }

    // ---- Affectation promotion ----
    public ApprenantResponseDTO affecterPromotion(Long apprenantId, Long promotionId) {
        Apprenant apprenant = apprenantRepository.findById(apprenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Apprenant non trouvé avec l'id : " + apprenantId));
        Promotion promotion = promotionService.findOrThrow(promotionId);
        apprenant.setPromotion(promotion);
        return toResponseDTO(apprenantRepository.save(apprenant));
    }
}
