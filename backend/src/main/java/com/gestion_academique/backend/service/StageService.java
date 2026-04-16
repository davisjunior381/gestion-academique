package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.StageRequestDTO;
import com.gestion_academique.backend.dto.StageResponseDTO;
import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Entreprise;
import com.gestion_academique.backend.entity.Stage;
import com.gestion_academique.backend.enums.StatutStage;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StageService {

    private final StageRepository stageRepository;
    private final EntityManager entityManager;

    public List<StageResponseDTO> getAll() {
        return stageRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public StageResponseDTO getById(Long id) {
        Stage stage = stageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stage non trouvé avec l'id: " + id));
        return toResponseDTO(stage);
    }

    public List<StageResponseDTO> getByStatut(StatutStage statut) {
        return stageRepository.findByStatut(statut).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<StageResponseDTO> getByApprenant(Long apprenantId) {
        return stageRepository.findByApprenantCodeUtilisateur(apprenantId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<StageResponseDTO> getByEncadrant(Long encadrantId) {
        return stageRepository.findByEncadrantCodeUtilisateur(encadrantId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public StageResponseDTO create(StageRequestDTO dto) {
        if (dto.getDateFin().isBefore(dto.getDateDebut())) {
            throw new IllegalArgumentException("La date de fin ne peut pas être avant la date de début");
        }

        Stage stage = new Stage();
        stage.setTitre(dto.getTitre());
        stage.setDateDebut(dto.getDateDebut());
        stage.setDateFin(dto.getDateFin());
        stage.setDuree(dto.getDuree());
        stage.setObjectif(dto.getObjectif());
        stage.setStatut(StatutStage.EN_COURS);

        if (dto.getApprenantId() != null) {
            Apprenant apprenant = entityManager.find(Apprenant.class, dto.getApprenantId());
            if (apprenant == null) throw new ResourceNotFoundException("Apprenant non trouvé avec l'id: " + dto.getApprenantId());
            stage.setApprenant(apprenant);
        }

        if (dto.getEncadrantId() != null) {
            Enseignant encadrant = entityManager.find(Enseignant.class, dto.getEncadrantId());
            if (encadrant == null) throw new ResourceNotFoundException("Encadrant non trouvé avec l'id: " + dto.getEncadrantId());
            stage.setEncadrant(encadrant);
        }

        if (dto.getEntrepriseId() != null) {
            Entreprise entreprise = entityManager.find(Entreprise.class, dto.getEntrepriseId());
            if (entreprise == null) throw new ResourceNotFoundException("Entreprise non trouvée avec l'id: " + dto.getEntrepriseId());
            stage.setEntreprise(entreprise);
        }

        Stage saved = stageRepository.save(stage);
        return toResponseDTO(saved);
    }

    public StageResponseDTO update(Long id, StageRequestDTO dto) {
        Stage stage = stageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stage non trouvé avec l'id: " + id));

        if (dto.getDateFin().isBefore(dto.getDateDebut())) {
            throw new IllegalArgumentException("La date de fin ne peut pas être avant la date de début");
        }

        stage.setTitre(dto.getTitre());
        stage.setDateDebut(dto.getDateDebut());
        stage.setDateFin(dto.getDateFin());
        stage.setDuree(dto.getDuree());
        stage.setObjectif(dto.getObjectif());

        if (dto.getApprenantId() != null) {
            Apprenant apprenant = entityManager.find(Apprenant.class, dto.getApprenantId());
            if (apprenant == null) throw new ResourceNotFoundException("Apprenant non trouvé avec l'id: " + dto.getApprenantId());
            stage.setApprenant(apprenant);
        }

        if (dto.getEncadrantId() != null) {
            Enseignant encadrant = entityManager.find(Enseignant.class, dto.getEncadrantId());
            if (encadrant == null) throw new ResourceNotFoundException("Encadrant non trouvé avec l'id: " + dto.getEncadrantId());
            stage.setEncadrant(encadrant);
        }

        if (dto.getEntrepriseId() != null) {
            Entreprise entreprise = entityManager.find(Entreprise.class, dto.getEntrepriseId());
            if (entreprise == null) throw new ResourceNotFoundException("Entreprise non trouvée avec l'id: " + dto.getEntrepriseId());
            stage.setEntreprise(entreprise);
        }

        Stage saved = stageRepository.save(stage);
        return toResponseDTO(saved);
    }

    public StageResponseDTO updateStatut(Long id, StatutStage nouveauStatut) {
        Stage stage = stageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stage non trouvé avec l'id: " + id));
        stage.setStatut(nouveauStatut);
        Stage saved = stageRepository.save(stage);
        return toResponseDTO(saved);
    }

    public void delete(Long id) {
        if (!stageRepository.existsById(id)) {
            throw new ResourceNotFoundException("Stage non trouvé avec l'id: " + id);
        }
        stageRepository.deleteById(id);
    }

    private StageResponseDTO toResponseDTO(Stage stage) {
        StageResponseDTO dto = new StageResponseDTO();
        dto.setRefStage(stage.getRefStage());
        dto.setTitre(stage.getTitre());
        dto.setDateDebut(stage.getDateDebut());
        dto.setDateFin(stage.getDateFin());
        dto.setDuree(stage.getDuree());
        dto.setObjectif(stage.getObjectif());
        dto.setStatut(stage.getStatut());

        if (stage.getApprenant() != null) {
            dto.setApprenantNom(stage.getApprenant().getNom());
            dto.setApprenantPrenom(stage.getApprenant().getPrenom());
            dto.setApprenantId(stage.getApprenant().getCodeUtilisateur());
        }

        if (stage.getEncadrant() != null) {
            dto.setEncadrantNom(stage.getEncadrant().getNom());
            dto.setEncadrantPrenom(stage.getEncadrant().getPrenom());
            dto.setEncadrantId(stage.getEncadrant().getCodeUtilisateur());
        }

        if (stage.getEntreprise() != null) {
            dto.setEntrepriseNom(stage.getEntreprise().getNom());
            dto.setEntrepriseId(stage.getEntreprise().getSiretEntreprise());
        }

        return dto;
    }
}
