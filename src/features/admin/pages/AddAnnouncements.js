import React, { useState } from "react";
import "./Announcements.css";

const AddAnnouncement = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: ""
  });

  const handlePost = () => {
    alert("Announcement Posted ");
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Announcement</h2>

      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          className="input-box"
          placeholder="Enter title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          className="textarea-box"
          placeholder="Write description..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        ></textarea>
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          className="input-box"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </div>

      <button className="submit-btn" onClick={handlePost}>
        Post
      </button>
    </div>
  );
};

export default AddAnnouncement;
