package com.gestion_academique.backend.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestion_academique.backend.entity.Role;
import com.gestion_academique.backend.security.UserDetailsImpl;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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

import java.util.List;

/**
 * Base commune aux tests d'integration : contexte Spring complet + MockMvc + base H2,
 * transaction rollback apres chaque test pour l'isolation.
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

    @PersistenceContext
    protected EntityManager em;

    /** Cree et persiste un role (il n'existe pas de RoleRepository dans le projet). */
    protected Role persistRole(String nom) {
        Role role = new Role();
        role.setNom(nom);
        em.persist(role);
        return role;
    }

    /** Injecte une authentification (UserDetailsImpl) sans passer par un vrai JWT. */
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
