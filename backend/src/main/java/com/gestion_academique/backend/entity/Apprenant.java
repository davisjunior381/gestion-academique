package com.gestion_academique.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "apprenant")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Apprenant extends Utilisateur {

    @Column(name = "num_etudiant", unique = true, length = 50)
    private String numEtudiant;

    @Column(name = "date_inscription")
    private LocalDate dateInscription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "filiere_id")
    private Filiere filiere;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @OneToMany(mappedBy = "apprenant")
    private Set<Stage> stages = new HashSet<>();

    @OneToMany(mappedBy = "apprenant")
    private Set<SuiviAcademique> suivisAcademiques = new HashSet<>();
}
