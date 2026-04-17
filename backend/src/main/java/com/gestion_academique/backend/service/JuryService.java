package com.gestion_academique.backend.service;

import com.gestion_academique.backend.dto.JuryRequestDTO;
import com.gestion_academique.backend.dto.JuryResponseDTO;
import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Jury;
import com.gestion_academique.backend.exception.ResourceNotFoundException;
import com.gestion_academique.backend.repository.EnseignantRepository;
import com.gestion_academique.backend.repository.JuryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class JuryService {

    private final JuryRepository juryRepository;
    private final EnseignantRepository enseignantRepository;

    public List<JuryResponseDTO> getAll() {
        return juryRepository.findAll().stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    public JuryResponseDTO getById(Long id) {
        Jury jury = juryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jury non trouvé avec l'id: " + id));
        return toResponseDTO(jury);
    }

    public JuryResponseDTO create(JuryRequestDTO dto) {
        Jury jury = new Jury();
        jury.setIntitule(dto.getIntitule());
        jury.setRoleJury(dto.getRoleJury());
        jury.setDateConstitution(LocalDate.now());

        Jury saved = juryRepository.save(jury);
        return toResponseDTO(saved);
    }

    public JuryResponseDTO update(Long id, JuryRequestDTO dto) {
        Jury jury = juryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jury non trouvé avec l'id: " + id));

        jury.setIntitule(dto.getIntitule());
        jury.setRoleJury(dto.getRoleJury());

        Jury saved = juryRepository.save(jury);
        return toResponseDTO(saved);
    }

    public JuryResponseDTO ajouterMembre(Long juryId, Long enseignantId) {
        Jury jury = juryRepository.findById(juryId)
                .orElseThrow(() -> new ResourceNotFoundException("Jury non trouvé avec l'id: " + juryId));
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé avec l'id: " + enseignantId));

        jury.getMembres().add(enseignant);
        Jury saved = juryRepository.save(jury);
        return toResponseDTO(saved);
    }

    public JuryResponseDTO retirerMembre(Long juryId, Long enseignantId) {
        Jury jury = juryRepository.findById(juryId)
                .orElseThrow(() -> new ResourceNotFoundException("Jury non trouvé avec l'id: " + juryId));
        Enseignant enseignant = enseignantRepository.findById(enseignantId)
                .orElseThrow(() -> new ResourceNotFoundException("Enseignant non trouvé avec l'id: " + enseignantId));

        jury.getMembres().remove(enseignant);
        Jury saved = juryRepository.save(jury);
        return toResponseDTO(saved);
    }

    public void delete(Long id) {
        if (!juryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Jury non trouvé avec l'id: " + id);
        }
        juryRepository.deleteById(id);
    }

    private JuryResponseDTO toResponseDTO(Jury jury) {
        JuryResponseDTO dto = new JuryResponseDTO();
        dto.setCodeJury(jury.getCodeJury());
        dto.setIntitule(jury.getIntitule());
        dto.setDateConstitution(jury.getDateConstitution());
        dto.setRoleJury(jury.getRoleJury());
        dto.setMembresNoms(jury.getMembres().stream()
                .map(e -> e.getNom() + " " + e.getPrenom())
                .collect(Collectors.toList()));
        return dto;
    }
}
