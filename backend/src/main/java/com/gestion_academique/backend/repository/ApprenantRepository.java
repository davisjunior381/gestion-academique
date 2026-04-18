package com.gestion_academique.backend.repository;

import com.gestion_academique.backend.entity.Apprenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprenantRepository extends JpaRepository<Apprenant, Long> {
    List<Apprenant> findByFiliereCodeFiliere(Long filiereId);
    List<Apprenant> findByPromotionCodePromotion(Long promotionId);
}
