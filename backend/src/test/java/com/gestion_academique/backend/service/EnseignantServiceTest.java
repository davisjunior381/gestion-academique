package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.EnseignantRequestDTO;
import com.gestion_academique.backend.dto.EnseignantResponseDTO;
import com.gestion_academique.backend.dto.ModuleResponseDTO;
import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Module;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.EnseignantRepository;
import com.gestion_academique.backend.repository.ModuleRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnseignantServiceTest {

    @Mock
    private EnseignantRepository enseignantRepository;

    @Mock
    private ModuleRepository moduleRepository;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private EnseignantService enseignantService;

    private Enseignant enseignant;
    private EnseignantRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        enseignant = new Enseignant();
        enseignant.setCodeUtilisateur(1L);
        enseignant.setNom("Dupont");
        enseignant.setPrenom("Jean");
        enseignant.setEmail("jean.dupont@eseo.fr");
        enseignant.setMotDePasse("password");
        enseignant.setGrade("MCF");
        enseignant.setSpecialite("Informatique");
        enseignant.setDepartement("Sciences");
        enseignant.setModules(new HashSet<>());

        requestDTO = new EnseignantRequestDTO();
        requestDTO.setNom("Dupont");
        requestDTO.setPrenom("Jean");
        requestDTO.setEmail("jean.dupont@eseo.fr");
        requestDTO.setMotDePasse("password");
        requestDTO.setGrade("MCF");
        requestDTO.setSpecialite("Informatique");
        requestDTO.setDepartement("Sciences");
    }

    @Test
    @DisplayName("getAll retourne la liste des enseignants")
    void getAll_returnsListOfEnseignants() {
        when(enseignantRepository.findAll()).thenReturn(Arrays.asList(enseignant));

        List<EnseignantResponseDTO> result = enseignantService.getAll();

        assertEquals(1, result.size());
        assertEquals("Dupont", result.get(0).getNom());
        verify(enseignantRepository).findAll();
    }

    @Test
    @DisplayName("getById retourne l'enseignant")
    void getById_returnsEnseignant() {
        when(enseignantRepository.findById(1L)).thenReturn(Optional.of(enseignant));

        EnseignantResponseDTO result = enseignantService.getById(1L);

        assertEquals("Dupont", result.getNom());
        assertEquals("MCF", result.getGrade());
    }

    @Test
    @DisplayName("getById lance exception si non trouve")
    void getById_throwsIfNotFound() {
        when(enseignantRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> enseignantService.getById(99L));
    }

    @Test
    @DisplayName("create sauvegarde et retourne l'enseignant")
    void create_savesAndReturns() {
        when(enseignantRepository.save(any(Enseignant.class))).thenReturn(enseignant);

        EnseignantResponseDTO result = enseignantService.create(requestDTO);

        assertEquals("Dupont", result.getNom());
        assertEquals("Informatique", result.getSpecialite());
        verify(enseignantRepository).save(any(Enseignant.class));
    }

    @Test
    @DisplayName("update modifie l'enseignant existant")
    void update_modifiesExisting() {
        when(enseignantRepository.findById(1L)).thenReturn(Optional.of(enseignant));
        when(enseignantRepository.save(any(Enseignant.class))).thenReturn(enseignant);

        requestDTO.setNom("Martin");
        EnseignantResponseDTO result = enseignantService.update(1L, requestDTO);

        assertNotNull(result);
        verify(enseignantRepository).save(any(Enseignant.class));
    }

    @Test
    @DisplayName("delete supprime l'enseignant")
    void delete_removesEnseignant() {
        when(enseignantRepository.existsById(1L)).thenReturn(true);

        enseignantService.delete(1L);

        verify(enseignantRepository).deleteById(1L);
    }

    @Test
    @DisplayName("delete lance exception si non trouve")
    void delete_throwsIfNotFound() {
        when(enseignantRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> enseignantService.delete(99L));
    }

    @Test
    @DisplayName("affecterModule ajoute un module a l'enseignant")
    void affecterModule_addsModule() {
        Module module = new Module();
        module.setCodeModule(1L);
        module.setNom("Java Avance");

        when(enseignantRepository.findById(1L)).thenReturn(Optional.of(enseignant));
        when(moduleRepository.findById(1L)).thenReturn(Optional.of(module));
        when(enseignantRepository.save(any(Enseignant.class))).thenReturn(enseignant);

        EnseignantResponseDTO result = enseignantService.affecterModule(1L, 1L);

        assertNotNull(result);
        verify(enseignantRepository).save(any(Enseignant.class));
    }

    @Test
    @DisplayName("getModules retourne les modules de l'enseignant")
    void getModules_returnsModules() {
        Module module = new Module();
        module.setCodeModule(1L);
        module.setNom("Java Avance");
        module.setDescription("Cours avance");
        enseignant.getModules().add(module);

        when(enseignantRepository.findById(1L)).thenReturn(Optional.of(enseignant));

        List<ModuleResponseDTO> result = enseignantService.getModules(1L);

        assertEquals(1, result.size());
        assertEquals("Java Avance", result.get(0).getNom());
    }
}
