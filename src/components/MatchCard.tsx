import React from 'react';
import { Match } from '@/types/matchmaking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Clock, BookOpen, Users, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  showStudentInfo?: boolean;
}

export function MatchCard({ match, showStudentInfo = false }: MatchCardProps) {
  const getMatchTypeIcon = (type: string) => {
    switch (type) {
      case 'perfect':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'limited':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getMatchTypeColor = (type: string) => {
    switch (type) {
      case 'perfect':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'limited':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMatchTypeLabel = (type: string) => {
    switch (type) {
      case 'perfect':
        return 'Match parfait';
      case 'partial':
        return 'Match partiel';
      case 'limited':
        return 'Match limité';
      default:
        return 'Match';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{match.tutor.fullName}</CardTitle>
          <div className="flex items-center gap-2">
            {getMatchTypeIcon(match.matchType)}
            <Badge className={getMatchTypeColor(match.matchType)}>
              {getMatchTypeLabel(match.matchType)}
            </Badge>
          </div>
        </div>
        
        {/* Score de compatibilité */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Score de compatibilité</span>
            <span className="font-semibold">{match.compatibilityScore}%</span>
          </div>
          <Progress value={match.compatibilityScore} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informations du tuteur */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Matières enseignées</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {match.tutor.subjects.map(subject => (
              <Badge 
                key={subject} 
                variant={match.matchingSubjects.includes(subject) ? "default" : "outline"}
                className={match.matchingSubjects.includes(subject) ? "bg-blue-100 text-blue-800" : ""}
              >
                {subject}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-500" />
            <span className="font-medium">Niveaux pris en charge</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {match.tutor.levels.map(level => (
              <Badge 
                key={level} 
                variant={match.matchingLevels.includes(level) ? "default" : "outline"}
                className={match.matchingLevels.includes(level) ? "bg-green-100 text-green-800" : ""}
              >
                {level}
              </Badge>
            ))}
          </div>
        </div>

        {/* Disponibilités communes */}
        {match.commonAvailability.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="font-medium">Créneaux communs</span>
            </div>
            <div className="space-y-1">
              {match.commonAvailability.map((slot, index) => (
                <div key={index} className="text-sm bg-purple-50 p-2 rounded border">
                  {slot.day} {slot.startTime} - {slot.endTime}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations supplémentaires du tuteur */}
        {(match.tutor.experience || match.tutor.rating || match.tutor.bio) && (
          <div className="space-y-2 pt-2 border-t">
            {match.tutor.experience && (
              <div className="text-sm">
                <span className="font-medium">Expérience:</span> {match.tutor.experience} ans
              </div>
            )}
            {match.tutor.rating && (
              <div className="flex items-center gap-1 text-sm">
                <span className="font-medium">Note:</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < match.tutor.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span>({match.tutor.rating}/5)</span>
              </div>
            )}
            {match.tutor.bio && (
              <div className="text-sm text-gray-600 italic">
                "{match.tutor.bio}"
              </div>
            )}
          </div>
        )}

        {/* Raisons du score */}
        {match.reasons.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <div className="text-sm font-medium">Points positifs:</div>
            <ul className="text-sm space-y-1">
              {match.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Informations de l'élève si demandé */}
        {showStudentInfo && (
          <div className="space-y-2 pt-2 border-t">
            <div className="text-sm font-medium">Élève: {match.student.fullName}</div>
            <div className="text-sm">
              <span className="font-medium">Niveau:</span> {match.student.level}
            </div>
            <div className="text-sm">
              <span className="font-medium">Matières demandées:</span> {match.student.requestedSubjects.join(', ')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
