package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.ModuleRequestDTO;
import com.gestion_academique.backend.dto.ModuleResponseDTO;
import com.gestion_academique.backend.entity.Module;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service CRUD pour les modules.
 * Les modules sont rattaches aux enseignants via {@code Enseignant.modules} (relation Many-to-Many).
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public List<ModuleResponseDTO> getAll() {
        return moduleRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ModuleResponseDTO getById(Long id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module non trouve avec l'id : " + id));
        return toResponseDTO(module);
    }

    public ModuleResponseDTO create(ModuleRequestDTO dto) {
        Module module = new Module();
        module.setNom(dto.getNom());
        module.setDescription(dto.getDescription());
        Module saved = moduleRepository.save(module);
        return toResponseDTO(saved);
    }

    public ModuleResponseDTO update(Long id, ModuleRequestDTO dto) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module non trouve avec l'id : " + id));
        module.setNom(dto.getNom());
        module.setDescription(dto.getDescription());
        Module saved = moduleRepository.save(module);
        return toResponseDTO(saved);
    }

    public void delete(Long id) {
        if (!moduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Module non trouve avec l'id : " + id);
        }
        moduleRepository.deleteById(id);
    }

    private ModuleResponseDTO toResponseDTO(Module module) {
        ModuleResponseDTO dto = new ModuleResponseDTO();
        dto.setCodeModule(module.getCodeModule());
        dto.setNom(module.getNom());
        dto.setDescription(module.getDescription());
        return dto;
    }
}
