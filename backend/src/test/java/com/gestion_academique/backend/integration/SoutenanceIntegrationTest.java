package com.gestion_academique.backend.integration;

import com.gestion_academique.backend.entity.Stage;
import com.gestion_academique.backend.enums.StatutStage;
import com.gestion_academique.backend.repository.StageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.time.LocalDate;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests d'integration Soutenances (T-015).
 */
class SoutenanceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private StageRepository stageRepository;

    private Stage persistStage() {
        Stage s = new Stage();
        s.setTitre("Stage soutenance");
        s.setDateDebut(LocalDate.now().minusMonths(2));
        s.setDateFin(LocalDate.now().plusMonths(1));
        s.setDuree(12);
        s.setStatut(StatutStage.EN_COURS);
        return stageRepository.save(s);
    }

    @Test
    void create_validPayload_returns201AndPlanifiee() throws Exception {
        Stage stage = persistStage();
        String body = objectMapper.writeValueAsString(Map.of(
                "date", "2026-06-01T10:00:00", "salle", "A101", "duree", 30,
                "stageId", stage.getRefStage()));
        mockMvc.perform(post("/api/soutenances").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.refSoutenance").exists())
                .andExpect(jsonPath("$.statut").value("PLANIFIEE"))
                .andExpect(jsonPath("$.stageId").value(stage.getRefStage()));
    }

    @Test
    void create_duplicateForStage_returns400() throws Exception {
        Stage stage = persistStage();
        String body = objectMapper.writeValueAsString(Map.of(
                "date", "2026-06-01T10:00:00", "salle", "A101", "duree", 30,
                "stageId", stage.getRefStage()));
        mockMvc.perform(post("/api/soutenances").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated());
        // une seule soutenance autorisee par stage
        mockMvc.perform(post("/api/soutenances").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_missingDate_returns400() throws Exception {
        Stage stage = persistStage();
        String body = objectMapper.writeValueAsString(Map.of(
                "salle", "A101", "duree", 30, "stageId", stage.getRefStage()));
        mockMvc.perform(post("/api/soutenances").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_missingStageId_returns400() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "date", "2026-06-01T10:00:00", "salle", "A101", "duree", 30));
        mockMvc.perform(post("/api/soutenances").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_unknownStage_returns404() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "date", "2026-06-01T10:00:00", "salle", "A101", "duree", 30, "stageId", 99999));
        mockMvc.perform(post("/api/soutenances").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isNotFound());
    }

    @Test
    void getById_unknown_returns404() throws Exception {
        mockMvc.perform(get("/api/soutenances/{id}", 99999).with(authAdmin()))
                .andExpect(status().isNotFound());
    }

    @Test
    void delete_existing_returns204() throws Exception {
        Stage stage = persistStage();
        String body = objectMapper.writeValueAsString(Map.of(
                "date", "2026-06-01T10:00:00", "salle", "A101", "duree", 30,
                "stageId", stage.getRefStage()));
        String response = mockMvc.perform(post("/api/soutenances").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        Long id = objectMapper.readTree(response).get("refSoutenance").asLong();

        mockMvc.perform(delete("/api/soutenances/{id}", id).with(authAdmin()))
                .andExpect(status().isNoContent());
    }
}
