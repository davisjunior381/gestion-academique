package com.gestion_academique.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "enseignant")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Enseignant extends Utilisateur {

    @Column(length = 50)
    private String grade;

    @Column(length = 100)
    private String specialite;

    @Column(length = 100)
    private String departement;

    @ManyToMany
    @JoinTable(
        name = "enseignant_module",
        joinColumns = @JoinColumn(name = "enseignant_id"),
        inverseJoinColumns = @JoinColumn(name = "module_id")
    )
    private Set<Module> modules = new HashSet<>();

    @OneToMany(mappedBy = "encadrant")
    private Set<Stage> stagesEncadres = new HashSet<>();
}
