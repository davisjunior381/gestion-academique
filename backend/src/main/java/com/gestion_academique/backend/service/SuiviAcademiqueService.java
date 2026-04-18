package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.MoyenneResponseDTO;
import com.gestion_academique.backend.dto.SuiviAcademiqueRequestDTO;
import com.gestion_academique.backend.dto.SuiviAcademiqueResponseDTO;
import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.SuiviAcademique;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.SuiviAcademiqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SuiviAcademiqueService {

    private final SuiviAcademiqueRepository suiviRepository;
    private final EntityManager entityManager;

    public List<SuiviAcademiqueResponseDTO> getByApprenant(Long apprenantId) {
        return suiviRepository.findByApprenantCodeUtilisateur(apprenantId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<SuiviAcademiqueResponseDTO> getByApprenantAndSemestre(Long apprenantId, String semestre) {
        return suiviRepository.findByApprenantCodeUtilisateurAndSemestre(apprenantId, semestre).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public SuiviAcademiqueResponseDTO getById(Long id) {
        SuiviAcademique suivi = suiviRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Suivi non trouvé avec l'id: " + id));
        return toResponseDTO(suivi);
    }

    public SuiviAcademiqueResponseDTO create(SuiviAcademiqueRequestDTO dto) {
        Apprenant apprenant = entityManager.find(Apprenant.class, dto.getApprenantId());
        if (apprenant == null) throw new ResourceNotFoundException("Apprenant non trouvé avec l'id: " + dto.getApprenantId());

        SuiviAcademique suivi = new SuiviAcademique();
        suivi.setMoyenne(dto.getMoyenne());
        suivi.setAppreciation(dto.getAppreciation());
        suivi.setSemestre(dto.getSemestre());
        suivi.setApprenant(apprenant);

        SuiviAcademique saved = suiviRepository.save(suivi);
        return toResponseDTO(saved);
    }

    public SuiviAcademiqueResponseDTO update(Long id, SuiviAcademiqueRequestDTO dto) {
        SuiviAcademique suivi = suiviRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Suivi non trouvé avec l'id: " + id));

        suivi.setMoyenne(dto.getMoyenne());
        suivi.setAppreciation(dto.getAppreciation());
        suivi.setSemestre(dto.getSemestre());

        SuiviAcademique saved = suiviRepository.save(suivi);
        return toResponseDTO(saved);
    }

    public void delete(Long id) {
        if (!suiviRepository.existsById(id)) {
            throw new ResourceNotFoundException("Suivi non trouvé avec l'id: " + id);
        }
        suiviRepository.deleteById(id);
    }

    public MoyenneResponseDTO calculerMoyenne(Long apprenantId, String semestre) {
        Apprenant apprenant = entityManager.find(Apprenant.class, apprenantId);
        if (apprenant == null) throw new ResourceNotFoundException("Apprenant non trouvé avec l'id: " + apprenantId);

        List<SuiviAcademique> suivis;
        if (semestre != null) {
            suivis = suiviRepository.findByApprenantCodeUtilisateurAndSemestre(apprenantId, semestre);
        } else {
            suivis = suiviRepository.findByApprenantCodeUtilisateur(apprenantId);
        }

        Float moyenneGenerale = null;
        if (!suivis.isEmpty()) {
            float somme = 0;
            int count = 0;
            for (SuiviAcademique s : suivis) {
                if (s.getMoyenne() != null) {
                    somme += s.getMoyenne();
                    count++;
                }
            }
            if (count > 0) {
                moyenneGenerale = somme / count;
            }
        }

        MoyenneResponseDTO dto = new MoyenneResponseDTO();
        dto.setApprenantId(apprenant.getCodeUtilisateur());
        dto.setApprenantNom(apprenant.getNom());
        dto.setApprenantPrenom(apprenant.getPrenom());
        dto.setSemestre(semestre);
        dto.setMoyenneGenerale(moyenneGenerale);
        dto.setNombreSuivis(suivis.size());
        return dto;
    }

    private SuiviAcademiqueResponseDTO toResponseDTO(SuiviAcademique suivi) {
        SuiviAcademiqueResponseDTO dto = new SuiviAcademiqueResponseDTO();
        dto.setCodeSuivi(suivi.getCodeSuivi());
        dto.setMoyenne(suivi.getMoyenne());
        dto.setAppreciation(suivi.getAppreciation());
        dto.setSemestre(suivi.getSemestre());

        if (suivi.getApprenant() != null) {
            dto.setApprenantId(suivi.getApprenant().getCodeUtilisateur());
            dto.setApprenantNom(suivi.getApprenant().getNom());
            dto.setApprenantPrenom(suivi.getApprenant().getPrenom());
        }

        return dto;
    }
}
