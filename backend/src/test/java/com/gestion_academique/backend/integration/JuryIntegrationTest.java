package com.gestion_academique.backend.integration;

import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Jury;
import com.gestion_academique.backend.repository.EnseignantRepository;
import com.gestion_academique.backend.repository.JuryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests d'integration Jurys (T-015) : creation et gestion des membres.
 */
class JuryIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private JuryRepository juryRepository;

    @Autowired
    private EnseignantRepository enseignantRepository;

    private Jury persistJury() {
        Jury j = new Jury();
        j.setIntitule("Jury A");
        j.setRoleJury("PRESIDENT");
        return juryRepository.save(j);
    }

    private Enseignant persistEnseignant(String email) {
        Enseignant e = new Enseignant();
        e.setNom("Martin");
        e.setPrenom("Sophie");
        e.setEmail(email);
        e.setMotDePasse("pwd");
        return enseignantRepository.save(e);
    }

    @Test
    void create_returns201() throws Exception {
        String body = objectMapper.writeValueAsString(Map.of(
                "intitule", "Jury final", "roleJury", "PRESIDENT"));
        mockMvc.perform(post("/api/jurys").with(authAdmin())
                        .contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.codeJury").exists())
                .andExpect(jsonPath("$.intitule").value("Jury final"));
    }

    @Test
    void getById_unknown_returns404() throws Exception {
        mockMvc.perform(get("/api/jurys/{id}", 99999).with(authAdmin()))
                .andExpect(status().isNotFound());
    }

    @Test
    void ajouterMembre_returns200AndListsMember() throws Exception {
        Jury jury = persistJury();
        Enseignant ens = persistEnseignant("membre@test.fr");

        mockMvc.perform(post("/api/jurys/{id}/membres/{enseignantId}",
                        jury.getCodeJury(), ens.getCodeUtilisateur()).with(authAdmin()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.membresNoms[0]").value("Martin Sophie"));
    }

    @Test
    void ajouterMembre_unknownEnseignant_returns404() throws Exception {
        Jury jury = persistJury();
        mockMvc.perform(post("/api/jurys/{id}/membres/{enseignantId}",
                        jury.getCodeJury(), 99999).with(authAdmin()))
                .andExpect(status().isNotFound());
    }

    @Test
    void retirerMembre_returns200() throws Exception {
        Jury jury = persistJury();
        Enseignant ens = persistEnseignant("retire@test.fr");
        mockMvc.perform(post("/api/jurys/{id}/membres/{enseignantId}",
                        jury.getCodeJury(), ens.getCodeUtilisateur()).with(authAdmin()))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/jurys/{id}/membres/{enseignantId}",
                        jury.getCodeJury(), ens.getCodeUtilisateur()).with(authAdmin()))
                .andExpect(status().isOk());
    }

    @Test
    void delete_unknown_returns404() throws Exception {
        mockMvc.perform(delete("/api/jurys/{id}", 99999).with(authAdmin()))
                .andExpect(status().isNotFound());
    }
}
