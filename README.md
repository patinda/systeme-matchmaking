# Système de Matchmaking Tuteur-Élève

Un système intelligent de mise en relation entre tuteurs et élèves basé sur les matières enseignées, le niveau scolaire et les disponibilités.

## 🎯 Objectifs

Ce projet répond au test technique pour le poste de Développeur Junior chez Studena. Il vise à créer un système de matchmaking efficace qui permet de :

- **Modéliser une base de données simple** pour gérer tuteurs et élèves
- **Concevoir un algorithme de mise en relation** intelligent
- **Écrire un code clair et structuré** avec TypeScript et React
- **Ajouter des fonctionnalités pertinentes** comme le scoring de compatibilité

## ✨ Fonctionnalités

### Données gérées

**Tuteurs :**
- ID, nom complet
- Matières enseignées (Mathématiques, Physique, Français, etc.)
- Niveaux pris en charge (Collège, Lycée, Terminale, etc.)
- Disponibilités (créneaux horaires par jour)
- Expérience et note (optionnels)
- Description personnelle (optionnelle)

**Élèves :**
- ID, nom complet
- Matières demandées
- Niveau scolaire
- Disponibilités
- Préférences (niveau d'expérience souhaité, prix max, etc.)

### Algorithme de matchmaking

L'algorithme calcule un **score de compatibilité (0-100%)** basé sur :

1. **Matières communes (40%)** - Correspondance entre matières demandées et enseignées
2. **Niveau scolaire (30%)** - Compatibilité des niveaux
3. **Disponibilités (30%)** - Créneaux horaires communs
4. **Bonus expérience (5%)** - Si le tuteur a 3+ ans d'expérience
5. **Bonus note (5%)** - Si le tuteur a une note ≥ 4/5

### Types de matchs

- **Match parfait (≥80%)** : Correspondance excellente sur tous les critères
- **Match partiel (50-79%)** : Correspondance satisfaisante
- **Match limité (<50%)** : Correspondance minimale

## 🚀 Installation et lancement

### Prérequis

- Node.js 20.19.1 ou supérieur
- npm 10.8.2 ou supérieur

### Installation

```bash
# Cloner le projet
git clone <url-du-repo>

# Installer les dépendances
   npm install

# Lancer le serveur de développement
npm run dev
```

### Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Linting
npm run lint

# Aperçu de la production
npm run preview
   ```

## 🛠️ Technologies utilisées

- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et serveur de développement
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Composants UI accessibles
- **Lucide React** - Icônes
- **React Router** - Navigation

## 📁 Structure du projet

```
src/
├── components/           # Composants React
│   ├── ui/              # Composants UI de base
│   ├── TutorForm.tsx    # Formulaire d'ajout/modification tuteur
│   ├── StudentForm.tsx  # Formulaire d'ajout/modification élève
│   ├── MatchCard.tsx    # Carte d'affichage d'un match
│   └── MatchmakingDashboard.tsx # Tableau de bord principal
├── services/            # Services métier
│   └── matchmakingService.ts # Algorithme de matchmaking
├── types/               # Types TypeScript
│   └── matchmaking.ts   # Types pour le système de matchmaking
└── lib/                 # Utilitaires
    └── utils.ts         # Fonctions utilitaires
```

## 🎮 Utilisation

### 1. Ajouter des tuteurs
- Cliquer sur "Ajouter un tuteur"
- Remplir les informations : nom, matières, niveaux, disponibilités
- Ajouter des informations optionnelles (expérience, note, description)

### 2. Ajouter des élèves
- Cliquer sur "Ajouter un élève"
- Remplir les informations : nom, matières demandées, niveau, disponibilités
- Définir des préférences optionnelles

### 3. Consulter les matchs
- L'onglet "Matchs" affiche automatiquement les meilleures correspondances
- Chaque match montre le score de compatibilité et les détails
- Possibilité de voir tous les matchs pour un élève

### 4. Gérer les données
- Onglets "Tuteurs" et "Élèves" pour voir et modifier les données
- Boutons de modification et suppression pour chaque entrée

### 5. Analyser les performances
- Onglet "Analyses" avec statistiques et métriques
- Répartition des types de matchs
- Matières les plus demandées

## 🔧 Choix techniques

### Architecture
- **Composants fonctionnels** avec hooks React
- **TypeScript strict** pour la sécurité des types
- **Séparation des responsabilités** : UI, logique métier, types
- **Service pattern** pour l'algorithme de matchmaking

### Algorithme de matchmaking
- **Scoring pondéré** pour une évaluation précise
- **Détection de chevauchements** de créneaux horaires
- **Classification des matchs** (parfait/partiel/limité)
- **Raisons détaillées** pour chaque score

### Interface utilisateur
- **Design responsive** avec Tailwind CSS
- **Composants accessibles** avec Radix UI
- **Feedback visuel** avec badges et indicateurs de score
- **Navigation intuitive** avec onglets

## 🚀 Améliorations possibles

### Fonctionnalités bonus implémentées
- ✅ **Score de compatibilité (0-100%)**
- ✅ **Interface utilisateur moderne et intuitive**
- ✅ **Gestion des cas sans match**
- ✅ **Système de préférences avancé**
- ✅ **Analyses et statistiques**

### Améliorations futures
- **Base de données persistante** (Supabase, PostgreSQL)
- **Authentification utilisateur**
- **Système de réservation de créneaux**
- **Notifications en temps réel**
- **Chat intégré tuteur-élève**
- **Système de paiement**
- **Évaluations et avis**
- **Géolocalisation** pour les cours en présentiel
- **Export des données** (PDF, Excel)
- **API REST** pour intégrations externes

## 📊 Exemple d'utilisation

### Données d'exemple incluses

**Tuteurs :**
- Ahmed Benali : Mathématiques, Physique | Lycée, Terminale | Lun 18h-20h, Mer 16h-20h, Sam 10h-19h
- Sarah Martin : Physique, Chimie | Collège, Lycée | Mer 14h-16h, Sam 10h-22h
- Karim Alami : Français | Terminale | Lun 18h-20h

**Élèves :**
- Ali Benali : Mathématiques | Lycée | Lun 18h-20h
- Yasmine Kaddouri : Physique | Collège | Mer 14h-16h

### Résultats attendus
- **Ali → Ahmed** : Match parfait (100%) - matière + niveau + disponibilité
- **Yasmine → Sarah** : Match parfait (100%) - matière + niveau + disponibilité

## 🎯 Critères d'évaluation

- ✅ **Structure du code** : Code lisible, bien organisé, commenté
- ✅ **Modèle de données** : Structure pertinente et extensible
- ✅ **Algorithme de mise en relation** : Logique claire et efficace
- ✅ **Design** : Interface simple et intuitive
- ✅ **Créativité** : Fonctionnalités bonus et améliorations

## 📝 Déploiement

Le projet est prêt pour le déploiement sur Vercel :

```bash
# Build de production
npm run build

# Déploiement sur Vercel
vercel --prod
```

## 👨‍💻 Auteur

Développé dans le cadre du test technique Studena - Développeur Junior

---

*Durée de développement : ~3 heures*