package com.gestion_academique.backend.security.service;

import com.gestion_academique.backend.entity.Administrateur;
import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Role;
import com.gestion_academique.backend.entity.Utilisateur;
import com.gestion_academique.backend.repository.UtilisateurRepository;
import com.gestion_academique.backend.security.JwtProvider;
import com.gestion_academique.backend.security.UserDetailsImpl;
import com.gestion_academique.backend.security.dto.AuthResponseDto;
import com.gestion_academique.backend.security.dto.LoginRequestDTO;
import com.gestion_academique.backend.security.dto.RegisterRequestDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final AuthenticationManager authenticationManager;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public AuthResponseDto register(RegisterRequestDTO request) {

        // Vérifier si l'email existe déjà
        if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        // Chercher le rôle en base
        Role role = entityManager.createQuery(
                        "SELECT r FROM Role r WHERE r.nom = :nom", Role.class)
                .setParameter("nom", request.getRoleNom())
                .getSingleResult();

        Utilisateur user = switch (role.getNom()) {
            case "ADMIN"       -> new Administrateur();
            case "APPRENANT"   -> new Apprenant();
            case "ENSEIGNANT"  -> new Enseignant();
            default -> throw new RuntimeException("Rôle invalide : " + role.getNom());
        };

        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        user.setRole(role);

        utilisateurRepository.save(user);

        // Générer le token JWT
        String token = jwtProvider.generateAccessToken(user.getEmail(), role.getNom());

        return new AuthResponseDto(token, user.getEmail(), role.getNom(),
                user.getNom(), user.getPrenom());
    }

    public AuthResponseDto login(LoginRequestDTO request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Générer le token
        String token = jwtProvider.generateAccessToken(
                userDetails.getEmail(),
                userDetails.getRole()
        );

        return new AuthResponseDto(
                token,
                userDetails.getEmail(),
                userDetails.getRole(),
                null,  // nom non disponible dans UserDetailsImpl
                null   // prenom non disponible dans UserDetailsImpl
        );
    }
}