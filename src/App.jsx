import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginForm from './components/AdminLoginForm';
import ErrorBoundary from './components/ErrorBoundary';

function MainLayout() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentWellnessUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setShowDashboard(true);
      setShowLogin(false);
      setShowRegister(false);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setShowDashboard(true);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentWellnessUser');
    setShowLogin(true);
    setShowDashboard(false);
    setShowRegister(false);
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hide Navigation for Admin Dashboard and Admin Login */}
      {currentUser?.email !== 'admin@campus.edu' && location.pathname !== '/admin-login' && (
        <Navigation
          currentUser={currentUser}
          onLogout={handleLogout}
          onShowLogin={() => { }}
          onShowRegister={() => { }}
        />
      )}
      <div className="w-full">
        <Routes>
          <Route path="/" element={!currentUser ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} onShowRegister={() => { }} />} />
          <Route path="/admin-login" element={<AdminLoginForm onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterForm onShowLogin={() => { }} />} />
          <Route
            path="/dashboard"
            element={
              currentUser ? (
                currentUser.email === 'admin@campus.edu' ?
                  <Navigate to="/admin" replace /> :
                  <ErrorBoundary>
                    <Dashboard currentUser={currentUser} />
                  </ErrorBoundary>
              ) : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/admin"
            element={
              currentUser?.email === 'admin@campus.edu' ?
                <ErrorBoundary>
                  <AdminDashboard onLogout={handleLogout} />
                </ErrorBoundary> :
                <Navigate to="/admin-login" replace />
            }
          />
          <Route path="*" element={<div>Not Found. <Link to="/" className="btn btn-primary">Go Home</Link></div>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;
