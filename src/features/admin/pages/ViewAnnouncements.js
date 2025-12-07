import React, { useState, useEffect } from 'react';
import './Announcements.css';

const ViewAnnouncements = () => {
  const [myAnnouncements, setMyAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    loadInchargeAnnouncements();
  }, []);

  const loadInchargeAnnouncements = async () => {
    try {
      setLoading(true);
      console.log('👷 Loading incharge announcements...');
      
      // Get logged in incharge
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('Please login first');
        setLoading(false);
        return;
      }
      
      const user = JSON.parse(userStr);
      const inchargeId = user.Incharge_ID;
      
      if (!inchargeId) {
        setError('Not logged in as Building Incharge');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/announcements/incharge/${inchargeId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔍 API Response:', data);
      
      if (data.success && data.data && Array.isArray(data.data)) {
        console.log(`✅ Found ${data.data.length} announcements by you`);
        
        // SIMPLE FIX: Just use the data as-is if it looks okay
        const transformedData = data.data.map(item => {
          // If item has announcement_id (lowercase), use it as-is
          if (item && typeof item === 'object' && item.announcement_id !== undefined) {
            console.log('✅ Item has lowercase keys, using as-is:', item);
            return {
              announcement_id: item.announcement_id || 0,
              title: item.title || 'No Title',
              description: item.description || 'No Description',
              date_posted: item.date_posted || new Date().toISOString(),
              created_date: item.created_date || null
            };
          }
          
          // If item has ANNOUNCEMENT_ID (uppercase), convert to lowercase
          if (item && typeof item === 'object' && item.ANNOUNCEMENT_ID !== undefined) {
            console.log('✅ Item has UPPERCASE keys, converting:', item);
            return {
              announcement_id: item.ANNOUNCEMENT_ID || 0,
              title: item.TITLE || 'No Title',
              description: item.DESCRIPTION || 'No Description',
              date_posted: item.DATE_POSTED || new Date().toISOString(),
              created_date: item.CREATED_DATE || null
            };
          }
          
          // If it's an array (unlikely since your backend transforms it)
          if (Array.isArray(item) && item.length >= 5) {
            console.log('✅ Item is array:', item);
            return {
              announcement_id: item[0] || 0,
              title: item[1] || 'No Title',
              description: item[2] || 'No Description',
              date_posted: item[3] || new Date().toISOString(),
              created_date: item[4] || null
            };
          }
          
          // Fallback
          console.log('❌ Unknown item format:', item);
          return {
            announcement_id: 0,
            title: 'Error loading',
            description: 'Could not parse announcement data',
            date_posted: new Date().toISOString(),
            created_date: null
          };
        });
        
        console.log('✅ Transformed data:', transformedData);
        setMyAnnouncements(transformedData);
      } else {
        console.error('❌ Invalid data structure:', data);
        setError('Failed to fetch your announcements');
      }
    } catch (err) {
      console.error('❌ Error fetching incharge announcements:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    
    try {
      // Get logged in incharge
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('Please login first');
        return;
      }
      
      const user = JSON.parse(userStr);
      const inchargeId = user.Incharge_ID;
      
      if (!inchargeId) {
        alert('Not logged in as Building Incharge');
        return;
      }

      if (!newAnnouncement.title.trim() || !newAnnouncement.description.trim()) {
        alert('Please fill in both title and description');
        return;
      }

      console.log('📢 Posting new announcement...');
      const response = await fetch('http://localhost:5000/api/announcements/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          erp: inchargeId,
          title: newAnnouncement.title,
          description: newAnnouncement.description
        })
      });

      const data = await response.json();
      console.log('🔍 Post announcement response:', data);

      if (response.ok && data.success) {
        alert('✅ Announcement posted successfully!');
        
        // Reset form
        setNewAnnouncement({ title: '', description: '' });
        setShowNewForm(false);
        
        // Reload announcements
        loadInchargeAnnouncements();
        
        // Trigger refresh for students
        triggerStudentRefresh();
      } else {
        alert(`❌ ${data.error || 'Failed to post announcement'}`);
      }
    } catch (err) {
      console.error('❌ Error posting announcement:', err);
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      // Get logged in incharge
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const inchargeId = user.Incharge_ID;

      console.log('🗑️ Deleting announcement...');
      const response = await fetch('http://localhost:5000/api/announcements/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          announcement_id: announcementId,
          erp: inchargeId
        })
      });

      const data = await response.json();
      console.log('🔍 Delete announcement response:', data);

      if (response.ok && data.success) {
        alert('✅ Announcement deleted successfully!');
        loadInchargeAnnouncements();
        triggerStudentRefresh();
      } else {
        alert(`❌ ${data.error || 'Failed to delete announcement'}`);
      }
    } catch (err) {
      console.error('❌ Error deleting announcement:', err);
      alert('Network error. Please try again.');
    }
  };

  const triggerStudentRefresh = () => {
    console.log('🔄 Students should refresh to see new announcement');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      return 'Date error';
    }
  };

  if (loading) {
    return (
      <div className="announcements">
        <h2>My Announcements</h2>
        <div className="loading">Loading your announcements...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="announcements">
        <h2>My Announcements</h2>
        <div className="error-message">{error}</div>
        <button onClick={loadInchargeAnnouncements} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="announcements">
      <div className="announcements-header">
        <div>
          <h2>My Announcements</h2>
          <p>View and manage announcements you have posted</p>
        </div>
        
        <button 
          className="new-announcement-btn"
          onClick={() => setShowNewForm(true)}
        >
          + New Announcement
        </button>
      </div>

      {/* New Announcement Form */}
      {showNewForm && (
        <div className="announcement-form">
          <h3>Create New Announcement</h3>
          <form onSubmit={handlePostAnnouncement}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({
                  ...newAnnouncement,
                  title: e.target.value
                })}
                placeholder="Enter announcement title"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={newAnnouncement.description}
                onChange={(e) => setNewAnnouncement({
                  ...newAnnouncement,
                  description: e.target.value
                })}
                placeholder="Enter announcement details"
                rows="4"
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Post Announcement
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowNewForm(false);
                  setNewAnnouncement({ title: '', description: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements Count */}
      <div style={{ 
        background: '#f0f7ff', 
        padding: '15px', 
        margin: '15px 0',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <div><strong>Total Announcements Posted:</strong> {myAnnouncements.length}</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          You can edit or delete your announcements below
        </div>
      </div>

      {/* Incharge's Announcements */}
      <div className="announcements-list">
        {myAnnouncements.length === 0 ? (
          <div className="no-announcements">
            <p>You haven't posted any announcements yet.</p>
            <button 
              onClick={() => setShowNewForm(true)}
              className="create-first-btn"
            >
              Create Your First Announcement
            </button>
          </div>
        ) : (
          myAnnouncements.map(announcement => (
            <div key={announcement.announcement_id} className="announcement-card">
              <div className="announcement-header">
                <h3>{announcement.title}</h3>
                <div className="announcement-actions">
                  <span className="announcement-date">
                    {formatDate(announcement.date_posted)}
                  </span>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteAnnouncement(announcement.announcement_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="announcement-meta">
                <span className="posted-by">
                  Status: <strong>Posted</strong>
                </span>
                <span className="building">
                  Posted on: <strong>{formatDate(announcement.date_posted)}</strong>
                </span>
              </div>
              
              <p className="announcement-content">
                {announcement.description}
              </p>
              
              <div style={{ 
                fontSize: '12px', 
                color: '#666',
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid #eee'
              }}>
                Announcement ID: {announcement.announcement_id}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewAnnouncements;