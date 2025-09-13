import React, { useState, useEffect } from 'react';
import { Tutor, Student, MatchmakingResult, TutorFormData, StudentFormData } from '@/types/matchmaking';
import { MatchmakingService } from '@/services/matchmakingService';
import { DataService } from '@/services/dataService';
import { AlertService } from '@/services/alertService';
import { TutorForm } from './TutorForm';
import { StudentForm } from './StudentForm';
import { MatchCard } from './MatchCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, GraduationCap, Search, BarChart3, Download, Upload, Trash2 } from 'lucide-react';

export function MatchmakingDashboard() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [matchResults, setMatchResults] = useState<MatchmakingResult[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showTutorForm, setShowTutorForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Charger les données au démarrage
  useEffect(() => {
    // Charger depuis le localStorage
    const savedTutors = DataService.loadTutors();
    const savedStudents = DataService.loadStudents();

    // Si pas de données sauvegardées, charger les données d'exemple
    if (savedTutors.length === 0 && savedStudents.length === 0) {
      const exampleTutors: Tutor[] = [
        {
          id: '1',
          fullName: 'Ahmed Benali',
          subjects: ['Mathématiques', 'Physique'],
          levels: ['Lycée', 'Terminale'],
          availability: [
            { day: 'Lundi', startTime: '18:00', endTime: '20:00' },
            { day: 'Mercredi', startTime: '16:00', endTime: '20:00' },
            { day: 'Samedi', startTime: '10:00', endTime: '19:00' }
          ],
          experience: 5,
          rating: 4.8,
          bio: 'Professeur expérimenté en mathématiques et physique, spécialisé dans la préparation au baccalauréat.'
        },
        {
          id: '2',
          fullName: 'Sarah Martin',
          subjects: ['Physique', 'Chimie'],
          levels: ['Collège', 'Lycée'],
          availability: [
            { day: 'Mercredi', startTime: '14:00', endTime: '16:00' },
            { day: 'Samedi', startTime: '10:00', endTime: '22:00' }
          ],
          experience: 3,
          rating: 4.5
        },
        {
          id: '3',
          fullName: 'Karim Alami',
          subjects: ['Français'],
          levels: ['Terminale'],
          availability: [
            { day: 'Lundi', startTime: '18:00', endTime: '20:00' }
          ],
          experience: 2,
          rating: 4.2
        },
        {
          id: '4',
          fullName: 'Marie Dubois',
          subjects: ['Mathématiques', 'Chimie', 'Biologie'],
          levels: ['Collège', 'Lycée', 'Seconde', 'Première'],
          availability: [
            { day: 'Mardi', startTime: '16:00', endTime: '18:00' },
            { day: 'Jeudi', startTime: '14:00', endTime: '16:00' },
            { day: 'Vendredi', startTime: '17:00', endTime: '19:00' },
            { day: 'Samedi', startTime: '09:00', endTime: '12:00' }
          ],
          experience: 4,
          rating: 4.7,
          bio: 'Professeure passionnée par les sciences, spécialisée dans l\'accompagnement des élèves en difficulté.'
        },
        {
          id: '5',
          fullName: 'Thomas Leroy',
          subjects: ['Anglais', 'Histoire', 'Géographie'],
          levels: ['Collège', 'Lycée', 'Seconde', 'Première', 'Terminale'],
          availability: [
            { day: 'Lundi', startTime: '17:00', endTime: '19:00' },
            { day: 'Mercredi', startTime: '15:00', endTime: '17:00' },
            { day: 'Jeudi', startTime: '18:00', endTime: '20:00' },
            { day: 'Dimanche', startTime: '10:00', endTime: '16:00' }
          ],
          experience: 6,
          rating: 4.9,
          bio: 'Enseignant polyvalent avec une expérience internationale, excellent pédagogue pour tous les niveaux.'
        }
      ];

      const exampleStudents: Student[] = [
        {
          id: '1',
          fullName: 'Ali Benali',
          requestedSubjects: ['Mathématiques'],
          level: 'Lycée',
          availability: [
            { day: 'Lundi', startTime: '18:00', endTime: '20:00' }
          ]
        },
        {
          id: '2',
          fullName: 'Yasmine Kaddouri',
          requestedSubjects: ['Physique'],
          level: 'Collège',
          availability: [
            { day: 'Mercredi', startTime: '14:00', endTime: '16:00' }
          ]
        },
        {
          id: '3',
          fullName: 'Lucas Moreau',
          requestedSubjects: ['Mathématiques', 'Chimie'],
          level: 'Première',
          availability: [
            { day: 'Mardi', startTime: '16:00', endTime: '18:00' },
            { day: 'Jeudi', startTime: '14:00', endTime: '16:00' },
            { day: 'Samedi', startTime: '10:00', endTime: '12:00' }
          ],
          preferences: {
            experience: 'intermediate',
            maxPricePerHour: 30
          }
        },
        {
          id: '4',
          fullName: 'Emma Rousseau',
          requestedSubjects: ['Anglais', 'Histoire'],
          level: 'Terminale',
          availability: [
            { day: 'Lundi', startTime: '17:00', endTime: '19:00' },
            { day: 'Mercredi', startTime: '15:00', endTime: '17:00' },
            { day: 'Dimanche', startTime: '14:00', endTime: '16:00' }
          ],
          preferences: {
            experience: 'advanced',
            maxPricePerHour: 35
          }
        }
      ];

      setTutors(exampleTutors);
      setStudents(exampleStudents);
      // Sauvegarder les données d'exemple
      DataService.saveTutors(exampleTutors);
      DataService.saveStudents(exampleStudents);
    } else {
      setTutors(savedTutors);
      setStudents(savedStudents);
    }
  }, []);

  // Calculer les matchs quand les données changent
  useEffect(() => {
    if (students.length > 0 && tutors.length > 0) {
      const results = MatchmakingService.findAllMatches(students, tutors);
      setMatchResults(results);
    }
  }, [students, tutors]);

  const handleAddTutor = async (tutorData: TutorFormData) => {
    const newTutor: Tutor = {
      id: Date.now().toString(),
      ...tutorData
    };
    
    const updatedTutors = DataService.addTutor(newTutor);
    setTutors(updatedTutors);
    setShowTutorForm(false);
    
    await AlertService.addedSuccessfully('tuteur', newTutor.fullName);
  };

  const handleEditTutor = async (tutorData: TutorFormData) => {
    if (editingTutor) {
      const updatedTutors = DataService.updateTutor(editingTutor.id, tutorData);
      setTutors(updatedTutors);
      setEditingTutor(null);
      
      await AlertService.updatedSuccessfully('tuteur', tutorData.fullName);
    }
  };

  const handleAddStudent = async (studentData: StudentFormData) => {
    const newStudent: Student = {
      id: Date.now().toString(),
      ...studentData
    };
    
    const updatedStudents = DataService.addStudent(newStudent);
    setStudents(updatedStudents);
    setShowStudentForm(false);
    
    await AlertService.addedSuccessfully('élève', newStudent.fullName);
  };

  const handleEditStudent = async (studentData: StudentFormData) => {
    if (editingStudent) {
      const updatedStudents = DataService.updateStudent(editingStudent.id, studentData);
      setStudents(updatedStudents);
      setEditingStudent(null);
      
      await AlertService.updatedSuccessfully('élève', studentData.fullName);
    }
  };

  const deleteTutor = async (tutorId: string) => {
    const tutor = tutors.find(t => t.id === tutorId);
    if (!tutor) return;
    
    const result = await AlertService.confirmDelete(`le tuteur ${tutor.fullName}`);
    if (result.isConfirmed) {
      const updatedTutors = DataService.deleteTutor(tutorId);
      setTutors(updatedTutors);
      await AlertService.deletedSuccessfully('tuteur', tutor.fullName);
    }
  };

  const deleteStudent = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    
    const result = await AlertService.confirmDelete(`l'élève ${student.fullName}`);
    if (result.isConfirmed) {
      const updatedStudents = DataService.deleteStudent(studentId);
      setStudents(updatedStudents);
      await AlertService.deletedSuccessfully('élève', student.fullName);
    }
  };

  // Fonctions d'export/import
  const exportData = async () => {
    const data = DataService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matchmaking-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    await AlertService.exportSuccess();
  };

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          DataService.importData(data);
          setTutors(data.tutors);
          setStudents(data.students);
          
          const totalItems = (data.tutors?.length || 0) + (data.students?.length || 0);
          await AlertService.importSuccess(totalItems);
        } catch (error) {
          console.error('Error importing data:', error);
          AlertService.importError();
        }
      };
      reader.readAsText(file);
    }
  };

  const clearAllData = async () => {
    const result = await AlertService.confirmClearAll();
    if (result.isConfirmed) {
      DataService.clearAllData();
      setTutors([]);
      setStudents([]);
      await AlertService.success('Données effacées', 'Toutes les données ont été supprimées avec succès.');
    }
  };

  const getStats = () => {
    const totalMatches = matchResults.reduce((sum, result) => sum + result.matches.length, 0);
    const perfectMatches = matchResults.filter(result => result.bestMatch?.matchType === 'perfect').length;
    const studentsWithMatches = matchResults.filter(result => result.matches.length > 0).length;

    return {
      totalTutors: tutors.length,
      totalStudents: students.length,
      totalMatches,
      perfectMatches,
      studentsWithMatches,
      matchRate: students.length > 0 ? Math.round((studentsWithMatches / students.length) * 100) : 0
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Système de Matchmaking</h1>
            <p className="text-gray-600 mt-1">Mise en relation tuteurs et élèves</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Dialog open={showTutorForm} onOpenChange={setShowTutorForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un tuteur
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouveau tuteur</DialogTitle>
                </DialogHeader>
                <TutorForm onSubmit={handleAddTutor} />
              </DialogContent>
            </Dialog>

            <Dialog open={showStudentForm} onOpenChange={setShowStudentForm}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un élève
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un nouvel élève</DialogTitle>
                </DialogHeader>
                <StudentForm onSubmit={handleAddStudent} />
              </DialogContent>
            </Dialog>

            <div className="flex gap-2">
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              
              <label htmlFor="import-file">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                  </span>
                </Button>
              </label>
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
              
              <Button variant="destructive" onClick={clearAllData}>
                <Trash2 className="h-4 w-4 mr-2" />
                Effacer tout
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <GraduationCap className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Tuteurs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTutors}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Élèves</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Search className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Matchs totaux</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Taux de match</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.matchRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="matches">Matchs</TabsTrigger>
            <TabsTrigger value="tutors">Tuteurs</TabsTrigger>
            <TabsTrigger value="students">Élèves</TabsTrigger>
            <TabsTrigger value="analytics">Analyses</TabsTrigger>
          </TabsList>

          {/* Onglet Matchs */}
          <TabsContent value="matches" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {matchResults.map((result) => (
                <Card key={result.student.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{result.student.fullName}</span>
                      <Badge variant="outline">
                        {result.matches.length} match{result.matches.length > 1 ? 's' : ''}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {result.student.level} • {result.student.requestedSubjects.join(', ')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.matches.length > 0 ? (
                      result.matches.slice(0, 2).map((match, index) => (
                        <MatchCard key={index} match={match} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>Aucun tuteur correspondant trouvé</p>
                        <p className="text-sm">{result.noMatchesReason}</p>
                      </div>
                    )}
                    {result.matches.length > 2 && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setSelectedStudent(result.student)}
                      >
                        Voir tous les matchs ({result.matches.length})
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Tuteurs */}
          <TabsContent value="tutors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <Card key={tutor.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{tutor.fullName}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingTutor(tutor)}
                        >
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteTutor(tutor.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Matières</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tutor.subjects.map(subject => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Niveaux</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tutor.levels.map(level => (
                          <Badge key={level} variant="outline" className="text-xs">
                            {level}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {tutor.experience && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Expérience:</span> {tutor.experience} ans
                      </p>
                    )}
                    {tutor.rating && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Note:</span> {tutor.rating}/5
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Élèves */}
          <TabsContent value="students" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{student.fullName}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingStudent(student)}
                        >
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteStudent(student.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Niveau</p>
                      <Badge variant="outline">{student.level}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Matières demandées</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {student.requestedSubjects.map(subject => (
                          <Badge key={subject} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Disponibilités</p>
                      <div className="space-y-1 mt-1">
                        {student.availability.map((slot, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            {slot.day} {slot.startTime} - {slot.endTime}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Analyses */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des matchs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Matchs parfaits</span>
                      <Badge className="bg-green-100 text-green-800">
                        {stats.perfectMatches}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Élèves avec matchs</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {stats.studentsWithMatches}/{stats.totalStudents}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taux de réussite</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {stats.matchRate}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Matières les plus demandées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(() => {
                      const subjectCount: { [key: string]: number } = {};
                      students.forEach(student => {
                        student.requestedSubjects.forEach(subject => {
                          subjectCount[subject] = (subjectCount[subject] || 0) + 1;
                        });
                      });
                      return Object.entries(subjectCount)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([subject, count]) => (
                          <div key={subject} className="flex justify-between items-center">
                            <span>{subject}</span>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        ));
                    })()}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog pour voir tous les matchs d'un élève */}
        {selectedStudent && (
          <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tous les matchs pour {selectedStudent.fullName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {(() => {
                  const result = matchResults.find(r => r.student.id === selectedStudent.id);
                  return result ? (
                    result.matches.map((match, index) => (
                      <MatchCard key={index} match={match} showStudentInfo={false} />
                    ))
                  ) : null;
                })()}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog pour modifier un tuteur */}
        {editingTutor && (
          <Dialog open={!!editingTutor} onOpenChange={() => setEditingTutor(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Modifier le tuteur</DialogTitle>
              </DialogHeader>
              <TutorForm 
                onSubmit={handleEditTutor} 
                initialData={editingTutor}
                mode="edit"
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog pour modifier un élève */}
        {editingStudent && (
          <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Modifier l'élève</DialogTitle>
              </DialogHeader>
              <StudentForm 
                onSubmit={handleEditStudent} 
                initialData={editingStudent}
                mode="edit"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
