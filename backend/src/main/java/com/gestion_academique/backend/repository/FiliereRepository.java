package com.gestion_academique.backend.repository;

import com.gestion_academique.backend.entity.Filiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FiliereRepository extends JpaRepository<Filiere, Long> {
    boolean existsByNom(String nom);
}