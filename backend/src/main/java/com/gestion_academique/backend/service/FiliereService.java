package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.FiliereRequestDTO;
import com.gestion_academique.backend.dto.FiliereResponseDTO;
import com.gestion_academique.backend.entity.Filiere;
import com.gestion_academique.backend.repository.FiliereRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FiliereService {

    private final FiliereRepository filiereRepository;

    public List<FiliereResponseDTO> getAll() {
        return filiereRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public FiliereResponseDTO getById(Long id) {
        return toDTO(findOrThrow(id));
    }

    public FiliereResponseDTO create(FiliereRequestDTO dto) {
        Filiere filiere = new Filiere();
        filiere.setNom(dto.getNom());
        filiere.setDescription(dto.getDescription());
        return toDTO(filiereRepository.save(filiere));
    }

    public FiliereResponseDTO update(Long id, FiliereRequestDTO dto) {
        Filiere filiere = findOrThrow(id);
        filiere.setNom(dto.getNom());
        filiere.setDescription(dto.getDescription());
        return toDTO(filiereRepository.save(filiere));
    }

    public void delete(Long id) {
        findOrThrow(id);
        filiereRepository.deleteById(id);
    }

    public Filiere findOrThrow(Long id) {
        return filiereRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Filière non trouvée avec l'id : " + id));
    }

    private FiliereResponseDTO toDTO(Filiere f) {
        FiliereResponseDTO dto = new FiliereResponseDTO();
        dto.setCodeFiliere(f.getCodeFiliere());
        dto.setNom(f.getNom());
        dto.setDescription(f.getDescription());
        return dto;
    }
}