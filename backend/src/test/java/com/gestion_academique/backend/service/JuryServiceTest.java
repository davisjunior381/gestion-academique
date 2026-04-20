package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.JuryRequestDTO;
import com.gestion_academique.backend.dto.JuryResponseDTO;
import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Jury;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.EnseignantRepository;
import com.gestion_academique.backend.repository.JuryRepository;
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
class JuryServiceTest {

    @Mock
    private JuryRepository juryRepository;

    @Mock
    private EnseignantRepository enseignantRepository;

    @InjectMocks
    private JuryService juryService;

    private Jury jury;
    private JuryRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        jury = new Jury();
        jury.setCodeJury(1L);
        jury.setIntitule("Jury Soutenance S1");
        jury.setRoleJury("EXAMINATEUR");
        jury.setMembres(new HashSet<>());

        requestDTO = new JuryRequestDTO();
        requestDTO.setIntitule("Jury Soutenance S1");
        requestDTO.setRoleJury("EXAMINATEUR");
    }

    @Test
    @DisplayName("getAll retourne la liste des jurys")
    void getAll_returnsListOfJurys() {
        when(juryRepository.findAll()).thenReturn(Arrays.asList(jury));

        List<JuryResponseDTO> result = juryService.getAll();

        assertEquals(1, result.size());
        assertEquals("Jury Soutenance S1", result.get(0).getIntitule());
    }

    @Test
    @DisplayName("getById retourne le jury")
    void getById_returnsJury() {
        when(juryRepository.findById(1L)).thenReturn(Optional.of(jury));

        JuryResponseDTO result = juryService.getById(1L);

        assertEquals("Jury Soutenance S1", result.getIntitule());
    }

    @Test
    @DisplayName("getById lance exception si non trouve")
    void getById_throwsIfNotFound() {
        when(juryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> juryService.getById(99L));
    }

    @Test
    @DisplayName("create sauvegarde et retourne le jury")
    void create_savesAndReturns() {
        when(juryRepository.save(any(Jury.class))).thenReturn(jury);

        JuryResponseDTO result = juryService.create(requestDTO);

        assertEquals("Jury Soutenance S1", result.getIntitule());
        verify(juryRepository).save(any(Jury.class));
    }

    @Test
    @DisplayName("ajouterMembre ajoute un enseignant au jury")
    void ajouterMembre_addsEnseignant() {
        Enseignant enseignant = new Enseignant();
        enseignant.setCodeUtilisateur(1L);
        enseignant.setNom("Dupont");
        enseignant.setPrenom("Jean");

        when(juryRepository.findById(1L)).thenReturn(Optional.of(jury));
        when(enseignantRepository.findById(1L)).thenReturn(Optional.of(enseignant));
        when(juryRepository.save(any(Jury.class))).thenReturn(jury);

        JuryResponseDTO result = juryService.ajouterMembre(1L, 1L);

        assertNotNull(result);
        verify(juryRepository).save(any(Jury.class));
    }

    @Test
    @DisplayName("retirerMembre retire un enseignant du jury")
    void retirerMembre_removesEnseignant() {
        Enseignant enseignant = new Enseignant();
        enseignant.setCodeUtilisateur(1L);
        jury.getMembres().add(enseignant);

        when(juryRepository.findById(1L)).thenReturn(Optional.of(jury));
        when(enseignantRepository.findById(1L)).thenReturn(Optional.of(enseignant));
        when(juryRepository.save(any(Jury.class))).thenReturn(jury);

        JuryResponseDTO result = juryService.retirerMembre(1L, 1L);

        assertNotNull(result);
        verify(juryRepository).save(any(Jury.class));
    }

    @Test
    @DisplayName("delete supprime le jury")
    void delete_removesJury() {
        when(juryRepository.existsById(1L)).thenReturn(true);

        juryService.delete(1L);

        verify(juryRepository).deleteById(1L);
    }
}
