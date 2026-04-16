package com.gestion_academique.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "utilisateur")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
public abstract class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_utilisateur")
    private Long codeUtilisateur;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String nom;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String prenom;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @NotBlank
    @Column(name = "mot_de_passe", nullable = false, length = 255)
    private String motDePasse;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDate dateCreation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id")
    private Role role;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDate.now();
    }
}
