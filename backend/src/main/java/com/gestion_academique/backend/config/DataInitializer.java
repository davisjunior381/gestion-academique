package com.gestion_academique.backend.config;

import com.gestion_academique.backend.entity.Administrateur;
import com.gestion_academique.backend.entity.Apprenant;
import com.gestion_academique.backend.entity.Enseignant;
import com.gestion_academique.backend.entity.Filiere;
import com.gestion_academique.backend.entity.Jury;
import com.gestion_academique.backend.entity.Module;
import com.gestion_academique.backend.entity.Promotion;
import com.gestion_academique.backend.entity.RapportStage;
import com.gestion_academique.backend.entity.Role;
import com.gestion_academique.backend.entity.Soutenance;
import com.gestion_academique.backend.entity.Stage;
import com.gestion_academique.backend.entity.SuiviAcademique;
import com.gestion_academique.backend.enums.StatutStage;
import com.gestion_academique.backend.enums.StatutRapport;
import com.gestion_academique.backend.repository.ApprenantRepository;
import com.gestion_academique.backend.repository.EnseignantRepository;
import com.gestion_academique.backend.repository.FiliereRepository;
import com.gestion_academique.backend.repository.JuryRepository;
import com.gestion_academique.backend.repository.ModuleRepository;
import com.gestion_academique.backend.repository.PromotionRepository;
import com.gestion_academique.backend.repository.RapportStageRepository;
import com.gestion_academique.backend.repository.SoutenanceRepository;
import com.gestion_academique.backend.repository.StageRepository;
import com.gestion_academique.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;

@Component
@Profile("demo")
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final EnseignantRepository enseignantRepository;
    private final ApprenantRepository apprenantRepository;
    private final FiliereRepository filiereRepository;
    private final PromotionRepository promotionRepository;
    private final ModuleRepository moduleRepository;
    private final StageRepository stageRepository;
    private final RapportStageRepository rapportRepository;
    private final SoutenanceRepository soutenanceRepository;
    private final JuryRepository juryRepository;
    private final PasswordEncoder passwordEncoder;

    private final jakarta.persistence.EntityManager entityManager;

    @Override
    public void run(String... args) {
        if (utilisateurRepository.count() > 0) {
            System.out.println("BD deja initialisee, skip.");
            return;
        }

        System.out.println("Initialisation des donnees de demo...");

        // Roles
        Role roleAdmin = createRole("ADMIN");
        Role roleEnseignant = createRole("ENSEIGNANT");
        Role roleApprenant = createRole("APPRENANT");

        // Admin
        Administrateur admin = new Administrateur();
        admin.setNom("Admin");
        admin.setPrenom("Systeme");
        admin.setEmail("admin@sygle.fr");
        admin.setMotDePasse(passwordEncoder.encode("admin123!"));
        admin.setRole(roleAdmin);
        utilisateurRepository.save(admin);

        // Enseignants
        Enseignant ens1 = createEnseignant("Dupont", "Jean", "jean.dupont@sygle.fr",
                "MCF", "Informatique", "Sciences", roleEnseignant);
        Enseignant ens2 = createEnseignant("Martin", "Sophie", "sophie.martin@sygle.fr",
                "PR", "Genie logiciel", "Sciences", roleEnseignant);

        // Filieres et promotions
        Filiere filInfo = new Filiere();
        filInfo.setNom("Informatique");
        filInfo.setDescription("Filiere informatique et systemes d'information");
        filiereRepository.save(filInfo);

        Filiere filGenie = new Filiere();
        filGenie.setNom("Genie civil");
        filGenie.setDescription("Filiere genie civil et construction");
        filiereRepository.save(filGenie);

        Filiere filElec = new Filiere();
        filElec.setNom("Electronique");
        filElec.setDescription("Filiere electronique et systemes embarques");
        filiereRepository.save(filElec);

        Promotion promo2025 = new Promotion();
        promo2025.setNom("Promotion 2025-2026");
        promo2025.setAnnee(2025);
        promotionRepository.save(promo2025);

        Promotion promo2024 = new Promotion();
        promo2024.setNom("Promotion 2024-2025");
        promo2024.setAnnee(2024);
        promotionRepository.save(promo2024);

        Promotion promo2023 = new Promotion();
        promo2023.setNom("Promotion 2023-2024");
        promo2023.setAnnee(2023);
        promotionRepository.save(promo2023);

        // Modules
        Module modJava = createModule("Java Avance", "Programmation orientee objet avec Java");
        Module modWeb = createModule("Technologies Web", "HTML, CSS, JavaScript, React");
        Module modBdd = createModule("Bases de donnees", "SQL, PostgreSQL, modelisation");
        Module modReseau = createModule("Reseaux", "TCP/IP, administration reseau");
        Module modGestion = createModule("Gestion de projet", "Methodes agiles, Scrum, Jira");

        // Affectation modules aux enseignants
        ens1.setModules(new HashSet<>());
        ens1.getModules().add(modJava);
        ens1.getModules().add(modBdd);
        enseignantRepository.save(ens1);

        ens2.setModules(new HashSet<>());
        ens2.getModules().add(modWeb);
        ens2.getModules().add(modGestion);
        enseignantRepository.save(ens2);

        // Apprenants
        Apprenant app1 = createApprenant("Leclerc", "Alice", "alice.leclerc@sygle.fr",
                "ETU001", filInfo, promo2025, roleApprenant);
        Apprenant app2 = createApprenant("Moreau", "Thomas", "thomas.moreau@sygle.fr",
                "ETU002", filInfo, promo2025, roleApprenant);
        Apprenant app3 = createApprenant("Petit", "Emma", "emma.petit@sygle.fr",
                "ETU003", filGenie, promo2025, roleApprenant);
        Apprenant app4 = createApprenant("Roux", "Lucas", "lucas.roux@sygle.fr",
                "ETU004", filElec, promo2024, roleApprenant);
        Apprenant app5 = createApprenant("Bernard", "Lea", "lea.bernard@sygle.fr",
                "ETU005", filInfo, promo2024, roleApprenant);

        // Stages
        Stage stage1 = createStage("Stage developpement web", "Developper une application React",
                LocalDate.of(2026, 3, 1), LocalDate.of(2026, 7, 31), 20,
                StatutStage.EN_COURS, app1, ens1);

        Stage stage2 = createStage("Stage data engineering", "Pipeline de donnees ETL",
                LocalDate.of(2026, 2, 1), LocalDate.of(2026, 6, 30), 20,
                StatutStage.EN_COURS, app2, ens2);

        Stage stage3 = createStage("Stage genie civil", "Suivi de chantier",
                LocalDate.of(2025, 9, 1), LocalDate.of(2026, 1, 31), 20,
                StatutStage.TERMINE, app3, ens1);

        Stage stage4 = createStage("Stage electronique embarquee", "Conception de carte PCB",
                LocalDate.of(2025, 9, 1), LocalDate.of(2026, 1, 31), 20,
                StatutStage.VALIDE, app4, ens2);

        Stage stage5 = createStage("Stage securite informatique", "Audit de securite web",
                LocalDate.of(2026, 4, 1), LocalDate.of(2026, 8, 31), 20,
                StatutStage.EN_COURS, app5, ens1);

        // Rapports
        RapportStage rapport1 = new RapportStage();
        rapport1.setStage(stage3);
        rapport1.setFichierPdf("uploads/rapports/rapport-emma-petit.pdf");
        rapport1.setDateDepot(LocalDate.of(2026, 2, 5));
        rapport1.setStatut(StatutRapport.DEPOSE);
        rapportRepository.save(rapport1);

        RapportStage rapport2 = new RapportStage();
        rapport2.setStage(stage4);
        rapport2.setFichierPdf("uploads/rapports/rapport-lucas-roux.pdf");
        rapport2.setDateDepot(LocalDate.of(2026, 1, 20));
        rapport2.setNote(16.5f);
        rapport2.setCommentaire("Excellent travail, rapport tres complet.");
        rapport2.setEvaluateur(ens2);
        rapport2.setStatut(StatutRapport.VALIDE);
        rapportRepository.save(rapport2);

        // Jury + soutenance
        Jury jury = new Jury();
        jury.setIntitule("Jury S1 2025-2026");
        jury.setDateConstitution(LocalDate.of(2026, 1, 10));
        jury.setMembres(new HashSet<>());
        jury.getMembres().add(ens1);
        jury.getMembres().add(ens2);
        juryRepository.save(jury);

        Soutenance soutenance = new Soutenance();
        soutenance.setStage(stage4);
        soutenance.setDate(LocalDateTime.of(2026, 2, 15, 14, 0));
        soutenance.setSalle("Amphi A");
        soutenance.setDuree(60);
        soutenance.setStatut("PLANIFIEE");
        soutenance.setJury(jury);
        soutenanceRepository.save(soutenance);

        // Suivi academique
        SuiviAcademique suivi1 = createSuivi(app1, 14.5f, "Bon travail, continue ainsi", "S1");
        SuiviAcademique suivi2 = createSuivi(app1, 15.0f, "Progression constante", "S2");
        SuiviAcademique suivi3 = createSuivi(app2, 12.0f, "Peut mieux faire", "S1");
        SuiviAcademique suivi4 = createSuivi(app3, 16.5f, "Tres bon semestre", "S1");
        SuiviAcademique suivi5 = createSuivi(app4, 17.0f, "Excellent", "S1");

        System.out.println("Donnees de demo chargees.");
        System.out.println("Comptes disponibles :");
        System.out.println("  admin@sygle.fr / admin123!");
        System.out.println("  jean.dupont@sygle.fr / enseignant123!");
        System.out.println("  sophie.martin@sygle.fr / enseignant123!");
        System.out.println("  alice.leclerc@sygle.fr / apprenant123!");
        System.out.println("  thomas.moreau@sygle.fr / apprenant123!");
    }

    // --- Methodes utilitaires ---

    private Role createRole(String nom) {
        Role role = new Role();
        role.setNom(nom);
        entityManager.persist(role);
        entityManager.flush();
        return role;
    }

    private Enseignant createEnseignant(String nom, String prenom, String email,
                                        String grade, String specialite, String departement, Role role) {
        Enseignant e = new Enseignant();
        e.setNom(nom);
        e.setPrenom(prenom);
        e.setEmail(email);
        e.setMotDePasse(passwordEncoder.encode("enseignant123!"));
        e.setGrade(grade);
        e.setSpecialite(specialite);
        e.setDepartement(departement);
        e.setRole(role);
        return enseignantRepository.save(e);
    }

    private Apprenant createApprenant(String nom, String prenom, String email,
                                      String numEtudiant, Filiere filiere, Promotion promotion, Role role) {
        Apprenant a = new Apprenant();
        a.setNom(nom);
        a.setPrenom(prenom);
        a.setEmail(email);
        a.setMotDePasse(passwordEncoder.encode("apprenant123!"));
        a.setNumEtudiant(numEtudiant);
        a.setDateInscription(LocalDate.now());
        a.setFiliere(filiere);
        a.setPromotion(promotion);
        a.setRole(role);
        return apprenantRepository.save(a);
    }

    private Module createModule(String nom, String description) {
        Module m = new Module();
        m.setNom(nom);
        m.setDescription(description);
        return moduleRepository.save(m);
    }

    private Stage createStage(String titre, String objectif,
                              LocalDate debut, LocalDate fin, int duree,
                              StatutStage statut, Apprenant apprenant, Enseignant encadrant) {
        Stage s = new Stage();
        s.setTitre(titre);
        s.setObjectif(objectif);
        s.setDateDebut(debut);
        s.setDateFin(fin);
        s.setDuree(duree);
        s.setStatut(statut);
        s.setApprenant(apprenant);
        s.setEncadrant(encadrant);
        return stageRepository.save(s);
    }

    private SuiviAcademique createSuivi(Apprenant apprenant, float moyenne,
                                        String appreciation, String semestre) {
        SuiviAcademique s = new SuiviAcademique();
        s.setApprenant(apprenant);
        s.setMoyenne(moyenne);
        s.setAppreciation(appreciation);
        s.setSemestre(semestre);
        return entityManager.merge(s);
    }
}
