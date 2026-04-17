package com.gestion_academique.backend.repository;

import com.gestion_academique.backend.entity.Jury;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JuryRepository extends JpaRepository<Jury, Long> {
}
