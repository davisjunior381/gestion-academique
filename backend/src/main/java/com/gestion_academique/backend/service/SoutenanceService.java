package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.SoutenanceRequestDTO;
import com.gestion_academique.backend.dto.SoutenanceResponseDTO;
import com.gestion_academique.backend.entity.Jury;
import com.gestion_academique.backend.entity.Soutenance;
import com.gestion_academique.backend.entity.Stage;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.SoutenanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SoutenanceService {

    private final SoutenanceRepository soutenanceRepository;
    private final EntityManager entityManager;

    public List<SoutenanceResponseDTO> getAll() {
        return soutenanceRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public SoutenanceResponseDTO getById(Long id) {
        Soutenance soutenance = soutenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Soutenance non trouvée avec l'id: " + id));
        return toResponseDTO(soutenance);
    }

    public SoutenanceResponseDTO getByStage(Long stageId) {
        Soutenance soutenance = soutenanceRepository.findByStageRefStage(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("Aucune soutenance pour le stage: " + stageId));
        return toResponseDTO(soutenance);
    }

    public SoutenanceResponseDTO create(SoutenanceRequestDTO dto) {
        Stage stage = entityManager.find(Stage.class, dto.getStageId());
        if (stage == null) throw new ResourceNotFoundException("Stage non trouvé avec l'id: " + dto.getStageId());

        if (soutenanceRepository.findByStageRefStage(dto.getStageId()).isPresent()) {
            throw new IllegalArgumentException("Une soutenance existe déjà pour ce stage");
        }

        Soutenance soutenance = new Soutenance();
        soutenance.setDate(dto.getDate());
        soutenance.setSalle(dto.getSalle());
        soutenance.setDuree(dto.getDuree());
        soutenance.setStatut("PLANIFIEE");
        soutenance.setStage(stage);

        if (dto.getJuryId() != null) {
            Jury jury = entityManager.find(Jury.class, dto.getJuryId());
            if (jury == null) throw new ResourceNotFoundException("Jury non trouvé avec l'id: " + dto.getJuryId());
            soutenance.setJury(jury);
        }

        Soutenance saved = soutenanceRepository.save(soutenance);
        return toResponseDTO(saved);
    }

    public SoutenanceResponseDTO update(Long id, SoutenanceRequestDTO dto) {
        Soutenance soutenance = soutenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Soutenance non trouvée avec l'id: " + id));

        soutenance.setDate(dto.getDate());
        soutenance.setSalle(dto.getSalle());
        soutenance.setDuree(dto.getDuree());

        if (dto.getJuryId() != null) {
            Jury jury = entityManager.find(Jury.class, dto.getJuryId());
            if (jury == null) throw new ResourceNotFoundException("Jury non trouvé avec l'id: " + dto.getJuryId());
            soutenance.setJury(jury);
        }

        Soutenance saved = soutenanceRepository.save(soutenance);
        return toResponseDTO(saved);
    }

    public void delete(Long id) {
        if (!soutenanceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Soutenance non trouvée avec l'id: " + id);
        }
        soutenanceRepository.deleteById(id);
    }

    private SoutenanceResponseDTO toResponseDTO(Soutenance soutenance) {
        SoutenanceResponseDTO dto = new SoutenanceResponseDTO();
        dto.setRefSoutenance(soutenance.getRefSoutenance());
        dto.setDate(soutenance.getDate());
        dto.setSalle(soutenance.getSalle());
        dto.setDuree(soutenance.getDuree());
        dto.setStatut(soutenance.getStatut());

        if (soutenance.getStage() != null) {
            dto.setStageId(soutenance.getStage().getRefStage());
            dto.setStageTitre(soutenance.getStage().getTitre());
        }

        if (soutenance.getJury() != null) {
            dto.setJuryId(soutenance.getJury().getCodeJury());
            dto.setJuryIntitule(soutenance.getJury().getIntitule());
        }

        return dto;
    }
}
