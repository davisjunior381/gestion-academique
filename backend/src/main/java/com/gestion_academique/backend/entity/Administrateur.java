package com.gestion_academique.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "administrateur")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Administrateur extends Utilisateur {

    @Column(name = "niveau_acces")
    private Integer niveauAcces;

    @Column(name = "secteur_gestion", length = 100)
    private String secteurGestion;

    @Column(name = "derniere_connexion")
    private LocalDateTime derniereConnexion;
}
