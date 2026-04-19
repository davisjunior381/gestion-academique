package com.gestion_academique.backend.security;

import com.gestion_academique.backend.entity.Utilisateur;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String email;

    @Getter(AccessLevel.NONE)
    private String motDePasse;

    private String role;

    @Getter(AccessLevel.NONE)
    private Collection<? extends GrantedAuthority> authorities;

    public static UserDetailsImpl build(Utilisateur utilisateur) {
        String roleName = utilisateur.getRole() != null
                ? utilisateur.getRole().getNom()
                : "USER";

        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + roleName)
        );

        return new UserDetailsImpl(
                utilisateur.getCodeUtilisateur(),
                utilisateur.getEmail(),
                utilisateur.getMotDePasse(),
                roleName,
                authorities
        );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return motDePasse;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}