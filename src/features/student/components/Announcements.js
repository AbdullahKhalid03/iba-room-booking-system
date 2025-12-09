import React, { useState, useEffect } from 'react';
import './Announcements.css';

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [allBuildings, setAllBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [error, setError] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('all'); // 'all' or building name
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

  useEffect(() => {
    loadAnnouncements();
    loadBuildings();
  }, []);

  // Filter announcements when selectedBuilding or announcements changes
  useEffect(() => {
    if (selectedBuilding === 'all') {
      setFilteredAnnouncements(announcements);
    } else {
      const filtered = announcements.filter(ann => 
        ann.building && ann.building.toLowerCase() === selectedBuilding.toLowerCase()
      );
      setFilteredAnnouncements(filtered);
    }
  }, [selectedBuilding, announcements]);

  const loadBuildings = async () => {
    try {
      setLoadingBuildings(true);
      const response = await fetch('http://localhost:5000/api/buildings');
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔍 Buildings API response:', data);
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setAllBuildings(data);
      } else if (data.success && Array.isArray(data.data)) {
        setAllBuildings(data.data);
      } else if (Array.isArray(data.data)) {
        setAllBuildings(data.data);
      } else {
        console.error('Invalid buildings data structure:', data);
      }
    } catch (err) {
      console.error('Error fetching buildings:', err);
    } finally {
      setLoadingBuildings(false);
    }
  };

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');

      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      const endpoint = "http://localhost:5000/api/announcements/all";
      const response = await fetch(endpoint);
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError("Failed to load announcements");
        setLoading(false);
        return;
      }

      // Sort newest first
      const sorted = data.data.sort((a, b) => {
        const dateA = new Date(a.date_posted || a.created_date);
        const dateB = new Date(b.date_posted || b.created_date);
        return dateB - dateA;
      });

      // Normalize format
      const transformed = sorted.map((item) => ({
        id: item.announcement_id || item.ANNOUNCEMENT_ID,
        title: item.title || item.TITLE || 'No Title',
        description: item.description || item.DESCRIPTION || 'No Description',
        date: item.date_posted || item.DATE_POSTED || item.created_date,
        posted_by: item.posted_by || item.POSTED_BY || "Administration",
        building: item.building_name || item.BUILDING_NAME || "General"
      }));

      setAnnouncements(transformed);

    } catch (err) {
      setError("Unable to connect to server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  // ----------------------------
  // UI RETURN
  // ----------------------------
  if (loading) {
    return (
      <div className="announcements-container">
        <div className="announcements-header">
          <h2>Campus Announcements</h2>
          <p>Stay updated with important notices</p>
        </div>

        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="announcements-container">
        <div className="announcements-header">
          <h2>Campus Announcements</h2>
          <p>Stay updated with important notices</p>
        </div>

        <div className="error-state">
          <p className="error-message">{error}</p>
          <button className="retry-btn" onClick={loadAnnouncements}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="announcements-container">

      {/* ---------------- HEADER ---------------- */}
      <div className="announcements-header">
        <div>
          <h2>Campus Announcements</h2>
          <p>Stay updated with important notices and announcements</p>
        </div>

        <div className="header-actions">
          <button className="refresh-btn" onClick={loadAnnouncements}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* ---------------- FILTER SECTION ---------------- */}
      <div className="filter-section" style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        margin: '15px 0',
        borderRadius: '8px',
        borderLeft: '4px solid #550707'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Filter Announcements</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <label htmlFor="building-filter" style={{ fontWeight: '600', fontSize: '14px' }}>
                Filter by Building:
              </label>
              <select
                id="building-filter"
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '2px solid #e0e0e0',
                  fontSize: '14px',
                  minWidth: '200px'
                }}
                disabled={loadingBuildings}
              >
                <option value="all">All Buildings</option>
                {loadingBuildings ? (
                  <option disabled>Loading buildings...</option>
                ) : (
                  allBuildings.map(building => {
                    const buildingName = building.BUILDING_NAME || building.building_name || building.name;
                    const buildingId = building.BUILDING_ID || building.building_id || building.id;
                    return (
                      <option key={buildingId || buildingName} value={buildingName}>
                        {buildingName}
                      </option>
                    );
                  })
                )}
              </select>
              {selectedBuilding !== 'all' && (
                <button
                  onClick={() => setSelectedBuilding('all')}
                  style={{
                    padding: '8px 12px',
                    background: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <div><strong>Total Announcements:</strong> {announcements.length}</div>
              <div><strong>Currently Showing:</strong> {filteredAnnouncements.length}</div>
              {selectedBuilding !== 'all' && (
                <div><strong>Filtered by:</strong> {selectedBuilding}</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Building Stats */}
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
          <div style={{ fontSize: '13px', color: '#666' }}>
            <strong>Buildings with announcements:</strong>{' '}
            {Array.from(new Set(announcements.map(a => a.building)))
              .filter(name => name && name !== 'General')
              .join(', ') || 'None'}
          </div>
        </div>
      </div>

      {/* ---------------- ANNOUNCEMENTS LIST ---------------- */}
      <div className="announcements-list">
        {filteredAnnouncements.length === 0 ? (
          <div className="empty-state">
            <p>
              {selectedBuilding === 'all' 
                ? "No announcements found."
                : `No announcements found for ${selectedBuilding}.`}
            </p>
            {selectedBuilding !== 'all' && (
              <button 
                onClick={() => setSelectedBuilding('all')}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  background: '#550707',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                View All Announcements
              </button>
            )}
          </div>
        ) : (
          filteredAnnouncements.map((a) => (
            <div key={a.id} className="announcement-card">
              
              <div className="announcement-header">
                <div>
                  <h3 className="announcement-title">{a.title}</h3>
                  {a.building !== "General" && (
                    <div style={{ 
                      display: 'inline-block', 
                      background: '#e9ecef', 
                      color: '#495057',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      marginTop: '5px'
                    }}>
                      {a.building}
                    </div>
                  )}
                </div>
                <span className="announcement-date">{formatDate(a.date)}</span>
              </div>

              <div className="announcement-meta">
                <span><strong>Posted by:</strong> {a.posted_by}</span>
                {a.building !== "General" && (
                  <span><strong>Building:</strong> {a.building}</span>
                )}
              </div>

              <div className="announcement-content">
                <p>{a.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default StudentAnnouncements;