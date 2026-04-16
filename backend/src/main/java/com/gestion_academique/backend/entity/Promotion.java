package com.gestion_academique.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "promotion")
@Data
@NoArgsConstructor
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_promotion")
    private Long codePromotion;

    @NotNull
    @Column(nullable = false)
    private Integer annee;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String nom;
}
