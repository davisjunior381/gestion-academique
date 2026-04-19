package com.gestion_academique.backend.repository;

import com.gestion_academique.backend.entity.Apprenant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApprenantRepository extends JpaRepository<Apprenant, Long>  {
}
