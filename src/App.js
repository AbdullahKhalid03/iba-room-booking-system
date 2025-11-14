// src/App.js
import React, { useState } from 'react';
import './App.css';
import LoginForm from './features/auth/components/LoginForm';
import AdminDashboard from './features/admin/pages/AdminDashboard';

import backgroundImage from './assets/images/iba_background.jpeg';


function App() {
  const [currentView, setCurrentView] = useState('login');
  const [userType, setUserType] = useState('student');
  const [userRole, setUserRole] = useState(''); // Store specific role

  const handleLogin = (type, role = '') => {
    setUserType(type);
    setUserRole(role); // Store the specific role
    setCurrentView(type); // 'admin' or 'student'
  };

  const handleLogout = () => {
    setCurrentView('login');
    setUserRole(''); // Clear role on logout
  };

  return (
    <div 
  className="App"
  style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh'
  }}
>

      {currentView === 'login' && (
        <LoginForm onLogin={handleLogin} onUserTypeChange={setUserType} />
      )}
      
      {currentView === 'admin' && (
        <AdminDashboard onLogout={handleLogout} userRole={userRole} />
      )}
      
      {currentView === 'student' && (
        <div style={{ 
          background: 'white', 
          padding: '40px', 
          borderRadius: '10px',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#800000', marginBottom: '20px' }}>Student Dashboard</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>Student booking features coming soon...</p>
          <button 
            onClick={handleLogout}
            style={{
              background: '#800000',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;