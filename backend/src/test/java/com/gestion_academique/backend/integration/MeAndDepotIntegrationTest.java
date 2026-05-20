package com.gestion_academique.backend.integration;

import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.RapportStage;
import com.gestion_academique.backend.entity.Stage;
import com.gestion_academique.backend.enums.StatutRapport;
import com.gestion_academique.backend.enums.StatutStage;
import com.gestion_academique.backend.repository.RapportStageRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests d'integration des ajouts PR #31 :
 *  - filtrage /me par utilisateur connecte (stages + rapports)
 *  - depot de rapport restreint a l'apprenant proprietaire du stage
 * persistApprenant/persistStage sont herites d'AbstractIntegrationTest.
 */
class MeAndDepotIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private RapportStageRepository rapportRepository;

    private RapportStage persistRapport(Stage stage) {
        RapportStage r = new RapportStage();
        r.setStage(stage);
        r.setFichierPdf("uploads/rapports/existant.pdf");
        r.setDateDepot(LocalDate.now());
        r.setStatut(StatutRapport.DEPOSE);
        return rapportRepository.save(r);
    }

    private MockMultipartFile pdf() {
        return new MockMultipartFile("fichier", "rapport.pdf",
                "application/pdf", "%PDF-1.4 contenu de test".getBytes());
    }

    // --- GET /stages/me et /rapports/me ---

    @Test
    void stagesMe_apprenant_returnsOnlyOwnStages() throws Exception {
        Apprenant a = persistApprenant("a@test.fr");
        Apprenant b = persistApprenant("b@test.fr");
        persistStage(a, StatutStage.EN_COURS);
        persistStage(b, StatutStage.EN_COURS);

        mockMvc.perform(get("/api/stages/me").with(auth(a.getCodeUtilisateur(), "a@test.fr", "APPRENANT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].apprenantId").value(a.getCodeUtilisateur()));
    }

    @Test
    void rapportsMe_apprenant_returnsOnlyOwnReports() throws Exception {
        Apprenant a = persistApprenant("ra@test.fr");
        Apprenant b = persistApprenant("rb@test.fr");
        persistRapport(persistStage(a, StatutStage.TERMINE));
        persistRapport(persistStage(b, StatutStage.TERMINE));

        mockMvc.perform(get("/api/rapports/me").with(auth(a.getCodeUtilisateur(), "ra@test.fr", "APPRENANT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void stagesMe_admin_returnsEmpty() throws Exception {
        // Edge (correctif review) : pour un role autre qu'apprenant/enseignant, /me renvoie une liste vide
        Apprenant a = persistApprenant("admincase@test.fr");
        persistStage(a, StatutStage.EN_COURS);

        mockMvc.perform(get("/api/stages/me").with(authAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void rapportsMe_admin_returnsEmpty() throws Exception {
        Apprenant a = persistApprenant("admincase2@test.fr");
        persistRapport(persistStage(a, StatutStage.TERMINE));

        mockMvc.perform(get("/api/rapports/me").with(authAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    // --- POST /rapports/deposer/{stageId} ---

    @Test
    void deposer_apprenantOnOwnStage_returns201() throws Exception {
        Apprenant a = persistApprenant("dep.ok@test.fr");
        Stage stage = persistStage(a, StatutStage.EN_COURS);

        mockMvc.perform(multipart("/api/rapports/deposer/{stageId}", stage.getRefStage())
                        .file(pdf())
                        .with(auth(a.getCodeUtilisateur(), "dep.ok@test.fr", "APPRENANT")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.statut").value("DEPOSE"));
    }

    @Test
    void deposer_onOtherApprenantStage_returns403() throws Exception {
        Apprenant a = persistApprenant("dep.a@test.fr");
        Apprenant b = persistApprenant("dep.b@test.fr");
        Stage stageB = persistStage(b, StatutStage.EN_COURS);

        // A tente de deposer sur le stage de B
        mockMvc.perform(multipart("/api/rapports/deposer/{stageId}", stageB.getRefStage())
                        .file(pdf())
                        .with(auth(a.getCodeUtilisateur(), "dep.a@test.fr", "APPRENANT")))
                .andExpect(status().isForbidden());
    }

    @Test
    void deposer_asEnseignant_returns403() throws Exception {
        Apprenant a = persistApprenant("dep.ens@test.fr");
        Stage stage = persistStage(a, StatutStage.EN_COURS);

        // @PreAuthorize("hasRole('APPRENANT')") doit bloquer un enseignant
        mockMvc.perform(multipart("/api/rapports/deposer/{stageId}", stage.getRefStage())
                        .file(pdf())
                        .with(auth(500L, "prof@test.fr", "ENSEIGNANT")))
                .andExpect(status().isForbidden());
    }

    @Test
    void deposer_duplicateReport_returns400() throws Exception {
        Apprenant a = persistApprenant("dep.dup@test.fr");
        Stage stage = persistStage(a, StatutStage.EN_COURS);
        persistRapport(stage); // un rapport existe deja pour ce stage

        mockMvc.perform(multipart("/api/rapports/deposer/{stageId}", stage.getRefStage())
                        .file(pdf())
                        .with(auth(a.getCodeUtilisateur(), "dep.dup@test.fr", "APPRENANT")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deposer_nonPdfFile_returns400() throws Exception {
        Apprenant a = persistApprenant("dep.txt@test.fr");
        Stage stage = persistStage(a, StatutStage.EN_COURS);
        MockMultipartFile txt = new MockMultipartFile("fichier", "rapport.txt",
                "text/plain", "pas un pdf".getBytes());

        mockMvc.perform(multipart("/api/rapports/deposer/{stageId}", stage.getRefStage())
                        .file(txt)
                        .with(auth(a.getCodeUtilisateur(), "dep.txt@test.fr", "APPRENANT")))
                .andExpect(status().isBadRequest());
    }
}
