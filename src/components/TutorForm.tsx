import React, { useState } from 'react';
import { TutorFormData, SUBJECTS, LEVELS, DAYS, TimeSlot } from '@/types/matchmaking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface TutorFormProps {
  onSubmit: (tutor: TutorFormData) => void;
  initialData?: Partial<TutorFormData>;
  mode?: 'create' | 'edit';
}

export function TutorForm({ onSubmit, initialData, mode = 'create' }: TutorFormProps) {
  const [formData, setFormData] = useState<TutorFormData>({
    fullName: initialData?.fullName || '',
    subjects: initialData?.subjects || [],
    levels: initialData?.levels || [],
    availability: initialData?.availability || [],
    experience: initialData?.experience || 0,
    rating: initialData?.rating || 0,
    bio: initialData?.bio || ''
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
    
    if (formData.subjects.length === 0) {
      newErrors.subjects = 'Veuillez sélectionner au moins une matière';
    }
    
    if (formData.levels.length === 0) {
      newErrors.levels = 'Veuillez sélectionner au moins un niveau';
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
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
    
    // Effacer l'erreur si on sélectionne une matière
    if (errors.subjects) {
      setErrors(prev => ({ ...prev, subjects: '' }));
    }
  };

  const toggleLevel = (level: string) => {
    setFormData(prev => ({
      ...prev,
      levels: prev.levels.includes(level)
        ? prev.levels.filter(l => l !== level)
        : [...prev.levels, level]
    }));
    
    // Effacer l'erreur si on sélectionne un niveau
    if (errors.levels) {
      setErrors(prev => ({ ...prev, levels: '' }));
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
          {mode === 'create' ? 'Ajouter un nouveau tuteur' : 'Modifier le tuteur'}
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
              placeholder="Ex: Ahmed Benali"
              required
              minLength={2}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>

          {/* Matières enseignées */}
          <div className="space-y-2">
            <Label className="text-red-600 font-semibold">Matières enseignées *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {SUBJECTS.map(subject => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject}
                    checked={formData.subjects.includes(subject)}
                    onCheckedChange={() => toggleSubject(subject)}
                  />
                  <Label htmlFor={subject} className="text-sm">{subject}</Label>
                </div>
              ))}
            </div>
            {formData.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.subjects.map(subject => (
                  <Badge key={subject} variant="secondary">
                    {subject}
                  </Badge>
                ))}
              </div>
            )}
            {errors.subjects && (
              <p className="text-red-500 text-sm">{errors.subjects}</p>
            )}
          </div>

          {/* Niveaux pris en charge */}
          <div className="space-y-2">
            <Label className="text-red-600 font-semibold">Niveaux pris en charge *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {LEVELS.map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={level}
                    checked={formData.levels.includes(level)}
                    onCheckedChange={() => toggleLevel(level)}
                  />
                  <Label htmlFor={level} className="text-sm">{level}</Label>
                </div>
              ))}
            </div>
            {formData.levels.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.levels.map(level => (
                  <Badge key={level} variant="outline">
                    {level}
                  </Badge>
                ))}
              </div>
            )}
            {errors.levels && (
              <p className="text-red-500 text-sm">{errors.levels}</p>
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
                <Label>Creneaux ajoutés</Label>
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

          {/* Expérience (optionnel) */}
          <div className="space-y-2">
            <Label htmlFor="experience">Années d'expérience (optionnel)</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              value={formData.experience || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
              placeholder="Ex: 3"
            />
          </div>

          {/* Note (optionnel) */}
          <div className="space-y-2">
            <Label htmlFor="rating">Note sur 5 (optionnel)</Label>
            <Select 
              value={formData.rating?.toString() || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, rating: parseFloat(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une note" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(rating => (
                  <SelectItem key={rating} value={rating.toString()}>{rating}/5</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bio (optionnel) */}
          <div className="space-y-2">
            <Label htmlFor="bio">Description (optionnel)</Label>
            <textarea
              id="bio"
              className="w-full p-2 border rounded-md resize-none"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Décrivez votre expérience et votre approche pédagogique..."
            />
          </div>

          <Button type="submit" className="w-full">
            {mode === 'create' ? 'Ajouter le tuteur' : 'Mettre à jour'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
