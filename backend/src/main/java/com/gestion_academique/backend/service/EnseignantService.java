package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.EnseignantRequestDTO;
import com.gestion_academique.backend.dto.EnseignantResponseDTO;
import com.gestion_academique.backend.dto.ModuleResponseDTO;
import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Module;
import com.gestion_academique.backend.entity.Role;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.EnseignantRepository;
import com.gestion_academique.backend.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EnseignantService {

    private final EnseignantRepository enseignantRepository;
    private final ModuleRepository moduleRepository;
    private final EntityManager entityManager;

    public List<EnseignantResponseDTO> getAll() {
        return enseignantRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public EnseignantResponseDTO getById(Long id) {
        Enseignant enseignant = enseignantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé avec l'id: " + id));
        return toResponseDTO(enseignant);
    }

    public List<EnseignantResponseDTO> getBySpecialite(String specialite) {
        return enseignantRepository.findBySpecialite(specialite).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public List<EnseignantResponseDTO> getByGrade(String grade) {
        return enseignantRepository.findByGrade(grade).stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public EnseignantResponseDTO create(EnseignantRequestDTO dto) {
        Enseignant enseignant = new Enseignant();
        enseignant.setNom(dto.getNom());
        enseignant.setPrenom(dto.getPrenom());
        enseignant.setEmail(dto.getEmail());
        enseignant.setMotDePasse(dto.getMotDePasse());
        enseignant.setGrade(dto.getGrade());
        enseignant.setSpecialite(dto.getSpecialite());
        enseignant.setDepartement(dto.getDepartement());

        if (dto.getRoleId() != null) {
            Role role = entityManager.find(Role.class, dto.getRoleId());
            if (role == null) throw new ResourceNotFoundException("Rôle non trouvé avec l'id: " + dto.getRoleId());
            enseignant.setRole(role);
        }

        Enseignant saved = enseignantRepository.save(enseignant);
        return toResponseDTO(saved);
    }

    public EnseignantResponseDTO update(Long id, EnseignantRequestDTO dto) {
        Enseignant enseignant = enseignantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé avec l'id: " + id));

        enseignant.setNom(dto.getNom());
        enseignant.setPrenom(dto.getPrenom());
        enseignant.setEmail(dto.getEmail());
        enseignant.setMotDePasse(dto.getMotDePasse());
        enseignant.setGrade(dto.getGrade());
        enseignant.setSpecialite(dto.getSpecialite());
        enseignant.setDepartement(dto.getDepartement());

        if (dto.getRoleId() != null) {
            Role role = entityManager.find(Role.class, dto.getRoleId());
            if (role == null) throw new ResourceNotFoundException("Rôle non trouvé avec l'id: " + dto.getRoleId());
            enseignant.setRole(role);
        }

        Enseignant saved = enseignantRepository.save(enseignant);
        return toResponseDTO(saved);
    }

    public List<ModuleResponseDTO> getModules(Long enseignantId) {
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé avec l'id: " + enseignantId));
        return enseignant.getModules().stream()
                .map(this::toModuleDTO)
                .collect(Collectors.toList());
    }

    public EnseignantResponseDTO affecterModule(Long enseignantId, Long moduleId) {
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé avec l'id: " + enseignantId));
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module non trouvé avec l'id: " + moduleId));

        enseignant.getModules().add(module);
        Enseignant saved = enseignantRepository.save(enseignant);
        return toResponseDTO(saved);
    }

    public EnseignantResponseDTO retirerModule(Long enseignantId, Long moduleId) {
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé avec l'id: " + enseignantId));
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException("Module non trouvé avec l'id: " + moduleId));

        enseignant.getModules().remove(module);
        Enseignant saved = enseignantRepository.save(enseignant);
        return toResponseDTO(saved);
    }

    public void delete(Long id) {
        if (!enseignantRepository.existsById(id)) {
            throw new ResourceNotFoundException("Enseignant non trouvé avec l'id: " + id);
        }
        enseignantRepository.deleteById(id);
    }

    private EnseignantResponseDTO toResponseDTO(Enseignant enseignant) {
        EnseignantResponseDTO dto = new EnseignantResponseDTO();
        dto.setCodeUtilisateur(enseignant.getCodeUtilisateur());
        dto.setNom(enseignant.getNom());
        dto.setPrenom(enseignant.getPrenom());
        dto.setEmail(enseignant.getEmail());
        dto.setGrade(enseignant.getGrade());
        dto.setSpecialite(enseignant.getSpecialite());
        dto.setDepartement(enseignant.getDepartement());
        dto.setDateCreation(enseignant.getDateCreation());

        if (enseignant.getRole() != null) {
            dto.setRoleNom(enseignant.getRole().getNom());
        }

        return dto;
    }

    private ModuleResponseDTO toModuleDTO(Module module) {
        ModuleResponseDTO dto = new ModuleResponseDTO();
        dto.setCodeModule(module.getCodeModule());
        dto.setNom(module.getNom());
        dto.setDescription(module.getDescription());
        return dto;
    }
}
