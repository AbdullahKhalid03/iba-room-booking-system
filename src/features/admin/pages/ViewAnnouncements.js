import React, { useEffect, useState } from "react";
import "./Announcements.css";  // We will create this CSS next

const ViewAnnouncements_BI = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      // TODO: Connect backend when ready
      // const res = await fetch("http://localhost:5000/api/announcement/all");
      // const result = await res.json();
      // if (result.success) setAnnouncements(result.data);

      // 🔥 TEMPORARY HARD-CODED DATA (remove after backend)
      setAnnouncements([
        {
          id: 1,
          title: "Maintenance Work",
          description: "Room A-203 will remain closed tomorrow.",
          date: "2025-11-30"
        },
        {
          id: 2,
          title: "System Outage",
          description: "Room booking portal will be offline from 6-7 PM.",
          date: "2025-12-01"
        }
      ]);

    } catch (err) {
      console.log("Announcement Loading Error:", err);
    }
  };

  return (
    <div className="announcements">
      <h2>Announcements</h2>
      <p>View all announcements created by you</p>

      <div className="announcements-list">
        {announcements.map((a) => (
          <div key={a.id} className="announcement-card">
            
            <span className="announcement-date">{a.date}</span>

            <h3>{a.title}</h3>
            <p>{a.description}</p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewAnnouncements_BI;
