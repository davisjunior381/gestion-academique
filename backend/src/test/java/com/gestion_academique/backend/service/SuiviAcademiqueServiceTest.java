package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.MoyenneResponseDTO;
import com.gestion_academique.backend.dto.SuiviAcademiqueRequestDTO;
import com.gestion_academique.backend.dto.SuiviAcademiqueResponseDTO;
import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.SuiviAcademique;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.SuiviAcademiqueRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SuiviAcademiqueServiceTest {

    @Mock
    private SuiviAcademiqueRepository suiviRepository;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private SuiviAcademiqueService suiviService;

    private Apprenant apprenant;
    private SuiviAcademique suivi1;
    private SuiviAcademique suivi2;
    private SuiviAcademiqueRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        apprenant = new Apprenant();
        apprenant.setCodeUtilisateur(1L);
        apprenant.setNom("Martin");
        apprenant.setPrenom("Alice");

        suivi1 = new SuiviAcademique();
        suivi1.setCodeSuivi(1L);
        suivi1.setMoyenne(14.5f);
        suivi1.setAppreciation("Bon travail");
        suivi1.setSemestre("S1");
        suivi1.setApprenant(apprenant);

        suivi2 = new SuiviAcademique();
        suivi2.setCodeSuivi(2L);
        suivi2.setMoyenne(16.0f);
        suivi2.setAppreciation("Tres bien");
        suivi2.setSemestre("S1");
        suivi2.setApprenant(apprenant);

        requestDTO = new SuiviAcademiqueRequestDTO();
        requestDTO.setMoyenne(14.5f);
        requestDTO.setAppreciation("Bon travail");
        requestDTO.setSemestre("S1");
        requestDTO.setApprenantId(1L);
    }

    @Test
    @DisplayName("getByApprenant retourne les suivis d'un apprenant")
    void getByApprenant_returnsSuivis() {
        when(suiviRepository.findByApprenantCodeUtilisateur(1L)).thenReturn(Arrays.asList(suivi1, suivi2));

        List<SuiviAcademiqueResponseDTO> result = suiviService.getByApprenant(1L);

        assertEquals(2, result.size());
        assertEquals("Martin", result.get(0).getApprenantNom());
    }

    @Test
    @DisplayName("getById retourne le suivi")
    void getById_returnsSuivi() {
        when(suiviRepository.findById(1L)).thenReturn(Optional.of(suivi1));

        SuiviAcademiqueResponseDTO result = suiviService.getById(1L);

        assertEquals(14.5f, result.getMoyenne());
        assertEquals("S1", result.getSemestre());
    }

    @Test
    @DisplayName("getById lance exception si non trouve")
    void getById_throwsIfNotFound() {
        when(suiviRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> suiviService.getById(99L));
    }

    @Test
    @DisplayName("create sauvegarde le suivi")
    void create_savesAndReturns() {
        when(entityManager.find(Apprenant.class, 1L)).thenReturn(apprenant);
        when(suiviRepository.save(any(SuiviAcademique.class))).thenReturn(suivi1);

        SuiviAcademiqueResponseDTO result = suiviService.create(requestDTO);

        assertEquals(14.5f, result.getMoyenne());
        verify(suiviRepository).save(any(SuiviAcademique.class));
    }

    @Test
    @DisplayName("create lance exception si apprenant non trouve")
    void create_throwsIfApprenantNotFound() {
        when(entityManager.find(Apprenant.class, 1L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> suiviService.create(requestDTO));
    }

    @Test
    @DisplayName("calculerMoyenne retourne la moyenne par semestre")
    void calculerMoyenne_bySemestre() {
        when(entityManager.find(Apprenant.class, 1L)).thenReturn(apprenant);
        when(suiviRepository.findByApprenantCodeUtilisateurAndSemestre(1L, "S1"))
                .thenReturn(Arrays.asList(suivi1, suivi2));

        MoyenneResponseDTO result = suiviService.calculerMoyenne(1L, "S1");

        assertEquals(15.25f, result.getMoyenneGenerale());
        assertEquals(2, result.getNombreSuivis());
        assertEquals("Martin", result.getApprenantNom());
        assertEquals("S1", result.getSemestre());
    }

    @Test
    @DisplayName("calculerMoyenne retourne la moyenne globale sans filtre semestre")
    void calculerMoyenne_global() {
        when(entityManager.find(Apprenant.class, 1L)).thenReturn(apprenant);
        when(suiviRepository.findByApprenantCodeUtilisateur(1L))
                .thenReturn(Arrays.asList(suivi1, suivi2));

        MoyenneResponseDTO result = suiviService.calculerMoyenne(1L, null);

        assertEquals(15.25f, result.getMoyenneGenerale());
        assertNull(result.getSemestre());
    }

    @Test
    @DisplayName("calculerMoyenne retourne null si aucun suivi")
    void calculerMoyenne_noSuivis() {
        when(entityManager.find(Apprenant.class, 1L)).thenReturn(apprenant);
        when(suiviRepository.findByApprenantCodeUtilisateur(1L)).thenReturn(Arrays.asList());

        MoyenneResponseDTO result = suiviService.calculerMoyenne(1L, null);

        assertNull(result.getMoyenneGenerale());
        assertEquals(0, result.getNombreSuivis());
    }

    @Test
    @DisplayName("delete supprime le suivi")
    void delete_removesSuivi() {
        when(suiviRepository.existsById(1L)).thenReturn(true);

        suiviService.delete(1L);

        verify(suiviRepository).deleteById(1L);
    }
}
