package com.gestion_academique.backend.repository;

import com.gestion_academique.backend.entity.SuiviAcademique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuiviAcademiqueRepository extends JpaRepository<SuiviAcademique, Long> {
    List<SuiviAcademique> findByApprenantCodeUtilisateur(Long apprenantId);
    List<SuiviAcademique> findByApprenantCodeUtilisateurAndSemestre(Long apprenantId, String semestre);
}
