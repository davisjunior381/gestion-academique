package com.gestion_academique.backend.entity;

import com.gestion_academique.backend.enums.StatutRapport;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "rapport_stage")
@Data
@NoArgsConstructor
public class RapportStage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ref_rapport")
    private Long refRapport;

    @Column(name = "fichier_pdf", nullable = false, length = 500)
    private String fichierPdf;

    @Column(name = "date_depot", nullable = false)
    private LocalDate dateDepot;

    private Float note;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StatutRapport statut = StatutRapport.DEPOSE;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id", nullable = false, unique = true)
    private Stage stage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluateur_id")
    private Enseignant evaluateur;
}
