package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.StageRequestDTO;
import com.gestion_academique.backend.dto.StageResponseDTO;
import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Stage;
import com.gestion_academique.backend.enums.StatutStage;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
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
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StageServiceTest {

    @Mock
    private StageRepository stageRepository;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private StageService stageService;

    private Stage stage;
    private StageRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        stage = new Stage();
        stage.setRefStage(1L);
        stage.setTitre("Stage développement web");
        stage.setDateDebut(LocalDate.of(2026, 5, 1));
        stage.setDateFin(LocalDate.of(2026, 7, 31));
        stage.setDuree(12);
        stage.setObjectif("Développer une application");
        stage.setStatut(StatutStage.EN_COURS);

        requestDTO = new StageRequestDTO();
        requestDTO.setTitre("Stage développement web");
        requestDTO.setDateDebut(LocalDate.of(2026, 5, 1));
        requestDTO.setDateFin(LocalDate.of(2026, 7, 31));
        requestDTO.setDuree(12);
        requestDTO.setObjectif("Développer une application");
    }

    @Test
    @DisplayName("getAll retourne la liste des stages")
    void getAll_returnsListOfStages() {
        Stage stage2 = new Stage();
        stage2.setRefStage(2L);
        stage2.setTitre("Stage data science");
        stage2.setDateDebut(LocalDate.of(2026, 6, 1));
        stage2.setDateFin(LocalDate.of(2026, 8, 31));
        stage2.setDuree(12);
        stage2.setStatut(StatutStage.EN_COURS);

        when(stageRepository.findAll()).thenReturn(Arrays.asList(stage, stage2));

        List<StageResponseDTO> result = stageService.getAll();

        assertEquals(2, result.size());
        assertEquals("Stage développement web", result.get(0).getTitre());
        assertEquals("Stage data science", result.get(1).getTitre());
        verify(stageRepository).findAll();
    }

    @Test
    @DisplayName("getById retourne le stage correspondant")
    void getById_existingId_returnsStage() {
        when(stageRepository.findById(1L)).thenReturn(Optional.of(stage));

        StageResponseDTO result = stageService.getById(1L);

        assertEquals("Stage développement web", result.getTitre());
        assertEquals(StatutStage.EN_COURS, result.getStatut());
        verify(stageRepository).findById(1L);
    }

    @Test
    @DisplayName("getById lance exception si stage inexistant")
    void getById_nonExistingId_throwsException() {
        when(stageRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> stageService.getById(99L));
        verify(stageRepository).findById(99L);
    }

    @Test
    @DisplayName("create crée un stage avec statut EN_COURS")
    void create_validDTO_returnsCreatedStage() {
        when(stageRepository.save(any(Stage.class))).thenReturn(stage);

        StageResponseDTO result = stageService.create(requestDTO);

        assertNotNull(result);
        assertEquals("Stage développement web", result.getTitre());
        assertEquals(StatutStage.EN_COURS, result.getStatut());
        verify(stageRepository).save(any(Stage.class));
    }

    @Test
    @DisplayName("create avec dateFin avant dateDebut lance exception")
    void create_invalidDates_throwsException() {
        requestDTO.setDateDebut(LocalDate.of(2026, 8, 1));
        requestDTO.setDateFin(LocalDate.of(2026, 5, 1));

        assertThrows(IllegalArgumentException.class, () -> stageService.create(requestDTO));
        verify(stageRepository, never()).save(any());
    }

    @Test
    @DisplayName("create avec apprenant affecte correctement")
    void create_withApprenant_assignsApprenant() {
        Apprenant apprenant = new Apprenant();
        apprenant.setCodeUtilisateur(10L);
        apprenant.setNom("Dupont");
        apprenant.setPrenom("Jean");

        requestDTO.setApprenantId(10L);
        when(entityManager.find(Apprenant.class, 10L)).thenReturn(apprenant);

        Stage stageWithApprenant = new Stage();
        stageWithApprenant.setRefStage(1L);
        stageWithApprenant.setTitre("Stage développement web");
        stageWithApprenant.setDateDebut(requestDTO.getDateDebut());
        stageWithApprenant.setDateFin(requestDTO.getDateFin());
        stageWithApprenant.setDuree(12);
        stageWithApprenant.setStatut(StatutStage.EN_COURS);
        stageWithApprenant.setApprenant(apprenant);

        when(stageRepository.save(any(Stage.class))).thenReturn(stageWithApprenant);

        StageResponseDTO result = stageService.create(requestDTO);

        assertEquals("Dupont", result.getApprenantNom());
        assertEquals("Jean", result.getApprenantPrenom());
    }

    @Test
    @DisplayName("create avec apprenant inexistant lance exception")
    void create_withNonExistingApprenant_throwsException() {
        requestDTO.setApprenantId(99L);
        when(entityManager.find(Apprenant.class, 99L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> stageService.create(requestDTO));
    }

    @Test
    @DisplayName("updateStatut change le statut correctement")
    void updateStatut_validTransition_updatesStatut() {
        when(stageRepository.findById(1L)).thenReturn(Optional.of(stage));

        Stage updatedStage = new Stage();
        updatedStage.setRefStage(1L);
        updatedStage.setTitre("Stage développement web");
        updatedStage.setDateDebut(stage.getDateDebut());
        updatedStage.setDateFin(stage.getDateFin());
        updatedStage.setDuree(12);
        updatedStage.setStatut(StatutStage.TERMINE);

        when(stageRepository.save(any(Stage.class))).thenReturn(updatedStage);

        StageResponseDTO result = stageService.updateStatut(1L, StatutStage.TERMINE);

        assertEquals(StatutStage.TERMINE, result.getStatut());
    }

    @Test
    @DisplayName("delete supprime un stage existant")
    void delete_existingId_deletesStage() {
        when(stageRepository.existsById(1L)).thenReturn(true);

        stageService.delete(1L);

        verify(stageRepository).deleteById(1L);
    }

    @Test
    @DisplayName("delete lance exception si stage inexistant")
    void delete_nonExistingId_throwsException() {
        when(stageRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> stageService.delete(99L));
        verify(stageRepository, never()).deleteById(any());
    }

    @Test
    @DisplayName("getByStatut filtre correctement")
    void getByStatut_returnsFilteredStages() {
        when(stageRepository.findByStatut(StatutStage.EN_COURS)).thenReturn(List.of(stage));

        List<StageResponseDTO> result = stageService.getByStatut(StatutStage.EN_COURS);

        assertEquals(1, result.size());
        assertEquals(StatutStage.EN_COURS, result.get(0).getStatut());
    }
}
