package com.gestion_academique.backend.security.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDto {

    private String token;
    private String email;
    private String role;
    private String nom;
    private String prenom;
}