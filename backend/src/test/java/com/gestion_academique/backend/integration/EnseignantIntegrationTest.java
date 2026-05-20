package com.gestion_academique.backend.integration;

import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Module;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests d'integration Enseignants (T-010) + affectation aux modules (T-011).
 * Les fixtures persistEnseignant/persistModule sont heritees d'AbstractIntegrationTest.
 */
class EnseignantIntegrationTest extends AbstractIntegrationTest {

    // --- Creation (T-010) ---

    @Test
    void create_validPayload_returns201() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "nom", "Durand", "prenom", "Paul",
                "email", "paul.durand@test.fr", "motDePasse", "pwd123"));
        mockMvc.perform(post("/api/enseignants").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.codeUtilisateur").exists())
                .andExpect(jsonPath("$.email").value("paul.durand@test.fr"));
    }

    @Test
    void create_invalidEmail_returns400() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "nom", "Durand", "prenom", "Paul",
                "email", "pas-un-email", "motDePasse", "pwd123"));
        mockMvc.perform(post("/api/enseignants").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_missingNom_returns400() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "prenom", "Paul", "email", "paul2@test.fr", "motDePasse", "pwd123"));
        mockMvc.perform(post("/api/enseignants").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_withUnknownRoleId_returns404() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "nom", "Durand", "prenom", "Paul",
                "email", "paul3@test.fr", "motDePasse", "pwd123", "roleId", 99999));
        mockMvc.perform(post("/api/enseignants").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isNotFound());
    }

    // --- Lecture / suppression (T-010) ---

    @Test
    void getById_existing_returns200() throws Exception {
        Enseignant e = persistEnseignant("get.one@test.fr");
        mockMvc.perform(get("/api/enseignants/{id}", e.getCodeUtilisateur()).with(authAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("get.one@test.fr"));
    }

    @Test
    void getById_unknown_returns404() throws Exception {
        mockMvc.perform(get("/api/enseignants/{id}", 99999).with(authAdmin()))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_existing_returns204() throws Exception {
        Enseignant e = persistEnseignant("del@test.fr");
        mockMvc.perform(delete("/api/enseignants/{id}", e.getCodeUtilisateur()).with(authAdmin()))
                .andExpect(status().isNoContent());
    }

    // --- Affectation aux modules (T-011) ---

    @Test
    void affecterModule_returns200ThenListed() throws Exception {
        Enseignant e = persistEnseignant("affect@test.fr");
        Module m = persistModule("Algorithmique");

        mockMvc.perform(post("/api/enseignants/{id}/modules/{moduleId}",
                        e.getCodeUtilisateur(), m.getCodeModule()).with(authAdmin()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/enseignants/{id}/modules", e.getCodeUtilisateur()).with(authAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nom").value("Algorithmique"));
    }

    @Test
    void affecterModule_unknownModule_returns404() throws Exception {
        Enseignant e = persistEnseignant("affect404@test.fr");
        mockMvc.perform(post("/api/enseignants/{id}/modules/{moduleId}",
                        e.getCodeUtilisateur(), 99999).with(authAdmin()))
                .andExpect(status().isNotFound());
    }

    // --- Securite ---

    @Test
    void getAll_withoutAuth_returns401() throws Exception {
        mockMvc.perform(get("/api/enseignants"))
                .andExpect(status().isUnauthorized());
    }
}
