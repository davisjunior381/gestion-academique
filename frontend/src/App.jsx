import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
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

          {/* Routes Admin avec Layout */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
          </Route>

          {/* Routes Enseignant avec Layout */}
          <Route path="/enseignant" element={
            <ProtectedRoute roles={['ENSEIGNANT']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<EnseignantDashboard />} />
          </Route>

          {/* Routes Apprenant avec Layout */}
          <Route path="/apprenant" element={
            <ProtectedRoute roles={['APPRENANT']}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<ApprenantDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
