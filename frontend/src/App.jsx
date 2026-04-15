import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import EnseignantDashboard from './pages/enseignant/Dashboard';
import ApprenantDashboard from './pages/apprenant/Dashboard';
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
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Routes Enseignant */}
          <Route path="/enseignant" element={
            <ProtectedRoute roles={['ENSEIGNANT']}>
              <EnseignantDashboard />
            </ProtectedRoute>
          } />

          {/* Routes Apprenant */}
          <Route path="/apprenant" element={
            <ProtectedRoute roles={['APPRENANT']}>
              <ApprenantDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
