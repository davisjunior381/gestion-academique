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

ok()      { echo -e "${GREEN}  ✓ $1${RESET}"; }
err()     { echo -e "${RED}  ✗ $1${RESET}"; }
section() { echo -e "\n${BLUE}━━━ $1 ━━━${RESET}"; }
field()   { echo "$1" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('$2',''))" 2>/dev/null; }

echo -e "${YELLOW}"
echo "  ╔══════════════════════════════════════════════════╗"
echo "  ║    Initialisation des données de démonstration   ║"
echo "  ╚══════════════════════════════════════════════════╝"
echo -e "${RESET}"

# =============================================================
# 0. VÉRIFICATION DU BACKEND
# =============================================================
section "Vérification du backend"
if ! curl -s "$BASE/auth/login" -X POST -H "Content-Type: application/json" -d '{}' > /dev/null 2>&1; then
  err "Le backend ne répond pas sur localhost:8080. Lance-le d'abord."
  exit 1
fi
ok "Backend accessible"

# =============================================================
# 1. RÔLES
# =============================================================
section "Création des rôles"
docker exec -i sygle-postgres psql -U admin -d gestion_academique -c "
INSERT INTO role (nom) VALUES ('ADMIN'),('ENSEIGNANT'),('APPRENANT') ON CONFLICT DO NOTHING;
" > /dev/null 2>&1
ok "Rôles créés (ADMIN, ENSEIGNANT, APPRENANT)"

# =============================================================
# 2. COMPTES UTILISATEURS
# =============================================================
section "Création des utilisateurs"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Administrateur","prenom":"Système","email":"admin@eseo.fr","motDePasse":"Admin2026!","roleNom":"ADMIN"}' > /dev/null
ok "Admin : admin@eseo.fr / Admin2026!"

# Enseignants
curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Dupont","prenom":"Jean","email":"jean.dupont@eseo.fr","motDePasse":"Enseignant2026!","roleNom":"ENSEIGNANT"}' > /dev/null
ok "Enseignant 1 : jean.dupont@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Martin","prenom":"Sophie","email":"sophie.martin@eseo.fr","motDePasse":"Enseignant2026!","roleNom":"ENSEIGNANT"}' > /dev/null
ok "Enseignant 2 : sophie.martin@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Margon","prenom":"Bernard","email":"bernard.margon@eseo.fr","motDePasse":"Enseignant2026!","roleNom":"ENSEIGNANT"}' > /dev/null
ok "Enseignant 3 : bernard.margon@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Thomas","prenom":"Philimon","email":"philimon.thomas@eseo.fr","motDePasse":"Enseignant2026!","roleNom":"ENSEIGNANT"}' > /dev/null
ok "Enseignant 4 : philimon.thomas@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Donald","prenom":"Claude","email":"claude.donald@eseo.fr","motDePasse":"Enseignant2026!","roleNom":"ENSEIGNANT"}' > /dev/null
ok "Enseignant 5 : claude.donald@eseo.fr"

# Apprenants
curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Dubois","prenom":"Alice","email":"alice.dubois@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}' > /dev/null
ok "Apprenant 1 : alice.dubois@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Bernard","prenom":"Lucas","email":"lucas.bernard@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}' > /dev/null
ok "Apprenant 2 : lucas.bernard@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Moreau","prenom":"Emma","email":"emma.moreau@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}' > /dev/null
ok "Apprenant 3 : emma.moreau@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Dubois","prenom":"Julie","email":"julie.dubois@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}' > /dev/null
ok "Apprenant 4 : julie.dubois@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Boub","prenom":"Jenny","email":"jenny.boub@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}' > /dev/null
ok "Apprenant 5 : jenny.boub@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Morgan","prenom":"Dave","email":"dave.morgan@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}' > /dev/null
ok "Apprenant 6 : dave.morgan@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Moreau","prenom":"Bob","email":"bob.moreau@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}' > /dev/null
ok "Apprenant 7 : bob.moreau@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Dubois","prenom":"Tom","email":"tom.dubois@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}' > /dev/null
ok "Apprenant 8 : tom.dubois@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Boub","prenom":"Jery","email":"jery.boub@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}' > /dev/null
ok "Apprenant 9 : jery.boub@eseo.fr"

curl -s -X POST "$BASE/auth/register" -H "Content-Type: application/json" \
  -d '{"nom":"Morgan","prenom":"Paul","email":"paul.morgan@eseo.fr","motDePasse":"Apprenant2026!","roleNom":"APPRENANT"}' > /dev/null
ok "Apprenant 10 : paul.morgan@eseo.fr"

# =============================================================
# 3. TOKEN ADMIN
# =============================================================
section "Authentification admin"
LOGIN=$(curl -s -X POST "$BASE/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"admin@eseo.fr","motDePasse":"Admin2026!"}')
TOKEN=$(field "$LOGIN" "token")
if [ -z "$TOKEN" ]; then
  err "Impossible de récupérer le token admin."
  exit 1
fi
AUTH="Authorization: Bearer $TOKEN"
ok "Token admin récupéré"

# =============================================================
# 4. FILIÈRES
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
# 5. PROMOTIONS
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
# 6. ENTREPRISES
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

R=$(curl -s -X POST "$BASE/entreprises" -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"nom":"Orange","secteur":"Télécommunications","adresse":"78 Rue Olivier de Serres, 75015 Paris","emailContact":"stages@orange.fr"}')
ENT4=$(field "$R" "siretEntreprise")
ok "Orange (id=$ENT4)"

R=$(curl -s -X POST "$BASE/entreprises" -H "Content-Type: application/json" -H "$AUTH" \
  -d '{"nom":"Thales","secteur":"Défense & Technologie","adresse":"45 Rue de Villiers, 92526 Neuilly","emailContact":"stages@thales.fr"}')
ENT5=$(field "$R" "siretEntreprise")
ok "Thales (id=$ENT5)"

# =============================================================
# 7. RÉCUPÉRER LES IDs
# =============================================================
section "Récupération des IDs utilisateurs"

USERS=$(curl -s "$BASE/apprenants" -H "$AUTH")
APP1=$(echo "$USERS"  | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='alice.dubois@eseo.fr'))"  2>/dev/null)
APP2=$(echo "$USERS"  | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='lucas.bernard@eseo.fr'))" 2>/dev/null)
APP3=$(echo "$USERS"  | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='emma.moreau@eseo.fr'))"   2>/dev/null)
APP4=$(echo "$USERS"  | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='julie.dubois@eseo.fr'))"  2>/dev/null)
APP5=$(echo "$USERS"  | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='jenny.boub@eseo.fr'))"   2>/dev/null)
APP6=$(echo "$USERS"  | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='dave.morgan@eseo.fr'))"  2>/dev/null)
APP7=$(echo "$USERS"  | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='bob.moreau@eseo.fr'))"   2>/dev/null)
APP8=$(echo "$USERS"  | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='tom.dubois@eseo.fr'))"   2>/dev/null)
APP9=$(echo "$USERS"  | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='jery.boub@eseo.fr'))"   2>/dev/null)
APP10=$(echo "$USERS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='paul.morgan@eseo.fr'))"  2>/dev/null)
ok "Apprenants : Alice($APP1) Lucas($APP2) Emma($APP3) Julie($APP4) Jenny($APP5) Dave($APP6) Bob($APP7) Tom($APP8) Jery($APP9) Paul($APP10)"

ENS=$(curl -s "$BASE/enseignants" -H "$AUTH")
ENS1=$(echo "$ENS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='jean.dupont@eseo.fr'))"      2>/dev/null)
ENS2=$(echo "$ENS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='sophie.martin@eseo.fr'))"    2>/dev/null)
ENS3=$(echo "$ENS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='bernard.margon@eseo.fr'))"   2>/dev/null)
ENS4=$(echo "$ENS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='philimon.thomas@eseo.fr'))"  2>/dev/null)
ENS5=$(echo "$ENS" | python3 -c "import sys,json; u=json.load(sys.stdin); print(next(x['codeUtilisateur'] for x in u if x['email']=='claude.donald@eseo.fr'))"    2>/dev/null)
ok "Enseignants : Jean($ENS1) Sophie($ENS2) Bernard($ENS3) Philimon($ENS4) Claude($ENS5)"

# =============================================================
# 8. MISE À JOUR grade/spécialité des enseignants
# =============================================================
section "Mise à jour profils enseignants"

curl -s -X PUT "$BASE/enseignants/$ENS1" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Dupont\",\"prenom\":\"Jean\",\"email\":\"jean.dupont@eseo.fr\",\"motDePasse\":\"Enseignant2026!\",\"grade\":\"MCF\",\"specialite\":\"Génie Logiciel\",\"departement\":\"Informatique\"}" > /dev/null
ok "Jean Dupont → MCF, Génie Logiciel"

curl -s -X PUT "$BASE/enseignants/$ENS2" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Martin\",\"prenom\":\"Sophie\",\"email\":\"sophie.martin@eseo.fr\",\"motDePasse\":\"Enseignant2026!\",\"grade\":\"PR\",\"specialite\":\"Réseaux\",\"departement\":\"Télécoms\"}" > /dev/null
ok "Sophie Martin → PR, Réseaux"

curl -s -X PUT "$BASE/enseignants/$ENS3" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Margon\",\"prenom\":\"Bernard\",\"email\":\"bernard.margon@eseo.fr\",\"motDePasse\":\"Enseignant2026!\",\"grade\":\"MCF\",\"specialite\":\"Sécurité informatique\",\"departement\":\"Informatique\"}" > /dev/null
ok "Bernard Margon → MCF, Sécurité informatique"

curl -s -X PUT "$BASE/enseignants/$ENS4" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Thomas\",\"prenom\":\"Philimon\",\"email\":\"philimon.thomas@eseo.fr\",\"motDePasse\":\"Enseignant2026!\",\"grade\":\"ATER\",\"specialite\":\"Intelligence Artificielle\",\"departement\":\"Informatique\"}" > /dev/null
ok "Philimon Thomas → ATER, Intelligence Artificielle"

curl -s -X PUT "$BASE/enseignants/$ENS5" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Donald\",\"prenom\":\"Claude\",\"email\":\"claude.donald@eseo.fr\",\"motDePasse\":\"Enseignant2026!\",\"grade\":\"PR\",\"specialite\":\"Systèmes embarqués\",\"departement\":\"Électronique\"}" > /dev/null
ok "Claude Donald → PR, Systèmes embarqués"

# =============================================================
# 9. MISE À JOUR numEtudiant des apprenants
# =============================================================
section "Mise à jour numéros étudiants"

curl -s -X PUT "$BASE/apprenants/$APP1" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Dubois\",\"prenom\":\"Alice\",\"email\":\"alice.dubois@eseo.fr\",\"motDePasse\":\"Apprenant2026!\",\"numEtudiant\":\"ETU2024001\"}" > /dev/null
ok "Alice Dubois → ETU2024001"

curl -s -X PUT "$BASE/apprenants/$APP2" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Bernard\",\"prenom\":\"Lucas\",\"email\":\"lucas.bernard@eseo.fr\",\"motDePasse\":\"Apprenant2026!\",\"numEtudiant\":\"ETU2024002\"}" > /dev/null
ok "Lucas Bernard → ETU2024002"

curl -s -X PUT "$BASE/apprenants/$APP3" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Moreau\",\"prenom\":\"Emma\",\"email\":\"emma.moreau@eseo.fr\",\"motDePasse\":\"Apprenant2026!\",\"numEtudiant\":\"ETU2023001\"}" > /dev/null
ok "Emma Moreau → ETU2023001"

curl -s -X PUT "$BASE/apprenants/$APP4" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Dubois\",\"prenom\":\"Julie\",\"email\":\"julie.dubois@eseo.fr\",\"motDePasse\":\"Apprenant2026!\",\"numEtudiant\":\"ETU2024003\"}" > /dev/null
ok "Julie Dubois → ETU2024003"

curl -s -X PUT "$BASE/apprenants/$APP5" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Boub\",\"prenom\":\"Jenny\",\"email\":\"jenny.boub@eseo.fr\",\"motDePasse\":\"Apprenant2026!\",\"numEtudiant\":\"ETU2024004\"}" > /dev/null
ok "Jenny Boub → ETU2024004"

curl -s -X PUT "$BASE/apprenants/$APP6" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Morgan\",\"prenom\":\"Dave\",\"email\":\"dave.morgan@eseo.fr\",\"motDePasse\":\"Apprenant2026!\",\"numEtudiant\":\"ETU2024005\"}" > /dev/null
ok "Dave Morgan → ETU2024005"

curl -s -X PUT "$BASE/apprenants/$APP7" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Moreau\",\"prenom\":\"Bob\",\"email\":\"bob.moreau@eseo.fr\",\"motDePasse\":\"Apprenant2026!\",\"numEtudiant\":\"ETU2023002\"}" > /dev/null
ok "Bob Moreau → ETU2023002"

curl -s -X PUT "$BASE/apprenants/$APP8" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Dubois\",\"prenom\":\"Tom\",\"email\":\"tom.dubois@eseo.fr\",\"motDePasse\":\"Apprenant2026!\",\"numEtudiant\":\"ETU2023003\"}" > /dev/null
ok "Tom Dubois → ETU2023003"

curl -s -X PUT "$BASE/apprenants/$APP9" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Boub\",\"prenom\":\"Jery\",\"email\":\"jery.boub@eseo.fr\",\"motDePasse\":\"Apprenant2026!\",\"numEtudiant\":\"ETU2023004\"}" > /dev/null
ok "Jery Boub → ETU2023004"

curl -s -X PUT "$BASE/apprenants/$APP10" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"nom\":\"Morgan\",\"prenom\":\"Paul\",\"email\":\"paul.morgan@eseo.fr\",\"motDePasse\":\"Apprenant2026!\",\"numEtudiant\":\"ETU2023005\"}" > /dev/null
ok "Paul Morgan → ETU2023005"

# =============================================================
# 10. AFFECTATIONS FILIÈRES ET PROMOTIONS
# =============================================================
section "Affectation filières et promotions"

# Informatique / Promo 2024-2026
for APP in $APP1 $APP2 $APP4 $APP5 $APP6; do
  curl -s -X PUT "$BASE/apprenants/$APP/filiere/$FIL1"    -H "$AUTH" > /dev/null
  curl -s -X PUT "$BASE/apprenants/$APP/promotion/$PROMO1" -H "$AUTH" > /dev/null
done
ok "Alice, Lucas, Julie, Jenny, Dave → Informatique / Promo 2024-2026"

# Réseaux / Promo 2023-2025
for APP in $APP3 $APP7 $APP8 $APP9 $APP10; do
  curl -s -X PUT "$BASE/apprenants/$APP/filiere/$FIL2"    -H "$AUTH" > /dev/null
  curl -s -X PUT "$BASE/apprenants/$APP/promotion/$PROMO2" -H "$AUTH" > /dev/null
done
ok "Emma, Bob, Tom, Jery, Paul → Réseaux / Promo 2023-2025"

# =============================================================
# 11. STAGES (7 stages, statuts variés)
# =============================================================
section "Création des stages"

R=$(curl -s -X POST "$BASE/stages" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"titre\":\"Développement API REST\",\"dateDebut\":\"2026-04-01\",\"dateFin\":\"2026-06-30\",\"duree\":12,\"objectif\":\"Concevoir une API avec Spring Boot\",\"apprenantId\":$APP1,\"encadrantId\":$ENS1,\"entrepriseId\":$ENT1}")
STAGE1=$(field "$R" "refStage")
ok "Stage 1 : Alice @ Google, encadré Jean Dupont (id=$STAGE1)"

R=$(curl -s -X POST "$BASE/stages" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"titre\":\"Migration infrastructure cloud\",\"dateDebut\":\"2026-03-15\",\"dateFin\":\"2026-06-15\",\"duree\":12,\"objectif\":\"Migrer l'infra vers AWS\",\"apprenantId\":$APP2,\"encadrantId\":$ENS1,\"entrepriseId\":$ENT2}")
STAGE2=$(field "$R" "refStage")
ok "Stage 2 : Lucas @ Capgemini, encadré Jean Dupont (id=$STAGE2)"

R=$(curl -s -X POST "$BASE/stages" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"titre\":\"Analyse de données financières\",\"dateDebut\":\"2026-02-01\",\"dateFin\":\"2026-05-01\",\"duree\":12,\"objectif\":\"Outils d'analyse financière\",\"apprenantId\":$APP3,\"encadrantId\":$ENS2,\"entrepriseId\":$ENT3}")
STAGE3=$(field "$R" "refStage")
curl -s -X PATCH "$BASE/stages/$STAGE3/statut?statut=TERMINE" -H "$AUTH" > /dev/null
ok "Stage 3 : Emma @ BNP Paribas → TERMINE (id=$STAGE3)"

R=$(curl -s -X POST "$BASE/stages" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"titre\":\"Développement application mobile\",\"dateDebut\":\"2026-04-15\",\"dateFin\":\"2026-07-15\",\"duree\":12,\"objectif\":\"Créer une app Android\",\"apprenantId\":$APP4,\"encadrantId\":$ENS4,\"entrepriseId\":$ENT1}")
STAGE4=$(field "$R" "refStage")
ok "Stage 4 : Julie @ Google, encadré Philimon Thomas (id=$STAGE4)"

R=$(curl -s -X POST "$BASE/stages" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"titre\":\"Sécurité réseau et audit\",\"dateDebut\":\"2026-03-01\",\"dateFin\":\"2026-06-01\",\"duree\":12,\"objectif\":\"Audit de sécurité réseau\",\"apprenantId\":$APP5,\"encadrantId\":$ENS3,\"entrepriseId\":$ENT4}")
STAGE5=$(field "$R" "refStage")
ok "Stage 5 : Jenny @ Orange, encadré Bernard Margon (id=$STAGE5)"

R=$(curl -s -X POST "$BASE/stages" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"titre\":\"Intégration systèmes embarqués\",\"dateDebut\":\"2026-01-15\",\"dateFin\":\"2026-04-15\",\"duree\":12,\"objectif\":\"Développement firmware\",\"apprenantId\":$APP6,\"encadrantId\":$ENS5,\"entrepriseId\":$ENT5}")
STAGE6=$(field "$R" "refStage")
curl -s -X PATCH "$BASE/stages/$STAGE6/statut?statut=TERMINE" -H "$AUTH" > /dev/null
ok "Stage 6 : Dave @ Thales → TERMINE (id=$STAGE6)"

R=$(curl -s -X POST "$BASE/stages" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"titre\":\"Administration réseaux\",\"dateDebut\":\"2026-04-01\",\"dateFin\":\"2026-07-01\",\"duree\":12,\"objectif\":\"Administration et monitoring réseau\",\"apprenantId\":$APP7,\"encadrantId\":$ENS2,\"entrepriseId\":$ENT4}")
STAGE7=$(field "$R" "refStage")
ok "Stage 7 : Bob @ Orange, encadré Sophie Martin (id=$STAGE7)"

# =============================================================
# 12. JURYS
# =============================================================
section "Création des jurys"

R=$(curl -s -X POST "$BASE/jurys" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"intitule\":\"Jury Soutenance Juin 2026\",\"dateConstitution\":\"2026-06-01\",\"roleJury\":\"PRESIDENT\"}")
JURY1=$(field "$R" "codeJury")
curl -s -X POST "$BASE/jurys/$JURY1/membres/$ENS1" -H "$AUTH" > /dev/null
curl -s -X POST "$BASE/jurys/$JURY1/membres/$ENS2" -H "$AUTH" > /dev/null
ok "Jury 1 : Jean Dupont + Sophie Martin (id=$JURY1)"

R=$(curl -s -X POST "$BASE/jurys" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"intitule\":\"Jury Soutenance Juillet 2026\",\"dateConstitution\":\"2026-07-01\",\"roleJury\":\"MEMBRE\"}")
JURY2=$(field "$R" "codeJury")
curl -s -X POST "$BASE/jurys/$JURY2/membres/$ENS3" -H "$AUTH" > /dev/null
curl -s -X POST "$BASE/jurys/$JURY2/membres/$ENS5" -H "$AUTH" > /dev/null
ok "Jury 2 : Bernard Margon + Claude Donald (id=$JURY2)"

# =============================================================
# 13. SOUTENANCES
# =============================================================
section "Création des soutenances"

R=$(curl -s -X POST "$BASE/soutenances" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"date\":\"2026-07-10T10:00:00\",\"salle\":\"Salle A101\",\"duree\":60,\"stageId\":$STAGE3,\"juryId\":$JURY1}")
ok "Soutenance 1 : Emma, 10/07/2026 10h Salle A101"

R=$(curl -s -X POST "$BASE/soutenances" -H "Content-Type: application/json" -H "$AUTH" \
  -d "{\"date\":\"2026-07-15T14:00:00\",\"salle\":\"Salle B202\",\"duree\":60,\"stageId\":$STAGE6,\"juryId\":$JURY2}")
ok "Soutenance 2 : Dave, 15/07/2026 14h Salle B202"

# =============================================================
# RÉSUMÉ
# =============================================================
echo -e "\n${YELLOW}"
echo "  ╔══════════════════════════════════════════════════════╗"
echo "  ║          Données de démo créées avec succès          ║"
echo "  ╚══════════════════════════════════════════════════════╝"
echo -e "${RESET}"
echo -e "  ${GREEN}Comptes :${RESET}"
echo "  admin@eseo.fr                / Admin2026!"
echo "  jean.dupont@eseo.fr          / Enseignant2026!  (MCF, Génie Logiciel)"
echo "  sophie.martin@eseo.fr        / Enseignant2026!  (PR, Réseaux)"
echo "  bernard.margon@eseo.fr       / Enseignant2026!  (MCF, Sécurité)"
echo "  philimon.thomas@eseo.fr      / Enseignant2026!  (ATER, IA)"
echo "  claude.donald@eseo.fr        / Enseignant2026!  (PR, Systèmes embarqués)"
echo "  alice.dubois@eseo.fr         / Apprenant2026!   (ETU2024001)"
echo "  lucas.bernard@eseo.fr        / Apprenant2026!   (ETU2024002)"
echo "  emma.moreau@eseo.fr          / Apprenant2026!   (ETU2023001)"
echo "  julie.dubois@eseo.fr         / Apprenant2026!   (ETU2024003)"
echo "  jenny.boub@eseo.fr           / Apprenant2026!   (ETU2024004)"
echo "  dave.morgan@eseo.fr          / Apprenant2026!   (ETU2024005)"
echo "  bob.moreau@eseo.fr           / Apprenant2026!   (ETU2023002)"
echo "  + tom.dubois, jery.boub, paul.morgan (non affectés à des stages)"
echo ""
echo -e "  ${GREEN}Données :${RESET}"
echo "  5 enseignants (grade + spécialité renseignés)"
echo "  10 apprenants (numéro étudiant renseigné)"
echo "  2 filières, 2 promotions, 5 entreprises"
echo "  7 stages (5 EN_COURS, 2 TERMINE)"
echo "  2 jurys (2 membres chacun)"
echo "  2 soutenances planifiées"