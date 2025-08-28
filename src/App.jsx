import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Projects from './pages/Projects';
import KnowledgeBase from './pages/KnowledgeBase';
import Deployments from './pages/Deployments';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import System from './pages/System';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Projects />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/knowledge-base"
          element={
            <PrivateRoute>
              <AdminLayout>
                <KnowledgeBase />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/deployments"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Deployments />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Analytics />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Reports />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/system"
          element={
            <PrivateRoute>
              <AdminLayout>
                <System />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
