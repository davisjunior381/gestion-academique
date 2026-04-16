package com.gestion_academique.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "soutenance")
@Data
@NoArgsConstructor
public class Soutenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ref_soutenance")
    private Long refSoutenance;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime date;

    @Column(length = 50)
    private String salle;

    private Integer duree;

    @Column(length = 50)
    private String statut;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stage_id", nullable = false, unique = true)
    private Stage stage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jury_id")
    private Jury jury;
}
