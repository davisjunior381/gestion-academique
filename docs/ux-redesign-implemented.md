# Sygle - Refonte d'identite visuelle

## Direction choisie : "Sygle Editorial Classique"

Une plateforme de l'ESEO Paris-Velizy qui se lit clairement, dans un
vocabulaire d'eleve. Typographie classique (Lato, Helvetica, Arial),
palette sobre, densite d'information assumee, micro-interactions discretes.

Inspirations directes : Pennylane (sobriete des formulaires francais),
Linear (rigueur des grilles et tracking serre), presse francaise serieuse
(Le Monde, Mediapart) pour la mise en page editoriale et les filets.

## Palette

L'idee : rompre avec le blue/indigo Tailwind par defaut. On utilise une
"encre" chaude (legerement greige) comme neutre, un bleu de Prusse comme
marque institutionnelle, et un cassis (bordeaux brule) comme accent unique.
Les couleurs de statut sont alignees pour ne jamais jurer avec la marque.

| Token | Hex | Role |
|---|---|---|
| `--color-ink-50` | `#f7f6f3` | Fond d'application, beige tres clair, chaud |
| `--color-ink-200` | `#d9d7cf` | Bordures, separateurs |
| `--color-ink-500` | `#5f5b50` | Labels mono, kickers, texte secondaire |
| `--color-ink-900` | `#111110` | Titres, texte principal (presque noir, mais pas pur) |
| `--color-brand-700` | `#142d43` | Bleu de Prusse, boutons primaires, sidebar de login |
| `--color-brand-500` | `#234b6c` | Bleu institutionnel, focus rings |
| `--color-accent-500` | `#8e3a2a` | Cassis, kickers editoriaux, hover destructif |
| `--color-accent-300` | `#d17c6c` | Reservation aux filets et soulignements |
| `--color-success-500` | `#3c6a40` | Vert sapin, valides |
| `--color-warning-500` | `#a47a16` | Ocre, evalues / en attente |
| `--color-danger-500` | `#8e3a2a` | Memes valeurs que cassis, rejets |

Justification : un site administratif d'ecole d'ingenieurs francaise ne
peut pas se permettre les violets et les sky generiques. Le bleu de Prusse
evoque la rigueur institutionnelle (Polytechnique, Sciences Po, Marine
nationale) et le cassis apporte la pointe parisienne sans rien sacrifier
au serieux. L'encre chaude evite le look "SaaS bleu glace" tout en
restant lisible sous lumiere artificielle d'amphi.

## Typographie

| Usage | Police | Justification |
|---|---|---|
| **Display** (h1, h2, h3) | Lato 700 / 900 | Sans-serif classique, eprouvee, tres lisible. Fonctionne aussi bien en ecran qu'en projection amphi. Poids 700/900 pour la hierarchie |
| **Body** (UI) | Lato 400 | Memes courbes que les titres : identite homogene, pas de melange serif/sans complique |
| **Mono** (kickers, chiffres, IDs) | ui-monospace systeme | Mono natif (SF Mono / Menlo / Consolas), aucun chargement reseau supplementaire, alignement parfait des chiffres dans les tableaux |

Lato chargee via Google Fonts (poids 400, 700, 900). Le HTML utilise
`lang="fr"`. Choix volontairement classique : Arial / Helvetica / Lato
sont les polices que tout etudiant et tout prof reconnait immediatement,
ce qui ancre la plateforme dans un registre familier sans rien
sacrifier a la lisibilite.

## Philosophie de mise en page

- **Alignement a gauche, mesure fixe.** Le contenu est cale dans
  `max-w-6xl` avec padding lateral. Pas de centrage symetrique facile.
- **Densite assumee.** Les tableaux ne respirent pas excessivement. Un
  administrateur consulte 100 lignes : on lui donne 100 lignes lisibles.
- **Hierarchie editoriale.** Chaque page reprend le pattern presse :
  kicker mono en accent (`Annuaire pedagogique`), grand titre serif
  (`Apprenants`), chapeau de lead en sans-serif gris (`{n} apprenant(s)...`).
- **Filets et separateurs plutot qu'ombres.** Les cartes ont une
  bordure 1px ink-200, jamais d'ombre flottante. Filets verticaux
  pour separer les colonnes du dashboard.
- **Bandeau de chiffres facon presse economique.** Les KPI du dashboard
  admin sont alignes en bandeau horizontal entre deux filets, avec
  chiffres tabulaires Fraunces grands format.

## Micro-animations

Inspiration 21st.dev / Linear : tout est sobre, court et a un sens.

- `sygle-fade-up` : apparition douce (fade + 8px de translation) sur
  l'element `<main>` a chaque changement de route. 320ms, courbe ease-out
  raide. L'utilisateur sent que la page "arrive", pas qu'elle pop.
- `sygle-reveal-1..4` : revelation en cascade des KPI du dashboard et
  des cartes principales (delais 40, 100, 160, 220ms).
- `sygle-lift` : leger soulevement (-1px) + ombre douce au survol des
  cartes. Couleur de bordure passe en brand-400 simultanement.
- `sygle-modal-overlay` / `sygle-modal-panel` : overlay qui fade (180ms),
  panneau qui pop legerement (scale 0.985 -> 1, 220ms).
- `sygle-btn-primary` : bouton primaire qui se souleve d'1px au hover
  et revient a l'appui (feedback tactile sans excederer).
- **Sidebar** : le filet vertical du lien actif s'etire (h-3 -> h-5)
  au hover et passe en accent quand actif.
- **Respect prefer-reduced-motion** : toutes les animations sont
  desactivees si l'utilisateur a active la reduction de mouvement
  systeme (accessibilite).

## Composants cles

- **Boutons.** `rounded-sm` (3-4px max), pas de `rounded-lg/xl`. Primaire
  brand-700, secondaire bordure ink-200 sur fond blanc.
- **Champs de formulaire.** Bordure 1px ink-200, focus ring 1px brand-500
  (jamais 2px sky), label en mono uppercase tracking-wider au-dessus.
- **Tableaux.** En-tete bg-ink-50, th en mono uppercase 11px, lignes
  separees par divide-ink-100, hover discret bg-ink-50/60.
- **Badges de statut.** Carre (`rounded-sm`), `ring-1 ring-inset`,
  mono uppercase 11px tracking-wider. Couleur calee sur le statut, pas
  sur Tailwind par defaut.
- **Modales.** Header bg-ink-50 avec kicker accent et titre Fraunces.
  Footer bg-ink-50 separe par filet. Pas de bouton "X" en haut a droite
  facon SaaS : un bouton "Annuler" textuel suffit, plus francais.
- **Empty states.** Encadre pointille ink-300, titre Fraunces "Votre
  premier depot vous attend.", lead bienveillant et directif, CTA primaire.

## Anti-AI moves (les choix qui rompent avec le look IA)

1. **Une seule famille classique (Lato)** au lieu d'Inter / Geist partout.
   Choix volontairement sage : on ne reconnait pas une App generee par IA
   parce qu'on ne reconnait pas la palette de polices "modernes" de Vercel.
2. **Cassis (`#8e3a2a`) comme accent unique** au lieu d'un indigo/violet.
   Ton typique de la presse francaise, jamais sorti par les LLM par defaut.
3. **Encre chaude (`#f7f6f3`)** au lieu du `bg-slate-50` froid. Tres
   subtil mais radical : l'ecran ne fait plus "fond d'app SaaS".
4. **Kickers en mono uppercase** ("Liste des eleves", "Notation des
   rapports") avant chaque titre. Code de presse, pas code d'app.
5. **Wording francais simple, parle.** "Envoyer mon rapport", "Demander
   a refaire", "Aucun rapport pour l'instant", "Si une note vous semble
   fausse, parlez-en a votre prof referent". Pas un seul "Welcome",
   "Streamline", "Discover", ni de jargon administratif lourd.
6. **Rayons reduits** (`rounded-sm` = 3px) au lieu du `rounded-xl`
   generique. Plus institutionnel, plus journal.
7. **Favicon "S" sur fond bleu de Prusse** avec trait cassis dessous.
   Pas d'isometric 3D coloree.

## Fichiers modifies

### Fondations
- `frontend/src/index.css` : theme Tailwind 4 complet, palette ink/brand/accent, polices, micro-typo
- `frontend/index.html` : lang="fr", meta description, Google Fonts + Fontshare, titre "Sygle - ESEO"
- `frontend/public/favicon.svg` : monogramme Sygle

### Layout commun
- `frontend/src/components/layout/Layout.jsx`
- `frontend/src/components/layout/Sidebar.jsx`
- `frontend/src/components/layout/Navbar.jsx`
- `frontend/src/components/common/ProtectedRoute.jsx`
- `frontend/src/components/common/ui.js` (nouveau : primitives Tailwind partagees)

### Auth
- `frontend/src/pages/auth/Login.jsx`
- `frontend/src/pages/Unauthorized.jsx`

### Espace admin
- `frontend/src/pages/admin/Dashboard.jsx`
- `frontend/src/pages/admin/Apprenants.jsx`
- `frontend/src/pages/admin/Enseignants.jsx`
- `frontend/src/pages/admin/Entreprises.jsx`
- `frontend/src/pages/admin/Rapports.jsx`
- `frontend/src/pages/admin/Soutenances.jsx`
- `frontend/src/pages/admin/Stages.jsx`

### Espace enseignant
- `frontend/src/pages/enseignant/Dashboard.jsx`
- `frontend/src/pages/enseignant/Modules.jsx`
- `frontend/src/pages/enseignant/Rapports.jsx`
- `frontend/src/pages/enseignant/Soutenances.jsx`
- `frontend/src/pages/enseignant/StagesEncadres.jsx`

### Espace apprenant
- `frontend/src/pages/apprenant/Dashboard.jsx`
- `frontend/src/pages/apprenant/Rapports.jsx`
- `frontend/src/pages/apprenant/Soutenances.jsx`
- `frontend/src/pages/apprenant/Stages.jsx`
- `frontend/src/pages/apprenant/SuiviAcademique.jsx`

## Comment lancer et verifier

```bash
cd frontend
npm install
npm run dev
```

Ouvrir http://localhost:3000 et tester les trois espaces :

- **Admin** : login `admin@gestion.com / admin123`
  - `/admin` : bandeau de chiffres editorial, deux cartes statuts
  - `/admin/apprenants` : table dense, modale d'edition a header bleu
  - `/admin/rapports` : filtres en pilules sombre/clair, badges mono
- **Enseignant** : login `enseignant@gestion.com / pass123`
  - `/enseignant` : trois cartes lien dont une accent cassis sur "A evaluer"
  - `/enseignant/rapports` : cartes editoriales avec citation en italique
- **Apprenant** : login `apprenant@gestion.com / pass123`
  - `/apprenant` : "Bonjour {prenom}," en serif grand format
  - `/apprenant/rapports` : grille 3/4 + 1/4 avec note Fraunces XL
  - `/apprenant/suivi` : moyenne generale au format 14.50/20 + mention italique

Build de production :

```bash
cd frontend
npm run build
```

## Limites et pistes pour CIGOL 2

- **Mode sombre** non livre. La palette ink/brand est concue pour fonctionner
  en sombre (inversion `ink-50` <-> `ink-900`), mais pas branche dans
  `index.css`. Travail d'une heure.
- **Iconographie**. On a deliberement renonce a Heroicons / Lucide pour
  eviter le look IA. Aucune icone aujourd'hui : tout est texte + filet
  vertical accent dans la sidebar. Un set d'icones lineart maison
  (style Le Monde / NYT) serait coherent avec la direction.
- **Sidebar mobile**. Pas de drawer responsive aujourd'hui. La sidebar
  prend 16rem en permanence. A faire avant une demo mobile.
- **Modules enseignant**. La page est encore un empty state : l'API
  `/enseignants/me/modules` n'existe pas cote backend. Brancher quand
  l'endpoint sera la.
- **Reglages utilisateur**. Pas de page "Profil / preferences" dans
  cette refonte ; pas dans le scope V1.
- **Tests visuels (Percy / Chromatic)**. Avec une identite aussi
  typographique, une regression visuelle automatisee aurait du sens.

## Sources

- Lato, Google Fonts (poids 400 / 700 / 900) : https://fonts.google.com/specimen/Lato
- EPFL brand guidelines (palette institutionnelle academique) : https://www.epfl.ch/about/overview/identity/
- Linear brand : https://linear.app/brand
- Pennylane Design (Dribbble) : https://dribbble.com/pennylane-design
- ESEO Paris-Velizy (campus du user) : https://www.eseo.fr/
