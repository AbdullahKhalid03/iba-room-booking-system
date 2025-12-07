import React, { useState, useEffect } from "react";
import "./Announcements.css";

const AddAnnouncement = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: ""
  });
  const [loading, setLoading] = useState(false);
  const [minDate, setMinDate] = useState("");

  // Get the BI's ERP from localStorage
  const BI_ERP = Number(localStorage.getItem("erp")) || 0;

  useEffect(() => {
    // Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // Validate that date is not in the past
  const isDateValid = (dateString) => {
    if (!dateString) return false;
    
    const selectedDate = new Date(dateString);
    const today = new Date();
    
    // Reset time parts for comparison (compare dates only)
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
  };

  const handlePost = async () => {
    // Validate all fields
    if (!form.title.trim()) {
      alert("Please enter a title");
      return;
    }

    if (!form.description.trim()) {
      alert("Please enter a description");
      return;
    }

    if (!form.date) {
      alert("Please select a date");
      return;
    }

    // IMPORTANT: Validate that date is not in the past
    if (!isDateValid(form.date)) {
      alert("Cannot post announcements for dates that have already passed. Please select today or a future date.");
      return;
    }

    if (!BI_ERP) {
      alert("User session not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/announcements/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          erp: BI_ERP,
          title: form.title.trim(),
          description: form.description.trim(),
          date: form.date
        })
      });

      const result = await response.json();

      if (result.success) {
        alert("Announcement Posted Successfully!");
        // Reset form
        setForm({
          title: "",
          description: "",
          date: ""
        });
      } else {
        alert(result.error || result.message || "Failed to post announcement");
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
      alert("Error posting announcement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle date change with validation
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    
    if (selectedDate && !isDateValid(selectedDate)) {
      alert("Please select today or a future date. Announcements cannot be posted for past dates.");
      return;
    }
    
    setForm({ ...form, date: selectedDate });
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Announcement</h2>

      <div className="form-group">
        <label>Title <span style={{ color: "red" }}>*</span></label>
        <input
          type="text"
          className="input-box"
          placeholder="Enter title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          maxLength={100}
        />
      </div>

      <div className="form-group">
        <label>Description <span style={{ color: "red" }}>*</span></label>
        <textarea
          className="textarea-box"
          placeholder="Write description..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          maxLength={300}
        ></textarea>
        <small style={{ color: "#666", fontSize: "12px" }}>
          {form.description.length}/300 characters
        </small>
      </div>

      <div className="form-group">
        <label>Date <span style={{ color: "red" }}>*</span></label>
        <input
          type="date"
          className="input-box"
          value={form.date}
          onChange={handleDateChange}
          min={minDate} // HTML5 validation - prevents selecting past dates
        />
        <small style={{ color: "#666", fontSize: "12px" }}>
          Select the date for this announcement (today or future dates only)
        </small>
      </div>

      <button 
        className="submit-btn" 
        onClick={handlePost}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
};

export default AddAnnouncement;
