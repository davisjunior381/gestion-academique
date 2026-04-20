package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.FiliereDTo;
import com.gestion_academique.backend.entity.Filiere;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.FiliereRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FiliereService {
    private final FiliereRepository filiereRepository;

    public List<Filiere> findAll() {
        return filiereRepository.findAll();
    }

    public Filiere findById(Long id) {
        return filiereRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Filiere", "id", id));
    }

    public Filiere create(FiliereDTo dto) {
        Filiere filiere = new Filiere();
        filiere.setNom(dto.getNom());
        filiere.setDescription(dto.getDescription());
        return filiereRepository.save(filiere);
    }

    public void delete(Long id) {
        findById(id);
        filiereRepository.deleteById(id);
    }
}
