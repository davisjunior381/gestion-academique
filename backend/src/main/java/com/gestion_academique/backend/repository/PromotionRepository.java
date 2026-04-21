package com.gestion_academique.backend.repository;

import com.gestion_academique.backend.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    boolean existsByNom(String nom);
}