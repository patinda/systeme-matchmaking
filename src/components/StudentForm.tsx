import React, { useState } from 'react';
import { StudentFormData, SUBJECTS, LEVELS, DAYS, TimeSlot } from '@/types/matchmaking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface StudentFormProps {
  onSubmit: (student: StudentFormData) => void;
  initialData?: Partial<StudentFormData>;
  mode?: 'create' | 'edit';
}

export function StudentForm({ onSubmit, initialData, mode = 'create' }: StudentFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    fullName: initialData?.fullName || '',
    requestedSubjects: initialData?.requestedSubjects || [],
    level: initialData?.level || '',
    availability: initialData?.availability || [],
    preferences: initialData?.preferences || {}
  });

  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlot>({
    day: 'Lundi',
    startTime: '18:00',
    endTime: '20:00'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: {[key: string]: string} = {};
    
    // Validation des champs obligatoires
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }
    
    if (formData.requestedSubjects.length === 0) {
      newErrors.requestedSubjects = 'Veuillez sélectionner au moins une matière';
    }
    
    if (!formData.level) {
      newErrors.level = 'Veuillez sélectionner un niveau scolaire';
    }
    
    if (formData.availability.length === 0) {
      newErrors.availability = 'Veuillez ajouter au moins un créneau de disponibilité';
    }
    
    setErrors(newErrors);
    
    // Si il y a des erreurs, on s'arrête
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    onSubmit(formData);
  };

  const toggleSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      requestedSubjects: prev.requestedSubjects.includes(subject)
        ? prev.requestedSubjects.filter(s => s !== subject)
        : [...prev.requestedSubjects, subject]
    }));
    
    // Effacer l'erreur si on sélectionne une matière
    if (errors.requestedSubjects) {
      setErrors(prev => ({ ...prev, requestedSubjects: '' }));
    }
  };

  const addTimeSlot = () => {
    if (newTimeSlot.startTime && newTimeSlot.endTime) {
      setFormData(prev => ({
        ...prev,
        availability: [...prev.availability, { ...newTimeSlot }]
      }));
      setNewTimeSlot({
        day: 'Lundi',
        startTime: '18:00',
        endTime: '20:00'
      });
      
      // Effacer l'erreur si on ajoute un créneau
      if (errors.availability) {
        setErrors(prev => ({ ...prev, availability: '' }));
      }
    }
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Ajouter un nouvel élève' : 'Modifier l\'élève'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom complet */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-red-600 font-semibold">Nom complet *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, fullName: e.target.value }));
                if (errors.fullName) {
                  setErrors(prev => ({ ...prev, fullName: '' }));
                }
              }}
              placeholder="Ex: Ali Benali"
              required
              minLength={2}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          {/* Matières demandées */}
          <div className="space-y-2">
            <Label className="text-red-600 font-semibold">Matières demandées *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SUBJECTS.map(subject => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject}
                    checked={formData.requestedSubjects.includes(subject)}
                    onCheckedChange={() => toggleSubject(subject)}
                  />
                  <Label htmlFor={subject} className="text-sm">{subject}</Label>
                </div>
              ))}
            </div>
            {formData.requestedSubjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.requestedSubjects.map(subject => (
                  <Badge key={subject} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            )}
            {errors.requestedSubjects && (
              <p className="text-red-500 text-sm">{errors.requestedSubjects}</p>
            )}
          </div>

          {/* Niveau scolaire */}
          <div className="space-y-2">
            <Label htmlFor="level" className="text-red-600 font-semibold">Niveau scolaire *</Label>
            <Select 
              value={formData.level} 
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, level: value }));
                if (errors.level) {
                  setErrors(prev => ({ ...prev, level: '' }));
                }
              }}
            >
              <SelectTrigger className={errors.level ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner votre niveau" />
              </SelectTrigger>
              <SelectContent>
                {LEVELS.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.level && (
              <p className="text-red-500 text-sm">{errors.level}</p>
            )}
          </div>

          {/* Disponibilités */}
          <div className="space-y-2">
            <Label className="text-red-600 font-semibold">Disponibilités *</Label>
            
            {/* Formulaire pour ajouter un créneau */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label htmlFor="day">Jour</Label>
                <Select value={newTimeSlot.day} onValueChange={(value) => setNewTimeSlot(prev => ({ ...prev, day: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="startTime">Heure de début</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newTimeSlot.startTime}
                  onChange={(e) => setNewTimeSlot(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endTime">Heure de fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newTimeSlot.endTime}
                  onChange={(e) => setNewTimeSlot(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
              <Button type="button" onClick={addTimeSlot} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Liste des créneaux ajoutés */}
            {formData.availability.length > 0 && (
              <div className="space-y-2 mt-4">
                <Label>Créneaux ajoutés</Label>
                {formData.availability.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">
                      {slot.day} {slot.startTime} - {slot.endTime}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTimeSlot(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {errors.availability && (
              <p className="text-red-500 text-sm">{errors.availability}</p>
            )}
          </div>

          {/* Préférences (optionnel) */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Préférences (optionnel)</Label>
            
            {/* Niveau d'expérience souhaité */}
            <div className="space-y-2">
              <Label htmlFor="experience">Niveau d'expérience souhaité</Label>
              <Select 
                value={formData.preferences?.experience || ''} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  preferences: { 
                    ...prev.preferences, 
                    experience: value as 'beginner' | 'intermediate' | 'advanced' 
                  } 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Débutant</SelectItem>
                  <SelectItem value="intermediate">Intermédiaire</SelectItem>
                  <SelectItem value="advanced">Avancé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prix maximum par heure */}
            <div className="space-y-2">
              <Label htmlFor="maxPrice">Prix maximum par heure (€)</Label>
              <Input
                id="maxPrice"
                type="number"
                min="0"
                value={formData.preferences?.maxPricePerHour || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  preferences: { 
                    ...prev.preferences, 
                    maxPricePerHour: parseInt(e.target.value) || undefined 
                  } 
                }))}
                placeholder="Ex: 25"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            {mode === 'create' ? 'Ajouter l\'élève' : 'Mettre à jour'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
