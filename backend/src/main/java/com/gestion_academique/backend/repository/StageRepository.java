package com.gestion_academique.backend.repository;

import com.gestion_academique.backend.entity.Stage;
import com.gestion_academique.backend.enums.StatutStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StageRepository extends JpaRepository<Stage, Long> {
    List<Stage> findByStatut(StatutStage statut);
    List<Stage> findByApprenantCodeUtilisateur(Long apprenantId);
    List<Stage> findByEncadrantCodeUtilisateur(Long encadrantId);
    List<Stage> findByEntrepriseSiretEntreprise(Long entrepriseId);
}
