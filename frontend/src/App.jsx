import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminEnseignants from './pages/admin/Enseignants';
import AdminSoutenances from './pages/admin/Soutenances';
import AdminRapports from './pages/admin/Rapports';
import AdminApprenants from './pages/admin/Apprenants';
import AdminStages from './pages/admin/Stages';
import EnseignantDashboard from './pages/enseignant/Dashboard';
import StagesEncadres from './pages/enseignant/StagesEncadres';
import RapportsEnseignant from './pages/enseignant/Rapports';
import ModulesEnseignant from './pages/enseignant/Modules';
import SoutenancesEnseignant from './pages/enseignant/Soutenances';
import ApprenantDashboard from './pages/apprenant/Dashboard';
import ApprenantStages from './pages/apprenant/Stages';
import ApprenantRapports from './pages/apprenant/Rapports';
import ApprenantSoutenances from './pages/apprenant/Soutenances';
import ApprenantSuivi from './pages/apprenant/SuiviAcademique';
import Unauthorized from './pages/Unauthorized';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Routes Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="enseignants" element={<AdminEnseignants />} />
            <Route path="apprenants" element={<AdminApprenants />} />
            <Route path="stages" element={<AdminStages />} />
            <Route path="soutenances" element={<AdminSoutenances />} />
            <Route path="rapports" element={<AdminRapports />} />
          </Route>

          {/* Routes Enseignant */}
          <Route path="/enseignant" element={
            <ProtectedRoute roles={['ENSEIGNANT']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<EnseignantDashboard />} />
            <Route path="stages" element={<StagesEncadres />} />
            <Route path="rapports" element={<RapportsEnseignant />} />
            <Route path="modules" element={<ModulesEnseignant />} />
            <Route path="soutenances" element={<SoutenancesEnseignant />} />
          </Route>

          {/* Routes Apprenant */}
          <Route path="/apprenant" element={
            <ProtectedRoute roles={['APPRENANT']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<ApprenantDashboard />} />
            <Route path="stages" element={<ApprenantStages />} />
            <Route path="rapports" element={<ApprenantRapports />} />
            <Route path="soutenances" element={<ApprenantSoutenances />} />
            <Route path="suivi" element={<ApprenantSuivi />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
