#!/bin/bash

# =============================================================
# Script de données de démonstration
# Plateforme de Gestion Académique et des Stages
# =============================================================
# Usage : chmod +x init-demo.sh && ./init-demo.sh
# Prérequis : backend lancé sur localhost:8080
# =============================================================

BASE="http://localhost:8080/api"
RESET='\033[0m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'

ok()  { echo -e "${GREEN}  ✓ $1${RESET}"; }
err() { echo -e "${RED}  ✗ $1${RESET}"; }
section() { echo -e "\n${BLUE}━━━ $1 ━━━${RESET}"; }

# Extraction d'un champ JSON
field() { echo "$1" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('$2',''))" 2>/dev/null; }

echo -e "${YELLOW}"
echo "  ╔══════════════════════════════════════════════╗"
echo "  ║   Initialisation des données de démonstration ║"
echo "  ╚══════════════════════════════════════════════╝"
echo -e "${RESET}"

# =============================================================
# 0. VÉRIFICATION QUE LE BACKEND EST LANCÉ
# =============================================================
section "Vérification du backend"
if ! curl -s "$BASE/auth/login" -X POST -H "Content-Type: application/json" -d '{}' > /dev/null 2>&1; then
  err "Le backend ne répond pas sur localhost:8080. Lance-le d'abord."
  exit 1
fi
ok "Backend accessible"

# =============================================================
# 1. CRÉER LES RÔLES
# =============================================================
section "Création des rôles"
docker exec -i sygle-postgres psql -U admin -d gestion_academique -c "
INSERT INTO role (nom) VALUES ('ADMIN'),('ENSEIGNANT'),('APPRENANT') ON CONFLICT DO NOTHING;
" > /dev/null 2>&1
ok "Rôles créés (ADMIN, ENSEIGNANT, APPRENANT)"

# =============================================================
# 2. CRÉER LES COMPTES UTILISATEURS
# =============================================================
section "Création des utilisateurs"

# Admin
R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Administrateur","prenom":"Système","email":"admin@eseo.fr","motDePasse":"Admin2026!","roleNom":"ADMIN"}')
ok "Admin : admin@eseo.fr / Admin2026!"

# Enseignants
R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Dupont","prenom":"Jean","email":"jean.dupont@eseo.fr","motDePasse":"Enseignant2026!","roleNom":"ENSEIGNANT"}')
ok "Enseignant 1 : jean.dupont@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Martin","prenom":"Sophie","email":"sophie.martin@eseo.fr","motDePasse":"Enseignant2026!","roleNom":"ENSEIGNANT"}')
ok "Enseignant 2 : sophie.martin@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Margon","prenom":"Bernard","email":"bernard.margon@eseo.fr","motDePasse":"Enseignant2026!","roleNom":"ENSEIGNANT"}')
ok "Enseignant 3 : bernard.margon@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Thomas","prenom":"Philimon","email":"philimon.thomas@eseo.fr","motDePasse":"Enseignant2026!","roleNom":"ENSEIGNANT"}')
ok "Enseignant 4 : philimon.thomas@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Donald","prenom":"Claude","email":"claude.donald@eseo.fr","motDePasse":"Enseignant2026!","roleNom":"ENSEIGNANT"}')
ok "Enseignant 5 : claude.donald@eseo.fr"

# Apprenants
R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Dubois","prenom":"Alice","email":"alice.dubois@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}')
ok "Apprenant 1 : alice.dubois@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Bernard","prenom":"Lucas","email":"lucas.bernard@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}')
ok "Apprenant 2 : lucas.bernard@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Moreau","prenom":"Emma","email":"emma.moreau@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}')
ok "Apprenant 3 : emma.moreau@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Dubois","prenom":"Julie","email":"julie.dubois@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}')
ok "Apprenant 4 : julie.dubois@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Boub","prenom":"Jenny","email":"jenny.boub@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}')
ok "Apprenant 5 : jenny.boub@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Morgan","prenom":"Dave","email":"dave.morgan@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}')
ok "Apprenant 6 : dave.morgan@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Moreau","prenom":"Bob","email":"bob.moreau@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}')
ok "Apprenant 7 : bob.moreau@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Dubois","prenom":"Tom","email":"tom.dubois@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}')
ok "Apprenant 8 : tom.dubois@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Boub","prenom":"Jery","email":"jery.boub@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}')
ok "Apprenant 9 : jery.boub@eseo.fr"

R=$(curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Morgan","prenom":"Paul","email":"paul.morgan@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}')
ok "Apprenant 10 : paul.morgan@eseo.fr"


# =============================================================
# 3. RÉCUPÉRER LE TOKEN ADMIN
# =============================================================
section "Authentification admin"
LOGIN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"admin@eseo.fr","motDePasse":"Admin2026!"}')
TOKEN=$(field "$LOGIN" "token")
if [ -z "$TOKEN" ]; then
  err "Impossible de récupérer le token admin. Vérifiez les identifiants."
  exit 1
fi
AUTH="Authorization: Bearer $TOKEN"
ok "Token admin récupéré"

# =============================================================
# 4. CRÉER LES FILIÈRES
# =============================================================
section "Création des filières"
R=$(curl -s -X POST "$BASE/filieres" -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"nom":"Informatique","description":"Génie logiciel et systèmes informatiques"}')
FIL1=$(field "$R" "codeFiliere")
ok "Filière Informatique (id=$FIL1)"

R=$(curl -s -X POST "$BASE/filieres" -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"nom":"Réseaux et Télécoms","description":"Réseaux, sécurité et télécommunications"}')
FIL2=$(field "$R" "codeFiliere")
ok "Filière Réseaux et Télécoms (id=$FIL2)"

# =============================================================
# 5. CRÉER LES PROMOTIONS
# =============================================================
section "Création des promotions"
R=$(curl -s -X POST "$BASE/promotions" -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"nom":"Promo 2024-2026","annee":2024}')
PROMO1=$(field "$R" "codePromotion")
ok "Promotion 2024-2026 (id=$PROMO1)"

R=$(curl -s -X POST "$BASE/promotions" -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"nom":"Promo 2023-2025","annee":2023}')
PROMO2=$(field "$R" "codePromotion")
ok "Promotion 2023-2025 (id=$PROMO2)"

# =============================================================
# 6. CRÉER LES ENTREPRISES
# =============================================================
section "Création des entreprises"
R=$(curl -s -X POST "$BASE/entreprises" -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"nom":"Google France","secteur":"Technologie","adresse":"8 Rue de Londres, 75009 Paris","emailContact":"stages@google.fr"}')
ENT1=$(field "$R" "siretEntreprise")
ok "Google France (id=$ENT1)"

R=$(curl -s -X POST "$BASE/entreprises" -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"nom":"Capgemini","secteur":"Conseil IT","adresse":"11 Rue de Tilsitt, 75017 Paris","emailContact":"stages@capgemini.fr"}')
ENT2=$(field "$R" "siretEntreprise")
ok "Capgemini (id=$ENT2)"

R=$(curl -s -X POST "$BASE/entreprises" -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"nom":"BNP Paribas","secteur":"Banque","adresse":"16 Bd des Italiens, 75009 Paris","emailContact":"stages@bnpparibas.fr"}')
ENT3=$(field "$R" "siretEntreprise")
ok "BNP Paribas (id=$ENT3)"

# =============================================================
# 7. RÉCUPÉRER LES IDs DES UTILISATEURS
# =============================================================
section "Récupération des IDs utilisateurs"

USERS=$(curl -s "$BASE/apprenants" -H "$AUTH")
APP1=$(echo "$USERS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='alice.dubois@eseo.fr'))" 2>/dev/null)
APP2=$(echo "$USERS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='lucas.bernard@eseo.fr'))" 2>/dev/null)
APP3=$(echo "$USERS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='emma.moreau@eseo.fr'))" 2>/dev/null)
APP4=$(echo "$USERS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='julie.dubois@eseo.fr'))" 2>/dev/null)
APP5=$(echo "$USERS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='jenny.boub@eseo.fr'))" 2>/dev/null)
APP6=$(echo "$USERS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='dave.morgan@eseo.fr'))" 2>/dev/null)
APP7=$(echo "$USERS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='bob.moreau@eseo.fr'))" 2>/dev/null)
APP8=$(echo "$USERS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='tom.dubois@eseo.fr'))" 2>/dev/null)
APP9=$(echo "$USERS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='jery.boub@eseo.fr'))" 2>/dev/null)
APP10=$(echo "$USERS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='paul.morgan@eseo.fr'))" 2>/dev/null)
ok "Apprenants récupérés"

ENS=$(curl -s "$BASE/enseignants" -H "$AUTH")
ENS1=$(echo "$ENS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='jean.dupont@eseo.fr'))" 2>/dev/null)
ENS2=$(echo "$ENS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='sophie.martin@eseo.fr'))" 2>/dev/null)
ENS3=$(echo "$ENS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='bernard.margon@eseo.fr'))" 2>/dev/null)
ENS4=$(echo "$ENS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='philimon.thomas@eseo.fr'))" 2>/dev/null)
ENS5=$(echo "$ENS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='claude.donald@eseo.fr'))" 2>/dev/null)
ok "Enseignants récupérés"

# =============================================================
# 8. AFFECTER APPRENANTS AUX FILIÈRES ET PROMOTIONS
# =============================================================
section "Affectation filières et promotions"

# Promo 1 (Informatique)
curl -s -X PUT "$BASE/apprenants/$APP1/filiere/$FIL1" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP1/promotion/$PROMO1" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP2/filiere/$FIL1" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP2/promotion/$PROMO1" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP4/filiere/$FIL1" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP4/promotion/$PROMO1" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP5/filiere/$FIL1" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP5/promotion/$PROMO1" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP6/filiere/$FIL1" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP6/promotion/$PROMO1" -H "$AUTH" > /dev/null
ok "Apprenants 1, 2, 4, 5, 6 → Informatique / Promo 2024-2026"

# Promo 2 (Réseaux et Télécoms)
curl -s -X PUT "$BASE/apprenants/$APP3/filiere/$FIL2" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP3/promotion/$PROMO2" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP7/filiere/$FIL2" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP7/promotion/$PROMO2" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP8/filiere/$FIL2" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP8/promotion/$PROMO2" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP9/filiere/$FIL2" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP9/promotion/$PROMO2" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP10/filiere/$FIL2" -H "$AUTH" > /dev/null
curl -s -X PUT "$BASE/apprenants/$APP10/promotion/$PROMO2" -H "$AUTH" > /dev/null
ok "Apprenants 3, 7, 8, 9, 10 → Réseaux / Promo 2023-2025"

# =============================================================
# 9. CRÉER LES STAGES
# =============================================================
section "Création des stages"

R=$(curl -s -X POST "$BASE/stages" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"titre\":\"Développement d'une API REST\",\"dateDebut\":\"2026-04-01\",\"dateFin\":\"2026-06-30\",\"duree\":12,\"objectif\":\"Concevoir et implémenter une API REST avec Spring Boot\",\"apprenantId\":$APP1,\"encadrantId\":$ENS1,\"entrepriseId\":$ENT1}")
STAGE1=$(field "$R" "refStage")
ok "Stage 1 : Alice @ Google France, encadré par Jean Dupont (id=$STAGE1)"

R=$(curl -s -X POST "$BASE/stages" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"titre\":\"Migration infrastructure cloud\",\"dateDebut\":\"2026-03-15\",\"dateFin\":\"2026-06-15\",\"duree\":12,\"objectif\":\"Migrer l'infrastructure vers AWS\",\"apprenantId\":$APP2,\"encadrantId\":$ENS1,\"entrepriseId\":$ENT2}")
STAGE2=$(field "$R" "refStage")
ok "Stage 2 : Lucas @ Capgemini, encadré par Jean Dupont (id=$STAGE2)"

R=$(curl -s -X POST "$BASE/stages" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"titre\":\"Analyse de données financières\",\"dateDebut\":\"2026-02-01\",\"dateFin\":\"2026-05-01\",\"duree\":12,\"objectif\":\"Développer des outils d'analyse de données\",\"apprenantId\":$APP3,\"encadrantId\":$ENS2,\"entrepriseId\":$ENT3}")
STAGE3=$(field "$R" "refStage")
ok "Stage 3 : Emma @ BNP Paribas, encadré par Sophie Martin (id=$STAGE3)"

# Changer le statut du stage 3 à TERMINE
curl -s -X PATCH "$BASE/stages/$STAGE3/statut?statut=TERMINE" -H "$AUTH" > /dev/null
ok "Stage 3 (Emma) → statut TERMINE"

# =============================================================
# 10. CRÉER UN JURY
# =============================================================
section "Création du jury"
R=$(curl -s -X POST "$BASE/jurys" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"intitule\":\"Jury Soutenance Juin 2026\",\"dateConstitution\":\"2026-06-01\",\"roleJury\":\"PRESIDENT\"}")
JURY1=$(field "$R" "codeJury")
ok "Jury créé (id=$JURY1)"

# Ajouter les membres du jury
curl -s -X POST "$BASE/jurys/$JURY1/membres/$ENS1" -H "$AUTH" > /dev/null
curl -s -X POST "$BASE/jurys/$JURY1/membres/$ENS2" -H "$AUTH" > /dev/null
ok "Jean Dupont et Sophie Martin ajoutés au jury"

# =============================================================
# 11. CRÉER LES SOUTENANCES
# =============================================================
section "Création des soutenances"
R=$(curl -s -X POST "$BASE/soutenances" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"date\":\"2026-07-10T10:00:00\",\"salle\":\"Salle A101\",\"duree\":60,\"stageId\":$STAGE3,\"juryId\":$JURY1}")
SOUT1=$(field "$R" "refSoutenance")
ok "Soutenance : Emma, 10/07/2026 10h, Salle A101 (id=$SOUT1)"

# =============================================================
# RÉSUMÉ FINAL
# =============================================================
echo -e "\n${YELLOW}"
echo "  ╔══════════════════════════════════════════════════╗"
echo "  ║            Données de démo créées avec succès    ║"
echo "  ╚══════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo -e "  ${GREEN}Comptes de connexion :${RESET}"
echo "  Admin      : admin@eseo.fr          / Admin2026!"
echo "  Enseignants: @eseo.fr (Mot de passe: Enseignant2026!)"
echo "               -> jean.dupont, sophie.martin, bernard.margon, philimon.thomas, claude.donald"
echo "  Apprenants : @eseo.fr (Mot de passe: Apprenant2026!)"
echo "               -> alice.dubois, lucas.bernard, emma.moreau, julie.dubois, jenny.boub,"
echo "                  dave.morgan, bob.moreau, tom.dubois, jery.boub, paul.morgan"
echo ""
echo -e "  ${GREEN}Données créées :${RESET}"
echo "  2 filières, 2 promotions, 3 entreprises"
echo "  10 apprenants affectés, 5 enseignants créés"
echo "  3 stages (2 EN_COURS, 1 TERMINE)"
echo "  1 jury avec 2 membres"
echo "  1 soutenance planifiée"
echo ""