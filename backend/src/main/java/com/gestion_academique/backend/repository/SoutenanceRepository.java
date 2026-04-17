package com.gestion_academique.backend.repository;

import com.gestion_academique.backend.entity.Soutenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SoutenanceRepository extends JpaRepository<Soutenance, Long> {
    Optional<Soutenance> findByStageRefStage(Long stageId);
}
