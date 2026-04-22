package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.EntrepriseRequestDTO;
import com.gestion_academique.backend.dto.EntrepriseResponseDTO;
import com.gestion_academique.backend.entity.Entreprise;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.EntrepriseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EntrepriseService {

    private final EntrepriseRepository entrepriseRepository;

    public List<EntrepriseResponseDTO> getAll() {
        return entrepriseRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public EntrepriseResponseDTO getById(Long id) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entreprise non trouvée avec l'id: " + id));
        return toResponseDTO(entreprise);
    }

    public EntrepriseResponseDTO create(EntrepriseRequestDTO dto) {
        Entreprise entreprise = new Entreprise();
        entreprise.setNom(dto.getNom());
        entreprise.setSecteur(dto.getSecteur());
        entreprise.setAdresse(dto.getAdresse());
        entreprise.setEmailContact(dto.getEmailContact());

        Entreprise saved = entrepriseRepository.save(entreprise);
        return toResponseDTO(saved);
    }

    public EntrepriseResponseDTO update(Long id, EntrepriseRequestDTO dto) {
        Entreprise entreprise = entrepriseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entreprise non trouvée avec l'id: " + id));

        entreprise.setNom(dto.getNom());
        entreprise.setSecteur(dto.getSecteur());
        entreprise.setAdresse(dto.getAdresse());
        entreprise.setEmailContact(dto.getEmailContact());

        Entreprise saved = entrepriseRepository.save(entreprise);
        return toResponseDTO(saved);
    }

    public void delete(Long id) {
        if (!entrepriseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Entreprise non trouvée avec l'id: " + id);
        }
        entrepriseRepository.deleteById(id);
    }

    private EntrepriseResponseDTO toResponseDTO(Entreprise entreprise) {
        EntrepriseResponseDTO dto = new EntrepriseResponseDTO();
        dto.setSiretEntreprise(entreprise.getSiretEntreprise());
        dto.setNom(entreprise.getNom());
        dto.setSecteur(entreprise.getSecteur());
        dto.setAdresse(entreprise.getAdresse());
        dto.setEmailContact(entreprise.getEmailContact());
        return dto;
    }
}
