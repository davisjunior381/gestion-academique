package com.gestion_academique.backend.repository;

import com.gestion_academique.backend.entity.RapportStage;
import com.gestion_academique.backend.enums.StatutRapport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RapportStageRepository extends JpaRepository<RapportStage, Long> {
    Optional<RapportStage> findByStageRefStage(Long stageId);
    List<RapportStage> findByStatut(StatutRapport statut);
    List<RapportStage> findByEvaluateurCodeUtilisateur(Long evaluateurId);
}
