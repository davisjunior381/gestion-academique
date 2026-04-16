package com.gestion_academique.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entreprise")
@Data
@NoArgsConstructor
public class Entreprise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "siret_entreprise")
    private Long siretEntreprise;

    @NotBlank
    @Column(nullable = false, length = 200)
    private String nom;

    @Column(length = 100)
    private String secteur;

    @Column(columnDefinition = "TEXT")
    private String adresse;

    @Email
    @Column(name = "email_contact", length = 255)
    private String emailContact;
}
