import { Routes, Route, Navigate } from 'react-router-dom';
import { MatchmakingDashboard } from '@/components/MatchmakingDashboard';

// Composant de loading
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export function AppRoutes() {
  return (
    <Routes>
      {/* Route principale */}
      <Route path="/" element={<MatchmakingDashboard />} />
      
      {/* Route par défaut */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
