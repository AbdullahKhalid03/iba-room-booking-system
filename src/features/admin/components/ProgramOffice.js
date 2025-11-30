import React, { useState } from "react";
import AddBuilding from "../pages/AddBuilding";
import AddRoom from "../pages/AddRoom";
import AddBooking from "../pages/AddBooking";
import ViewBookings from "../pages/ViewBooking";
import "./ProgramOffice.css";

const ProgramOffice = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("add-building");

  const renderContent = () => {
    switch (activeTab) {
      case "add-building": return <AddBuilding />;
      case "add-room": return <AddRoom />;
      case "add-booking": return <AddBooking />;
      case "view-bookings": return <ViewBookings />;
      default: return <AddBuilding />;
    }
  };

  return (
    <div className="program-office-dashboard">
      {/* Sidebar */}
      <aside className="navigation-sidebar">
        <div className="user-info-section">
          <div className="profile-circle">
            <span className="profile-initial">P</span>
          </div>
          <h3 className="user-name">Program Office</h3>
          <p className="user-program">Administrator</p>
        </div>

        <nav className="navigation-tabs">
          <button className={`nav-tab ${activeTab === "add-building" ? "active" : ""}`} onClick={() => setActiveTab("add-building")}>Add Building</button>
          <button className={`nav-tab ${activeTab === "add-room" ? "active" : ""}`} onClick={() => setActiveTab("add-room")}>Add Room</button>
          <button className={`nav-tab ${activeTab === "add-booking" ? "active" : ""}`} onClick={() => setActiveTab("add-booking")}>Add Booking</button>
          <button className={`nav-tab ${activeTab === "view-bookings" ? "active" : ""}`} onClick={() => setActiveTab("view-bookings")}>View Bookings</button>
        </nav>

        <div className="logout-section">
          <button onClick={onLogout} className="sidebar-logout-btn">Logout</button>
        </div>
      </aside>

      {/* MAIN Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1 className="header-title">Program Office Dashboard</h1>
          <p className="header-subtitle">Manage buildings, rooms & bookings</p>
        </header>

        <div className="content-area-full">
          <div className="content-panel-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgramOffice;
