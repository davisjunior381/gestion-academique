package com.gestion_academique.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "suivi_academique")
@Data
@NoArgsConstructor
public class SuiviAcademique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_suivi")
    private Long codeSuivi;

    private Float moyenne;

    @Column(columnDefinition = "TEXT")
    private String appreciation;

    @Column(length = 50)
    private String semestre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apprenant_id", nullable = false)
    private Apprenant apprenant;
}
