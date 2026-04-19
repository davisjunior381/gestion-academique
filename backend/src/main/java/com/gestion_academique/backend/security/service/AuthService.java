package com.gestion_academique.backend.security.service;

import com.gestion_academique.backend.security.dto.AuthResponseDto;
import com.gestion_academique.backend.security.dto.LoginRequestDTO;
import com.gestion_academique.backend.security.dto.RegisterRequestDTO;
import com.gestion_academique.backend.entity.Administrateur;
import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Role;
import com.gestion_academique.backend.entity.Utilisateur;
import com.gestion_academique.backend.repository.UtilisateurRepository;
import com.gestion_academique.backend.security.JwtProvider;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public AuthResponseDto register(RegisterRequestDTO request) {
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email déjà utilisé: " + request.getEmail());
        }

        Role role;
        try {
            role = entityManager.createQuery(
                            "SELECT r FROM Role r WHERE r.nom = :nom", Role.class)
                    .setParameter("nom", request.getRoleNom())
                    .getSingleResult();
        } catch (NoResultException e) {
            throw new IllegalArgumentException("Rôle introuvable: " + request.getRoleNom());
        }

        Utilisateur user = switch (role.getNom()) {
            case "ADMIN" -> new Administrateur();
            case "APPRENANT" -> new Apprenant();
            case "ENSEIGNANT" -> new Enseignant();
            default -> throw new IllegalArgumentException("Rôle invalide: " + role.getNom());
        };

        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setRole(role);

        Utilisateur saved = utilisateurRepository.save(user);

        String token = jwtProvider.generateAccessToken(saved.getEmail(), role.getNom());

        return new AuthResponseDto(token, saved.getEmail(), role.getNom(),
                saved.getNom(), saved.getPrenom());
    }

    public AuthResponseDto login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Utilisateur non trouvé: " + request.getEmail()));

        String roleName = utilisateur.getRole() != null
                ? utilisateur.getRole().getNom()
                : "USER";

        String token = jwtProvider.generateAccessToken(utilisateur.getEmail(), roleName);

        return new AuthResponseDto(token, utilisateur.getEmail(), roleName,
                utilisateur.getNom(), utilisateur.getPrenom());
    }
}