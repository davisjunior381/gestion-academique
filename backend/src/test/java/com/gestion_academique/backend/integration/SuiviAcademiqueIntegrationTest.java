package com.gestion_academique.backend.integration;

import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.SuiviAcademique;
import com.gestion_academique.backend.repository.SuiviAcademiqueRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests d'integration Suivi academique (T-016).
 * persistApprenant est herite d'AbstractIntegrationTest.
 */
class SuiviAcademiqueIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private SuiviAcademiqueRepository suiviRepository;

    private SuiviAcademique persistSuivi(Apprenant a, String semestre, float moyenne) {
        SuiviAcademique s = new SuiviAcademique();
        s.setApprenant(a);
        s.setSemestre(semestre);
        s.setMoyenne(moyenne);
        s.setAppreciation("Bon trimestre");
        return suiviRepository.save(s);
    }

    @Test
    void create_validPayload_returns201() throws Exception {
        Apprenant a = persistApprenant("suivi.create@test.fr");
        String body = objectMapper.writeValueAsString(Map.of(
                "moyenne", 14.5, "appreciation", "Tres bien", "semestre", "S1",
                "apprenantId", a.getCodeUtilisateur()));
        mockMvc.perform(post("/api/suivi-academique").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.codeSuivi").exists())
                .andExpect(jsonPath("$.apprenantId").value(a.getCodeUtilisateur()));
    }

    @Test
    void create_unknownApprenant_returns404() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "moyenne", 14.5, "appreciation", "x", "semestre", "S1", "apprenantId", 99999));
        mockMvc.perform(post("/api/suivi-academique").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isNotFound());
    }

    @Test
    void create_missingMoyenne_returns400() throws Exception {
        Apprenant a = persistApprenant("suivi.nomoy@test.fr");
        String body = objectMapper.writeValueAsString(Map.of(
                "appreciation", "x", "semestre", "S1", "apprenantId", a.getCodeUtilisateur()));
        mockMvc.perform(post("/api/suivi-academique").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_missingSemestre_returns400() throws Exception {
        Apprenant a = persistApprenant("suivi.nosem@test.fr");
        String body = objectMapper.writeValueAsString(Map.of(
                "moyenne", 12.0, "appreciation", "x", "apprenantId", a.getCodeUtilisateur()));
        mockMvc.perform(post("/api/suivi-academique").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getByApprenant_returnsList() throws Exception {
        Apprenant a = persistApprenant("suivi.list@test.fr");
        persistSuivi(a, "S1", 15f);
        persistSuivi(a, "S2", 13f);
        mockMvc.perform(get("/api/suivi-academique/apprenant/{id}", a.getCodeUtilisateur()).with(authAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void getById_unknown_returns404() throws Exception {
        mockMvc.perform(get("/api/suivi-academique/{id}", 99999).with(authAdmin()))
                .andExpect(status().isNotFound());
    }

    @Test
    void moyenne_returnsComputedAverage() throws Exception {
        Apprenant a = persistApprenant("suivi.moy@test.fr");
        persistSuivi(a, "S1", 16f);
        persistSuivi(a, "S1", 14f);
        mockMvc.perform(get("/api/suivi-academique/apprenant/{id}/moyenne", a.getCodeUtilisateur())
                        .with(authAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.moyenneGenerale").value(15.0))
                .andExpect(jsonPath("$.nombreSuivis").value(2));
    }
}
