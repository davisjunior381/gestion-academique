package com.gestion_academique.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class JuryResponseDTO {

    private Long codeJury;
    private String intitule;
    private LocalDate dateConstitution;
    private String roleJury;
    private List<String> membresNoms;
}
