package com.gestion_academique.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "jury")
@Data
@NoArgsConstructor
public class Jury {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_jury")
    private Long codeJury;

    @Column(length = 200)
    private String intitule;

    @Column(name = "date_constitution")
    private LocalDate dateConstitution;

    @Column(name = "role_jury", length = 50)
    private String roleJury;

    @ManyToMany
    @JoinTable(
        name = "jury_enseignant",
        joinColumns = @JoinColumn(name = "jury_id"),
        inverseJoinColumns = @JoinColumn(name = "enseignant_id")
    )
    private Set<Enseignant> membres = new HashSet<>();
}
