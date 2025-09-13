import { Tutor, Student, Match, MatchmakingResult, TimeSlot } from '@/types/matchmaking';

export class MatchmakingService {
  /**
   * Trouve les meilleurs matchs pour un élève donné
   */
  static findMatchesForStudent(student: Student, tutors: Tutor[]): MatchmakingResult {
    const matches: Match[] = [];

    for (const tutor of tutors) {
      const match = this.calculateMatch(student, tutor);
      if (match.compatibilityScore > 0) {
        matches.push(match);
      }
    }

    // Trier par score de compatibilité décroissant
    matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    const bestMatch = matches.length > 0 ? matches[0] : undefined;

    return {
      student,
      matches,
      bestMatch,
      noMatchesReason: matches.length === 0 ? 'Aucun tuteur ne correspond aux critères' : undefined
    };
  }

  /**
   * Calcule le score de compatibilité entre un élève et un tuteur
   */
  private static calculateMatch(student: Student, tutor: Tutor): Match {
    const matchingSubjects = this.getMatchingSubjects(student.requestedSubjects, tutor.subjects);
    const matchingLevels = this.getMatchingLevels(student.level, tutor.levels);
    const commonAvailability = this.getCommonAvailability(student.availability, tutor.availability);

    let compatibilityScore = 0;
    const reasons: string[] = [];

    // Score basé sur les matières (40% du score total)
    const subjectScore = (matchingSubjects.length / student.requestedSubjects.length) * 40;
    compatibilityScore += subjectScore;
    if (matchingSubjects.length > 0) {
      reasons.push(`Matières communes: ${matchingSubjects.join(', ')}`);
    }

    // Score basé sur le niveau (30% du score total)
    const levelScore = matchingLevels.length > 0 ? 30 : 0;
    compatibilityScore += levelScore;
    if (matchingLevels.length > 0) {
      reasons.push(`Niveau compatible: ${matchingLevels.join(', ')}`);
    }

    // Score basé sur la disponibilité (30% du score total)
    const availabilityScore = this.calculateAvailabilityScore(student.availability, tutor.availability);
    compatibilityScore += availabilityScore;
    if (commonAvailability.length > 0) {
      reasons.push(`Créneaux communs: ${commonAvailability.length} créneau(x)`);
    }

    // Bonus pour l'expérience du tuteur
    if (tutor.experience && tutor.experience >= 3) {
      compatibilityScore += 5;
      reasons.push(`Tuteur expérimenté (${tutor.experience} ans)`);
    }

    // Bonus pour la note du tuteur
    if (tutor.rating && tutor.rating >= 4) {
      compatibilityScore += 5;
      reasons.push(`Tuteur bien noté (${tutor.rating}/5)`);
    }

    // Déterminer le type de match
    let matchType: 'perfect' | 'partial' | 'limited' = 'limited';
    if (compatibilityScore >= 80) {
      matchType = 'perfect';
    } else if (compatibilityScore >= 50) {
      matchType = 'partial';
    }

    return {
      tutor,
      student,
      compatibilityScore: Math.round(compatibilityScore),
      matchingSubjects,
      matchingLevels,
      commonAvailability,
      matchType,
      reasons
    };
  }

  /**
   * Trouve les matières communes entre l'élève et le tuteur
   */
  private static getMatchingSubjects(studentSubjects: string[], tutorSubjects: string[]): string[] {
    return studentSubjects.filter(subject => tutorSubjects.includes(subject));
  }

  /**
   * Vérifie la compatibilité des niveaux
   */
  private static getMatchingLevels(studentLevel: string, tutorLevels: string[]): string[] {
    return tutorLevels.filter(level => level === studentLevel);
  }

  /**
   * Trouve les créneaux horaires communs
   */
  private static getCommonAvailability(studentAvailability: TimeSlot[], tutorAvailability: TimeSlot[]): TimeSlot[] {
    const common: TimeSlot[] = [];

    for (const studentSlot of studentAvailability) {
      for (const tutorSlot of tutorAvailability) {
        if (this.isTimeSlotOverlapping(studentSlot, tutorSlot)) {
          common.push(this.getOverlappingTimeSlot(studentSlot, tutorSlot));
        }
      }
    }

    return common;
  }

  /**
   * Vérifie si deux créneaux horaires se chevauchent
   */
  private static isTimeSlotOverlapping(slot1: TimeSlot, slot2: TimeSlot): boolean {
    if (slot1.day !== slot2.day) return false;

    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);

    return start1 < end2 && start2 < end1;
  }

  /**
   * Retourne le créneau horaire commun entre deux créneaux
   */
  private static getOverlappingTimeSlot(slot1: TimeSlot, slot2: TimeSlot): TimeSlot {
    const start1 = this.timeToMinutes(slot1.startTime);
    const end1 = this.timeToMinutes(slot1.endTime);
    const start2 = this.timeToMinutes(slot2.startTime);
    const end2 = this.timeToMinutes(slot2.endTime);

    const commonStart = Math.max(start1, start2);
    const commonEnd = Math.min(end1, end2);

    return {
      day: slot1.day,
      startTime: this.minutesToTime(commonStart),
      endTime: this.minutesToTime(commonEnd)
    };
  }

  /**
   * Calcule le score de disponibilité
   */
  private static calculateAvailabilityScore(studentAvailability: TimeSlot[], tutorAvailability: TimeSlot[]): number {
    const commonSlots = this.getCommonAvailability(studentAvailability, tutorAvailability);
    const totalStudentSlots = studentAvailability.length;
    
    if (totalStudentSlots === 0) return 0;
    
    const availabilityRatio = commonSlots.length / totalStudentSlots;
    return availabilityRatio * 30; // 30% du score total
  }

  /**
   * Convertit une heure en minutes depuis minuit
   */
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Convertit des minutes depuis minuit en heure
   */
  private static minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * Trouve tous les matchs pour tous les élèves
   */
  static findAllMatches(students: Student[], tutors: Tutor[]): MatchmakingResult[] {
    return students.map(student => this.findMatchesForStudent(student, tutors));
  }

  /**
   * Trouve le meilleur tuteur pour un élève spécifique
   */
  static findBestTutorForStudent(student: Student, tutors: Tutor[]): Match | null {
    const result = this.findMatchesForStudent(student, tutors);
    return result.bestMatch || null;
  }

  /**
   * Filtre les tuteurs par matière
   */
  static filterTutorsBySubject(tutors: Tutor[], subject: string): Tutor[] {
    return tutors.filter(tutor => tutor.subjects.includes(subject));
  }

  /**
   * Filtre les tuteurs par niveau
   */
  static filterTutorsByLevel(tutors: Tutor[], level: string): Tutor[] {
    return tutors.filter(tutor => tutor.levels.includes(level));
  }
}
