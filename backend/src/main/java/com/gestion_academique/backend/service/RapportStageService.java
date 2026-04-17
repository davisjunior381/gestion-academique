package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.EvaluationDTO;
import com.gestion_academique.backend.dto.RapportResponseDTO;
import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.RapportStage;
import com.gestion_academique.backend.entity.Stage;
import com.gestion_academique.backend.enums.StatutRapport;
import com.gestion_academique.backend.enums.StatutStage;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.RapportStageRepository;
import com.gestion_academique.backend.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityManager;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RapportStageService {

    private final RapportStageRepository rapportRepository;
    private final StageRepository stageRepository;
    private final EntityManager entityManager;

    @Value("${app.upload.dir:uploads/rapports}")
    private String uploadDir;

    public List<RapportResponseDTO> getAll() {
        return rapportRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public RapportResponseDTO getById(Long id) {
        RapportStage rapport = rapportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé avec l'id: " + id));
        return toResponseDTO(rapport);
    }

    public RapportResponseDTO getByStage(Long stageId) {
        RapportStage rapport = rapportRepository.findByStageRefStage(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun rapport pour le stage: " + stageId));
        return toResponseDTO(rapport);
    }

    public List<RapportResponseDTO> getByStatut(StatutRapport statut) {
        return rapportRepository.findByStatut(statut).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<RapportResponseDTO> getByEvaluateur(Long evaluateurId) {
        return rapportRepository.findByEvaluateurCodeUtilisateur(evaluateurId).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public RapportResponseDTO deposer(Long stageId, MultipartFile fichier) throws IOException {
        Stage stage = stageRepository.findById(stageId)
                .orElseThrow(() -> new ResourceNotFoundException("Stage non trouvé avec l'id: " + stageId));

        if (stage.getStatut() != StatutStage.EN_COURS && stage.getStatut() != StatutStage.TERMINE) {
            throw new IllegalArgumentException("Le stage doit être en cours ou terminé pour déposer un rapport");
        }

        if (rapportRepository.findByStageRefStage(stageId).isPresent()) {
            throw new IllegalArgumentException("Un rapport existe déjà pour ce stage");
        }

        if (fichier.isEmpty()) {
            throw new IllegalArgumentException("Le fichier PDF est vide");
        }

        String contentType = fichier.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            throw new IllegalArgumentException("Seuls les fichiers PDF sont acceptés");
        }

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = UUID.randomUUID() + "_" + fichier.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(fichier.getInputStream(), filePath);

        RapportStage rapport = new RapportStage();
        rapport.setStage(stage);
        rapport.setFichierPdf(filePath.toString());
        rapport.setDateDepot(LocalDate.now());
        rapport.setStatut(StatutRapport.DEPOSE);

        RapportStage saved = rapportRepository.save(rapport);
        return toResponseDTO(saved);
    }

    public RapportResponseDTO evaluer(Long rapportId, EvaluationDTO dto) {
        RapportStage rapport = rapportRepository.findById(rapportId)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé avec l'id: " + rapportId));

        if (rapport.getStatut() != StatutRapport.DEPOSE) {
            throw new IllegalArgumentException("Le rapport doit être au statut DEPOSE pour être évalué");
        }

        Enseignant evaluateur = entityManager.find(Enseignant.class, dto.getEvaluateurId());
        if (evaluateur == null) {
            throw new ResourceNotFoundException("Enseignant non trouvé avec l'id: " + dto.getEvaluateurId());
        }

        rapport.setNote(dto.getNote());
        rapport.setCommentaire(dto.getCommentaire());
        rapport.setEvaluateur(evaluateur);
        rapport.setStatut(StatutRapport.EVALUE);

        RapportStage saved = rapportRepository.save(rapport);
        return toResponseDTO(saved);
    }

    public RapportResponseDTO valider(Long rapportId) {
        RapportStage rapport = rapportRepository.findById(rapportId)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé avec l'id: " + rapportId));

        if (rapport.getStatut() != StatutRapport.EVALUE) {
            throw new IllegalArgumentException("Le rapport doit être évalué avant d'être validé");
        }

        rapport.setStatut(StatutRapport.VALIDE);
        RapportStage saved = rapportRepository.save(rapport);
        return toResponseDTO(saved);
    }

    public RapportResponseDTO rejeter(Long rapportId) {
        RapportStage rapport = rapportRepository.findById(rapportId)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé avec l'id: " + rapportId));

        if (rapport.getStatut() != StatutRapport.EVALUE) {
            throw new IllegalArgumentException("Le rapport doit être évalué avant d'être rejeté");
        }

        rapport.setStatut(StatutRapport.REJETE);
        RapportStage saved = rapportRepository.save(rapport);
        return toResponseDTO(saved);
    }

    public void delete(Long id) {
        if (!rapportRepository.existsById(id)) {
            throw new ResourceNotFoundException("Rapport non trouvé avec l'id: " + id);
        }
        rapportRepository.deleteById(id);
    }

    private RapportResponseDTO toResponseDTO(RapportStage rapport) {
        RapportResponseDTO dto = new RapportResponseDTO();
        dto.setRefRapport(rapport.getRefRapport());
        dto.setFichierPdf(rapport.getFichierPdf());
        dto.setDateDepot(rapport.getDateDepot());
        dto.setNote(rapport.getNote());
        dto.setCommentaire(rapport.getCommentaire());
        dto.setStatut(rapport.getStatut());

        if (rapport.getStage() != null) {
            dto.setStageId(rapport.getStage().getRefStage());
            dto.setStageTitre(rapport.getStage().getTitre());
        }

        if (rapport.getEvaluateur() != null) {
            dto.setEvaluateurNom(rapport.getEvaluateur().getNom());
            dto.setEvaluateurPrenom(rapport.getEvaluateur().getPrenom());
            dto.setEvaluateurId(rapport.getEvaluateur().getCodeUtilisateur());
        }

        return dto;
    }
}
