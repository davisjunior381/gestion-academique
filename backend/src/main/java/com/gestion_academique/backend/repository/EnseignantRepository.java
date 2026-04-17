package com.gestion_academique.backend.repository;

import com.gestion_academique.backend.entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    List<Enseignant> findBySpecialite(String specialite);
    List<Enseignant> findByGrade(String grade);
}
