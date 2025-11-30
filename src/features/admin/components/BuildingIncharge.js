import React, { useState } from "react";

import AddAnnouncement from "../pages/AddAnnouncements";
import ViewAnnouncements from "../pages/ViewAnnouncements";
import AddBooking from "../pages/AddBooking_BI";
import ViewBooking from "../pages/ViewBooking_BI";

import "./BuildingIncharge.css";

const BuildingIncharge = ({ onLogout }) => {

  // DEFAULT: Add Booking opens first
  const [active, setActive] = useState("add-booking");

  const renderPage = () => {
    switch (active) {
      case "add-booking": return <AddBooking />;
      case "add-announcement": return <AddAnnouncement />;
      case "view-booking": return <ViewBooking />;
      case "view-announcement": return <ViewAnnouncements />;
      default: return <AddBooking />;
    }
  };

  return (
    <div className="program-office-dashboard">

      {/* Sidebar */}
      <aside className="navigation-sidebar">
        <div className="user-info-section">
          <div className="profile-circle"><span>B</span></div>
          <h3 className="user-name">Building Incharge</h3>
          <p className="user-program">Administrator</p>
        </div>

        <nav className="navigation-tabs">

          {/* 1️⃣ Add Booking */}
          <button
            className={`nav-tab ${active==="add-booking" ? "active" : ""}`}
            onClick={() => setActive("add-booking")}
          >
            Add Booking
          </button>

          {/* 2️⃣ Add Announcement */}
          <button
            className={`nav-tab ${active==="add-announcement" ? "active" : ""}`}
            onClick={() => setActive("add-announcement")}
          >
            Add Announcement
          </button>

          {/* 3️⃣ View Bookings */}
          <button
            className={`nav-tab ${active==="view-booking" ? "active" : ""}`}
            onClick={() => setActive("view-booking")}
          >
            View Bookings
          </button>

          {/* 4️⃣ View Announcements */}
          <button
            className={`nav-tab ${active==="view-announcement" ? "active" : ""}`}
            onClick={() => setActive("view-announcement")}
          >
            View Announcements
          </button>

        </nav>

        <div className="logout-section">
          <button onClick={onLogout} className="sidebar-logout-btn">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="header-title">Building Incharge Dashboard</h1>
          <p className="header-subtitle">
            Manage bookings & announcements
          </p>
        </header>

        <div className="content-area-full">
          <div className="content-panel-full">
            {renderPage()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuildingIncharge;
