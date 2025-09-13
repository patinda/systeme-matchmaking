# Gestion des Données - Système de Matchmaking

## 📊 Architecture de gestion des données

### 1. **État local React (État en mémoire)**
```typescript
// Dans MatchmakingDashboard.tsx
const [tutors, setTutors] = useState<Tutor[]>([]);
const [students, setStudents] = useState<Student[]>([]);
const [matchResults, setMatchResults] = useState<MatchmakingResult[]>([]);
```

**Rôle :** Gestion de l'état de l'interface utilisateur en temps réel.

### 2. **Service de données (DataService)**
```typescript
// src/services/dataService.ts
export class DataService {
  static saveTutors(tutors: Tutor[]): void
  static loadTutors(): Tutor[]
  static addTutor(tutor: Tutor): Tutor[]
  static updateTutor(id: string, updatedTutor: Partial<Tutor>): Tutor[]
  static deleteTutor(id: string): Tutor[]
  // ... même pattern pour les élèves
}
```

**Rôle :** Abstraction de la persistance des données avec localStorage.

### 3. **Service de matchmaking (MatchmakingService)**
```typescript
// src/services/matchmakingService.ts
export class MatchmakingService {
  static findMatchesForStudent(student: Student, tutors: Tutor[]): MatchmakingResult
  static findAllMatches(students: Student[], tutors: Tutor[]): MatchmakingResult[]
  static calculateMatch(student: Student, tutor: Tutor): Match
}
```

**Rôle :** Logique métier pour le calcul des matchs.

## 🔄 Flux de données

### Chargement initial
1. **Appel** → `DataService.loadTutors()` et `DataService.loadStudents()`
2. **Vérification** → Si pas de données, charge les données d'exemple
3. **Sauvegarde** → Les données d'exemple sont sauvegardées dans localStorage
4. **État** → Mise à jour de l'état React avec les données chargées

### Ajout d'un tuteur/élève
1. **Formulaire** → L'utilisateur remplit le formulaire
2. **Validation** → Vérification des données côté client
3. **Sauvegarde** → `DataService.addTutor()` ou `DataService.addStudent()`
4. **Persistance** → Sauvegarde automatique dans localStorage
5. **État** → Mise à jour de l'état React
6. **Recalcul** → Recalcul automatique des matchs

### Modification/Suppression
1. **Action** → Clic sur modifier/supprimer
2. **Service** → Appel à `DataService.updateTutor()` ou `DataService.deleteTutor()`
3. **Persistance** → Mise à jour du localStorage
4. **État** → Mise à jour de l'état React
5. **Recalcul** → Recalcul automatique des matchs

## 💾 Persistance des données

### LocalStorage (Implémenté)
```typescript
// Clés utilisées
const TUTORS_KEY = 'matchmaking_tutors';
const STUDENTS_KEY = 'matchmaking_students';

// Sauvegarde
localStorage.setItem(TUTORS_KEY, JSON.stringify(tutors));

// Chargement
const tutors = JSON.parse(localStorage.getItem(TUTORS_KEY) || '[]');
```

**Avantages :**
- ✅ Simple à implémenter
- ✅ Pas de serveur requis
- ✅ Données persistantes entre sessions
- ✅ Fonctionne hors ligne

**Inconvénients :**
- ❌ Limité à un seul navigateur
- ❌ Taille limitée (~5-10MB)
- ❌ Pas de synchronisation multi-appareils

### Alternatives possibles

#### 1. **Supabase (Recommandé pour la production)**
```typescript
// Configuration
const supabase = createClient(url, key);

// CRUD operations
const { data, error } = await supabase
  .from('tutors')
  .select('*')
  .insert([tutor]);
```

**Avantages :**
- ✅ Base de données relationnelle
- ✅ API REST automatique
- ✅ Authentification intégrée
- ✅ Synchronisation multi-appareils
- ✅ Sauvegarde automatique

#### 2. **API REST personnalisée**
```typescript
// Service API
class ApiService {
  async getTutors(): Promise<Tutor[]> {
    const response = await fetch('/api/tutors');
    return response.json();
  }
}
```

**Avantages :**
- ✅ Contrôle total
- ✅ Logique métier côté serveur
- ✅ Sécurité avancée
- ✅ Intégration avec d'autres systèmes

#### 3. **IndexedDB (Pour des données plus complexes)**
```typescript
// Base de données côté client
const request = indexedDB.open('MatchmakingDB', 1);
```

**Avantages :**
- ✅ Plus de stockage que localStorage
- ✅ Transactions
- ✅ Indexation
- ✅ Requêtes complexes

## 🔧 Fonctionnalités de gestion des données

### Export/Import
```typescript
// Export
const exportData = () => {
  const data = DataService.exportData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  // Téléchargement du fichier
};

// Import
const importData = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target?.result as string);
    DataService.importData(data);
  };
};
```

### Validation des données
```typescript
// Types TypeScript pour la validation
interface Tutor {
  id: string;
  fullName: string;
  subjects: string[];
  levels: string[];
  availability: TimeSlot[];
  // ...
}
```

### Gestion des erreurs
```typescript
try {
  localStorage.setItem(TUTORS_KEY, JSON.stringify(tutors));
} catch (error) {
  console.error('Erreur lors de la sauvegarde:', error);
  // Fallback ou notification utilisateur
}
```

## 📈 Évolutions possibles

### 1. **Cache intelligent**
- Mise en cache des résultats de matchmaking
- Invalidation automatique lors des modifications
- Optimisation des performances

### 2. **Synchronisation temps réel**
- WebSockets pour les mises à jour en temps réel
- Collaboration multi-utilisateurs
- Notifications push

### 3. **Backup automatique**
- Sauvegarde périodique
- Versioning des données
- Restauration de points de sauvegarde

### 4. **Analytics avancées**
- Tracking des interactions
- Métriques d'utilisation
- Rapports de performance

## 🎯 Recommandations

### Pour un prototype/démo
- ✅ **LocalStorage** (implémenté) - Simple et efficace

### Pour la production
- 🚀 **Supabase** - Solution complète et évolutive
- 🔧 **API REST** - Si besoin de contrôle total

### Pour des données complexes
- 📊 **IndexedDB** - Si localStorage devient limitant
- 🗄️ **PostgreSQL** - Pour des requêtes complexes

## 📝 Exemple d'utilisation

```typescript
// Charger les données
const tutors = DataService.loadTutors();
const students = DataService.loadStudents();

// Ajouter un tuteur
const newTutor = { id: '1', fullName: 'John Doe', ... };
const updatedTutors = DataService.addTutor(newTutor);

// Calculer les matchs
const matches = MatchmakingService.findAllMatches(students, tutors);

// Exporter les données
DataService.exportData();
```

Cette architecture permet une gestion des données flexible et évolutive, adaptée aux besoins du système de matchmaking.
