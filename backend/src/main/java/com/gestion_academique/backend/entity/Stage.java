package com.gestion_academique.backend.entity;

import com.gestion_academique.backend.enums.StatutStage;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "stage")
@Data
@NoArgsConstructor
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ref_stage")
    private Long refStage;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String titre;

    @NotNull
    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @NotNull
    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    @NotNull
    @Column(nullable = false)
    private Integer duree;

    @Column(columnDefinition = "TEXT")
    private String objectif;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutStage statut = StatutStage.EN_COURS;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "apprenant_id")
    private Apprenant apprenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encadrant_id")
    private Enseignant encadrant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entreprise_id")
    private Entreprise entreprise;

    @OneToOne(mappedBy = "stage", cascade = CascadeType.ALL)
    private RapportStage rapport;

    @OneToOne(mappedBy = "stage", cascade = CascadeType.ALL)
    private Soutenance soutenance;
}
