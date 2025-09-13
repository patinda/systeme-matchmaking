// Types pour le système de matchmaking tuteur-élève

export interface TimeSlot {
  day: string; // "Lundi", "Mardi", etc.
  startTime: string; // "18:00"
  endTime: string; // "20:00"
}

export interface Tutor {
  id: string;
  fullName: string;
  subjects: string[]; // ["Mathématiques", "Physique", "Français"]
  levels: string[]; // ["Collège", "Lycée", "Terminale"]
  availability: TimeSlot[];
  experience?: number; // années d'expérience (optionnel)
  rating?: number; // note sur 5 (optionnel)
  bio?: string; // description du tuteur (optionnel)
}

export interface Student {
  id: string;
  fullName: string;
  requestedSubjects: string[]; // matières demandées
  level: string; // niveau scolaire
  availability: TimeSlot[];
  preferences?: {
    preferredTimeSlots?: TimeSlot[];
    maxPricePerHour?: number;
    experience?: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface Match {
  tutor: Tutor;
  student: Student;
  compatibilityScore: number; // 0-100
  matchingSubjects: string[]; // matières en commun
  matchingLevels: string[]; // niveaux en commun
  commonAvailability: TimeSlot[]; // créneaux communs
  matchType: 'perfect' | 'partial' | 'limited'; // type de match
  reasons: string[]; // raisons du score
}

export interface MatchmakingResult {
  student: Student;
  matches: Match[];
  bestMatch?: Match;
  noMatchesReason?: string;
}

// Types pour les formulaires
export interface TutorFormData {
  fullName: string;
  subjects: string[];
  levels: string[];
  availability: TimeSlot[];
  experience?: number;
  rating?: number;
  bio?: string;
}

export interface StudentFormData {
  fullName: string;
  requestedSubjects: string[];
  level: string;
  availability: TimeSlot[];
  preferences?: {
    preferredTimeSlots?: TimeSlot[];
    maxPricePerHour?: number;
    experience?: 'beginner' | 'intermediate' | 'advanced';
  };
}

// Constantes pour les matières et niveaux
export const SUBJECTS = [
  'Mathématiques',
  'Physique',
  'Chimie',
  'Français',
  'Anglais',
  'Espagnol',
  'Histoire',
  'Géographie',
  'Sciences',
  'Biologie',
  'Philosophie',
  'Économie',
  'Informatique',
  'Arts',
  'Musique'
] as const;

export const LEVELS = [
  'Primaire',
  'Collège',
  'Lycée',
  'Seconde',
  'Première',
  'Terminale',
  'Supérieur'
] as const;

export const DAYS = [
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
  'Dimanche'
] as const;
