// src/features/student/pages/StudentDashboard.js
import React, { useState } from 'react';
import './StudentDashboard.css';

import ViewAllRooms from '../components/ViewAllRooms';
import ClassroomBooking from '../components/ClassroomBooking';
import BreakoutBooking from '../components/BreakoutBooking';
import Announcements from '../components/Announcements';
import BookingHistory from '../components/BookingHistory';
import Notifications from '../components/Notifications';

const StudentDashboard = ({ onLogout, userData }) => {
  const [activeView, setActiveView] = useState('viewAllRooms');

  console.log('UserData in StudentDashboard:', userData);

  const userInfo = userData ? {
    name: userData.name || 'Student',
    program: userData.program || 'Not Set', 
    intakeYear: userData.intakeYear || 'Not Set',
    erp: userData.erp || 'Not Set',
    email: userData.email || ''
  } : {
    name: 'Student',
    program: 'Not Set', 
    intakeYear: 'Not Set',
    erp: 'Not Set',
    email: ''
  };

  const displayERP = userInfo.erp && userInfo.erp !== 'Not Set' ? userInfo.erp : 'Not Set';
  const displayProgram = userInfo.program || 'Not Set';
  const displayIntakeYear = userInfo.intakeYear || 'Not Set';

  // ✅ SIMPLE TEXT-ONLY NAVIGATION TABS
  const navigationItems = [
    { id: 'viewAllRooms', label: 'View All Rooms' },
    { id: 'classroom', label: 'Classroom Booking' },
    { id: 'breakout', label: 'Breakout Room' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'notifications', label: 'Notifications' },   // ← JUST TEXT TAB
    { id: 'bookingHistory', label: 'Booking History' }
  ];

  const getHeaderInfo = () => {
    const info = {
      'viewAllRooms': { title: 'View All Rooms', subtitle: 'Browse and filter all available rooms' },
      'classroom': { title: 'Classroom Booking', subtitle: 'Reserve classrooms for academic purposes' },
      'breakout': { title: 'Breakout Room Booking', subtitle: 'Book breakout rooms for group discussions' },
      'announcements': { title: 'Announcements', subtitle: 'Latest university updates and notices' },
      'notifications': { title: 'Notifications', subtitle: 'Your latest activity updates' },
      'bookingHistory': { title: 'Booking History', subtitle: 'View and manage your reservations' }
    };
    return info[activeView] || { title: 'Student Dashboard', subtitle: 'Manage your room bookings' };
  };

  const renderMainContent = () => {
    const studentERP = userInfo.erp !== 'Not Set' ? userInfo.erp : null;

    switch (activeView) {
      case 'viewAllRooms': return <ViewAllRooms studentERP={studentERP} />;
      case 'classroom': return <ClassroomBooking studentERP={studentERP} />;
      case 'breakout': return <BreakoutBooking studentERP={studentERP} />;
      case 'announcements': return <Announcements />;
      case 'notifications': return <Notifications studentERP={studentERP} />;
      case 'bookingHistory': return <BookingHistory studentERP={studentERP} />;
      default: return <ViewAllRooms studentERP={studentERP} />;
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="student-dashboard">

      {/* Sidebar */}
      <aside className="navigation-sidebar">

        {/* User Info */}
        <div className="user-info-section">
          <div className="profile-circle">
            <span className="profile-initial">{userInfo.name.charAt(0)}</span>
          </div>
          <h3 className="user-name">{userInfo.name}</h3>
          <p className="user-program">{displayProgram} • {displayIntakeYear}</p>
          <p className="user-erp">ERP: {displayERP}</p>
        </div>

        {/* Navigation Tabs */}
        <nav className="navigation-tabs">
          {navigationItems.map(item => (
            <button
              key={item.id}
              className={`nav-tab ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="logout-section">
          <button onClick={onLogout} className="sidebar-logout-btn">
            Logout
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="header-title">{headerInfo.title}</h1>
          <p className="header-subtitle">{headerInfo.subtitle}</p>
        </header>

        <div className="content-area-full">
          <div className="content-panel-full">
            {renderMainContent()}
          </div>
        </div>
      </main>

    </div>
  );
};

export default StudentDashboard;
