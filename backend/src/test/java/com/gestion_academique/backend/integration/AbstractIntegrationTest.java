package com.gestion_academique.backend.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Module;
import com.gestion_academique.backend.entity.Stage;
import com.gestion_academique.backend.enums.StatutStage;
import com.gestion_academique.backend.repository.ApprenantRepository;
import com.gestion_academique.backend.repository.EnseignantRepository;
import com.gestion_academique.backend.repository.ModuleRepository;
import com.gestion_academique.backend.repository.StageRepository;
import com.gestion_academique.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Base commune aux tests d'integration : contexte Spring complet + MockMvc + base H2,
 * transaction rollback apres chaque test pour l'isolation.
 * Centralise les fixtures et l'authentification simulee reutilisees par les sous-classes.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public abstract class AbstractIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    protected ApprenantRepository apprenantRepository;

    @Autowired
    protected EnseignantRepository enseignantRepository;

    @Autowired
    protected StageRepository stageRepository;

    @Autowired
    protected ModuleRepository moduleRepository;

    // --- Fixtures partagees ---

    protected Apprenant persistApprenant(String email) {
        Apprenant a = new Apprenant();
        a.setNom("Leclerc");
        a.setPrenom("Alice");
        a.setEmail(email);
        a.setMotDePasse("pwd");
        return apprenantRepository.save(a);
    }

    protected Enseignant persistEnseignant(String email) {
        Enseignant e = new Enseignant();
        e.setNom("Martin");
        e.setPrenom("Sophie");
        e.setEmail(email);
        e.setMotDePasse("pwd");
        return enseignantRepository.save(e);
    }

    protected Module persistModule(String nom) {
        Module m = new Module();
        m.setNom(nom);
        m.setDescription("Module de test");
        return moduleRepository.save(m);
    }

    /** Stage de test ; {@code apprenant} peut etre null lorsqu'il n'est pas pertinent. */
    protected Stage persistStage(Apprenant apprenant, StatutStage statut) {
        Stage s = new Stage();
        s.setTitre("Stage de test");
        s.setDateDebut(LocalDate.now().minusMonths(2));
        s.setDateFin(LocalDate.now().plusMonths(1));
        s.setDuree(12);
        s.setStatut(statut);
        s.setApprenant(apprenant);
        return stageRepository.save(s);
    }

    // --- Authentification simulee (sans vrai JWT) ---

    protected RequestPostProcessor auth(Long id, String email, String role) {
        UserDetailsImpl principal = new UserDetailsImpl(
                id, email, "pwd", role,
                List.of(new SimpleGrantedAuthority("ROLE_" + role)));
        return SecurityMockMvcRequestPostProcessors.authentication(
                new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities()));
    }

    /** Utilisateur admin authentifie, pour les endpoints qui exigent juste d'etre connecte. */
    protected RequestPostProcessor authAdmin() {
        return auth(999L, "admin@test.fr", "ADMIN");
    }
}
