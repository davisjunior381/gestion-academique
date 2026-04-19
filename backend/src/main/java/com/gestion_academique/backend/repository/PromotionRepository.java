package com.gestion_academique.backend.repository;

import com.gestion_academique.backend.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {
}