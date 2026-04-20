package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.SoutenanceRequestDTO;
import com.gestion_academique.backend.dto.SoutenanceResponseDTO;
import com.gestion_academique.backend.entity.Jury;
import com.gestion_academique.backend.entity.Soutenance;
import com.gestion_academique.backend.entity.Stage;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.SoutenanceRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SoutenanceServiceTest {

    @Mock
    private SoutenanceRepository soutenanceRepository;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private SoutenanceService soutenanceService;

    private Soutenance soutenance;
    private Stage stage;
    private SoutenanceRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        stage = new Stage();
        stage.setRefStage(1L);
        stage.setTitre("Stage Dev Web");

        soutenance = new Soutenance();
        soutenance.setRefSoutenance(1L);
        soutenance.setDate(LocalDateTime.of(2026, 7, 15, 14, 0));
        soutenance.setSalle("A101");
        soutenance.setDuree(60);
        soutenance.setStatut("PLANIFIEE");
        soutenance.setStage(stage);

        requestDTO = new SoutenanceRequestDTO();
        requestDTO.setDate(LocalDateTime.of(2026, 7, 15, 14, 0));
        requestDTO.setSalle("A101");
        requestDTO.setDuree(60);
        requestDTO.setStageId(1L);
    }

    @Test
    @DisplayName("getAll retourne la liste des soutenances")
    void getAll_returnsListOfSoutenances() {
        when(soutenanceRepository.findAll()).thenReturn(Arrays.asList(soutenance));

        List<SoutenanceResponseDTO> result = soutenanceService.getAll();

        assertEquals(1, result.size());
        assertEquals("A101", result.get(0).getSalle());
        assertEquals("Stage Dev Web", result.get(0).getStageTitre());
    }

    @Test
    @DisplayName("getById retourne la soutenance")
    void getById_returnsSoutenance() {
        when(soutenanceRepository.findById(1L)).thenReturn(Optional.of(soutenance));

        SoutenanceResponseDTO result = soutenanceService.getById(1L);

        assertEquals("A101", result.getSalle());
        assertEquals("PLANIFIEE", result.getStatut());
    }

    @Test
    @DisplayName("getById lance exception si non trouvee")
    void getById_throwsIfNotFound() {
        when(soutenanceRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> soutenanceService.getById(99L));
    }

    @Test
    @DisplayName("create sauvegarde la soutenance")
    void create_savesAndReturns() {
        when(entityManager.find(Stage.class, 1L)).thenReturn(stage);
        when(soutenanceRepository.findByStageRefStage(1L)).thenReturn(Optional.empty());
        when(soutenanceRepository.save(any(Soutenance.class))).thenReturn(soutenance);

        SoutenanceResponseDTO result = soutenanceService.create(requestDTO);

        assertEquals("A101", result.getSalle());
        verify(soutenanceRepository).save(any(Soutenance.class));
    }

    @Test
    @DisplayName("create lance exception si stage non trouve")
    void create_throwsIfStageNotFound() {
        when(entityManager.find(Stage.class, 1L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> soutenanceService.create(requestDTO));
    }

    @Test
    @DisplayName("create lance exception si soutenance existe deja pour ce stage")
    void create_throwsIfAlreadyExists() {
        when(entityManager.find(Stage.class, 1L)).thenReturn(stage);
        when(soutenanceRepository.findByStageRefStage(1L)).thenReturn(Optional.of(soutenance));

        assertThrows(IllegalArgumentException.class, () -> soutenanceService.create(requestDTO));
    }

    @Test
    @DisplayName("create avec jury")
    void create_withJury() {
        Jury jury = new Jury();
        jury.setCodeJury(1L);
        requestDTO.setJuryId(1L);

        when(entityManager.find(Stage.class, 1L)).thenReturn(stage);
        when(entityManager.find(Jury.class, 1L)).thenReturn(jury);
        when(soutenanceRepository.findByStageRefStage(1L)).thenReturn(Optional.empty());
        when(soutenanceRepository.save(any(Soutenance.class))).thenReturn(soutenance);

        SoutenanceResponseDTO result = soutenanceService.create(requestDTO);

        assertNotNull(result);
        verify(soutenanceRepository).save(any(Soutenance.class));
    }

    @Test
    @DisplayName("delete supprime la soutenance")
    void delete_removesSoutenance() {
        when(soutenanceRepository.existsById(1L)).thenReturn(true);

        soutenanceService.delete(1L);

        verify(soutenanceRepository).deleteById(1L);
    }
}
