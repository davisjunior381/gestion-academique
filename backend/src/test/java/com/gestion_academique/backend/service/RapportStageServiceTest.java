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
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RapportStageServiceTest {

    @Mock
    private RapportStageRepository rapportRepository;

    @Mock
    private StageRepository stageRepository;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private RapportStageService rapportService;

    private Stage stage;
    private RapportStage rapport;
    private Enseignant evaluateur;

    @BeforeEach
    void setUp() {
        stage = new Stage();
        stage.setRefStage(1L);
        stage.setTitre("Stage test");
        stage.setDateDebut(LocalDate.of(2026, 5, 1));
        stage.setDateFin(LocalDate.of(2026, 7, 31));
        stage.setDuree(12);
        stage.setStatut(StatutStage.EN_COURS);

        rapport = new RapportStage();
        rapport.setRefRapport(1L);
        rapport.setFichierPdf("uploads/rapports/test.pdf");
        rapport.setDateDepot(LocalDate.now());
        rapport.setStatut(StatutRapport.DEPOSE);
        rapport.setStage(stage);

        evaluateur = new Enseignant();
        evaluateur.setCodeUtilisateur(5L);
        evaluateur.setNom("Martin");
        evaluateur.setPrenom("Sophie");
    }

    @Test
    @DisplayName("getAll retourne la liste des rapports")
    void getAll_returnsList() {
        when(rapportRepository.findAll()).thenReturn(List.of(rapport));

        List<RapportResponseDTO> result = rapportService.getAll();

        assertEquals(1, result.size());
        assertEquals("Stage test", result.get(0).getStageTitre());
    }

    @Test
    @DisplayName("getById retourne le rapport correspondant")
    void getById_existingId_returnsRapport() {
        when(rapportRepository.findById(1L)).thenReturn(Optional.of(rapport));

        RapportResponseDTO result = rapportService.getById(1L);

        assertEquals(StatutRapport.DEPOSE, result.getStatut());
        assertEquals(1L, result.getStageId());
    }

    @Test
    @DisplayName("getById lance exception si rapport inexistant")
    void getById_nonExisting_throwsException() {
        when(rapportRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> rapportService.getById(99L));
    }

    @Test
    @DisplayName("getByStage retourne le rapport du stage")
    void getByStage_existingStage_returnsRapport() {
        when(rapportRepository.findByStageRefStage(1L)).thenReturn(Optional.of(rapport));

        RapportResponseDTO result = rapportService.getByStage(1L);

        assertEquals(1L, result.getStageId());
    }

    @Test
    @DisplayName("evaluer met la note et change le statut à EVALUE")
    void evaluer_validEvaluation_updatesRapport() {
        EvaluationDTO evalDTO = new EvaluationDTO();
        evalDTO.setNote(15.5f);
        evalDTO.setCommentaire("Bon travail");
        evalDTO.setEvaluateurId(5L);

        when(rapportRepository.findById(1L)).thenReturn(Optional.of(rapport));
        when(entityManager.find(Enseignant.class, 5L)).thenReturn(evaluateur);

        RapportStage rapportEvalue = new RapportStage();
        rapportEvalue.setRefRapport(1L);
        rapportEvalue.setFichierPdf("uploads/rapports/test.pdf");
        rapportEvalue.setDateDepot(LocalDate.now());
        rapportEvalue.setNote(15.5f);
        rapportEvalue.setCommentaire("Bon travail");
        rapportEvalue.setStatut(StatutRapport.EVALUE);
        rapportEvalue.setStage(stage);
        rapportEvalue.setEvaluateur(evaluateur);

        when(rapportRepository.save(any(RapportStage.class))).thenReturn(rapportEvalue);

        RapportResponseDTO result = rapportService.evaluer(1L, evalDTO);

        assertEquals(15.5f, result.getNote());
        assertEquals("Bon travail", result.getCommentaire());
        assertEquals(StatutRapport.EVALUE, result.getStatut());
        assertEquals("Martin", result.getEvaluateurNom());
    }

    @Test
    @DisplayName("evaluer un rapport non DEPOSE lance exception")
    void evaluer_rapportNotDepose_throwsException() {
        rapport.setStatut(StatutRapport.VALIDE);
        EvaluationDTO evalDTO = new EvaluationDTO();
        evalDTO.setNote(15f);
        evalDTO.setEvaluateurId(5L);

        when(rapportRepository.findById(1L)).thenReturn(Optional.of(rapport));

        assertThrows(IllegalArgumentException.class, () -> rapportService.evaluer(1L, evalDTO));
    }

    @Test
    @DisplayName("valider change le statut à VALIDE")
    void valider_rapportEvalue_changesStatut() {
        rapport.setStatut(StatutRapport.EVALUE);
        when(rapportRepository.findById(1L)).thenReturn(Optional.of(rapport));

        RapportStage rapportValide = new RapportStage();
        rapportValide.setRefRapport(1L);
        rapportValide.setFichierPdf("uploads/rapports/test.pdf");
        rapportValide.setDateDepot(LocalDate.now());
        rapportValide.setStatut(StatutRapport.VALIDE);
        rapportValide.setStage(stage);

        when(rapportRepository.save(any(RapportStage.class))).thenReturn(rapportValide);

        RapportResponseDTO result = rapportService.valider(1L);

        assertEquals(StatutRapport.VALIDE, result.getStatut());
    }

    @Test
    @DisplayName("valider un rapport non EVALUE lance exception")
    void valider_rapportNotEvalue_throwsException() {
        rapport.setStatut(StatutRapport.DEPOSE);
        when(rapportRepository.findById(1L)).thenReturn(Optional.of(rapport));

        assertThrows(IllegalArgumentException.class, () -> rapportService.valider(1L));
    }

    @Test
    @DisplayName("rejeter change le statut à REJETE")
    void rejeter_rapportEvalue_changesStatut() {
        rapport.setStatut(StatutRapport.EVALUE);
        when(rapportRepository.findById(1L)).thenReturn(Optional.of(rapport));

        RapportStage rapportRejete = new RapportStage();
        rapportRejete.setRefRapport(1L);
        rapportRejete.setFichierPdf("uploads/rapports/test.pdf");
        rapportRejete.setDateDepot(LocalDate.now());
        rapportRejete.setStatut(StatutRapport.REJETE);
        rapportRejete.setStage(stage);

        when(rapportRepository.save(any(RapportStage.class))).thenReturn(rapportRejete);

        RapportResponseDTO result = rapportService.rejeter(1L);

        assertEquals(StatutRapport.REJETE, result.getStatut());
    }

    @Test
    @DisplayName("rejeter un rapport non EVALUE lance exception")
    void rejeter_rapportNotEvalue_throwsException() {
        rapport.setStatut(StatutRapport.DEPOSE);
        when(rapportRepository.findById(1L)).thenReturn(Optional.of(rapport));

        assertThrows(IllegalArgumentException.class, () -> rapportService.rejeter(1L));
    }
}
