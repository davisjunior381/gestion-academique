package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.ApprenantRequestDTO;
import com.gestion_academique.backend.dto.ApprenantResponseDTO;
import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.Filiere;
import com.gestion_academique.backend.entity.Promotion;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.ApprenantRepository;
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
class ApprenantServiceTest {

    @Mock
    private ApprenantRepository apprenantRepository;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private ApprenantService apprenantService;

    private Apprenant apprenant;
    private ApprenantRequestDTO requestDTO;
    private Filiere filiere;
    private Promotion promotion;

    @BeforeEach
    void setUp() {
        filiere = new Filiere();
        filiere.setCodeFiliere(1L);
        filiere.setNom("Informatique");

        promotion = new Promotion();
        promotion.setCodePromotion(1L);
        promotion.setNom("2025-2026");

        apprenant = new Apprenant();
        apprenant.setCodeUtilisateur(1L);
        apprenant.setNom("Martin");
        apprenant.setPrenom("Alice");
        apprenant.setEmail("alice.martin@eseo.fr");
        apprenant.setMotDePasse("password");
        apprenant.setNumEtudiant("ETU001");
        apprenant.setFiliere(filiere);
        apprenant.setPromotion(promotion);

        requestDTO = new ApprenantRequestDTO();
        requestDTO.setNom("Martin");
        requestDTO.setPrenom("Alice");
        requestDTO.setEmail("alice.martin@eseo.fr");
        requestDTO.setMotDePasse("password");
        requestDTO.setNumEtudiant("ETU001");
        requestDTO.setFiliereId(1L);
        requestDTO.setPromotionId(1L);
    }

    @Test
    @DisplayName("getAll retourne la liste des apprenants")
    void getAll_returnsListOfApprenants() {
        when(apprenantRepository.findAll()).thenReturn(Arrays.asList(apprenant));

        List<ApprenantResponseDTO> result = apprenantService.getAll();

        assertEquals(1, result.size());
        assertEquals("Martin", result.get(0).getNom());
        assertEquals("Informatique", result.get(0).getFiliereNom());
    }

    @Test
    @DisplayName("getById retourne l'apprenant")
    void getById_returnsApprenant() {
        when(apprenantRepository.findById(1L)).thenReturn(Optional.of(apprenant));

        ApprenantResponseDTO result = apprenantService.getById(1L);

        assertEquals("Alice", result.getPrenom());
        assertEquals("ETU001", result.getNumEtudiant());
    }

    @Test
    @DisplayName("getById lance exception si non trouve")
    void getById_throwsIfNotFound() {
        when(apprenantRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> apprenantService.getById(99L));
    }

    @Test
    @DisplayName("getByFiliere retourne les apprenants d'une filiere")
    void getByFiliere_returnsApprenants() {
        when(apprenantRepository.findByFiliereCodeFiliere(1L)).thenReturn(Arrays.asList(apprenant));

        List<ApprenantResponseDTO> result = apprenantService.getByFiliere(1L);

        assertEquals(1, result.size());
        assertEquals("Informatique", result.get(0).getFiliereNom());
    }

    @Test
    @DisplayName("create avec filiere et promotion")
    void create_withFiliereAndPromotion() {
        when(entityManager.find(Filiere.class, 1L)).thenReturn(filiere);
        when(entityManager.find(Promotion.class, 1L)).thenReturn(promotion);
        when(apprenantRepository.save(any(Apprenant.class))).thenReturn(apprenant);

        ApprenantResponseDTO result = apprenantService.create(requestDTO);

        assertEquals("Martin", result.getNom());
        verify(apprenantRepository).save(any(Apprenant.class));
    }

    @Test
    @DisplayName("create lance exception si filiere non trouvee")
    void create_throwsIfFiliereNotFound() {
        when(entityManager.find(Filiere.class, 1L)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> apprenantService.create(requestDTO));
    }

    @Test
    @DisplayName("update modifie l'apprenant existant")
    void update_modifiesExisting() {
        when(apprenantRepository.findById(1L)).thenReturn(Optional.of(apprenant));
        when(entityManager.find(Filiere.class, 1L)).thenReturn(filiere);
        when(entityManager.find(Promotion.class, 1L)).thenReturn(promotion);
        when(apprenantRepository.save(any(Apprenant.class))).thenReturn(apprenant);

        ApprenantResponseDTO result = apprenantService.update(1L, requestDTO);

        assertNotNull(result);
        verify(apprenantRepository).save(any(Apprenant.class));
    }

    @Test
    @DisplayName("delete supprime l'apprenant")
    void delete_removesApprenant() {
        when(apprenantRepository.existsById(1L)).thenReturn(true);

        apprenantService.delete(1L);

        verify(apprenantRepository).deleteById(1L);
    }

    @Test
    @DisplayName("delete lance exception si non trouve")
    void delete_throwsIfNotFound() {
        when(apprenantRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> apprenantService.delete(99L));
    }
}
