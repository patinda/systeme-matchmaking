import { Tutor, Student } from '@/types/matchmaking';

// Clés pour le localStorage
const TUTORS_KEY = 'matchmaking_tutors';
const STUDENTS_KEY = 'matchmaking_students';

export class DataService {
  /**
   * Sauvegarder les tuteurs dans le localStorage
   */
  static saveTutors(tutors: Tutor[]): void {
    try {
      localStorage.setItem(TUTORS_KEY, JSON.stringify(tutors));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tuteurs:', error);
    }
  }

  /**
   * Charger les tuteurs depuis le localStorage
   */
  static loadTutors(): Tutor[] {
    try {
      const data = localStorage.getItem(TUTORS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des tuteurs:', error);
      return [];
    }
  }

  /**
   * Sauvegarder les élèves dans le localStorage
   */
  static saveStudents(students: Student[]): void {
    try {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des élèves:', error);
    }
  }

  /**
   * Charger les élèves depuis le localStorage
   */
  static loadStudents(): Student[] {
    try {
      const data = localStorage.getItem(STUDENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des élèves:', error);
      return [];
    }
  }

  /**
   * Ajouter un tuteur
   */
  static addTutor(tutor: Tutor): Tutor[] {
    const tutors = this.loadTutors();
    const newTutors = [...tutors, tutor];
    this.saveTutors(newTutors);
    return newTutors;
  }

  /**
   * Mettre à jour un tuteur
   */
  static updateTutor(id: string, updatedTutor: Partial<Tutor>): Tutor[] {
    const tutors = this.loadTutors();
    const newTutors = tutors.map(tutor => 
      tutor.id === id ? { ...tutor, ...updatedTutor } : tutor
    );
    this.saveTutors(newTutors);
    return newTutors;
  }

  /**
   * Supprimer un tuteur
   */
  static deleteTutor(id: string): Tutor[] {
    const tutors = this.loadTutors();
    const newTutors = tutors.filter(tutor => tutor.id !== id);
    this.saveTutors(newTutors);
    return newTutors;
  }

  /**
   * Ajouter un élève
   */
  static addStudent(student: Student): Student[] {
    const students = this.loadStudents();
    const newStudents = [...students, student];
    this.saveStudents(newStudents);
    return newStudents;
  }

  /**
   * Mettre à jour un élève
   */
  static updateStudent(id: string, updatedStudent: Partial<Student>): Student[] {
    const students = this.loadStudents();
    const newStudents = students.map(student => 
      student.id === id ? { ...student, ...updatedStudent } : student
    );
    this.saveStudents(newStudents);
    return newStudents;
  }

  /**
   * Supprimer un élève
   */
  static deleteStudent(id: string): Student[] {
    const students = this.loadStudents();
    const newStudents = students.filter(student => student.id !== id);
    this.saveStudents(newStudents);
    return newStudents;
  }

  /**
   * Exporter toutes les données
   */
  static exportData(): { tutors: Tutor[], students: Student[] } {
    return {
      tutors: this.loadTutors(),
      students: this.loadStudents()
    };
  }

  /**
   * Importer des données
   */
  static importData(data: { tutors: Tutor[], students: Student[] }): void {
    this.saveTutors(data.tutors);
    this.saveStudents(data.students);
  }

  /**
   * Effacer toutes les données
   */
  static clearAllData(): void {
    localStorage.removeItem(TUTORS_KEY);
    localStorage.removeItem(STUDENTS_KEY);
  }

  /**
   * Vérifier si des données existent
   */
  static hasData(): boolean {
    return this.loadTutors().length > 0 || this.loadStudents().length > 0;
  }
}
