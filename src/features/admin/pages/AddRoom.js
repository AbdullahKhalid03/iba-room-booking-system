import React, { useState, useEffect } from "react";

const AddRoom = () => {
  const [buildings, setBuildings] = useState([]);
  const [form, setForm] = useState({
    buildingName: "",
    roomName: "",
    roomType: ""
  });

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    const res = await fetch("http://localhost:5000/api/buildings");
    const data = await res.json();
    setBuildings(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/buildings/rooms/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await res.json();
    alert(result.message);

    if (res.ok) {
      setForm({ buildingName: "", roomName: "", roomType: "" });
    }
  };

  return (
    <div>
      <h2>Add Room</h2>
      <form onSubmit={handleSubmit} className="form-section">

        <div className="form-group">
          <label>Select Building *</label>
          <select
            required
            value={form.buildingName}
            onChange={(e) => setForm({ ...form, buildingName: e.target.value })}
          >
            <option value="">Choose...</option>
            {buildings.map((b) => (
              <option key={b.BUILDING_ID} value={b.BUILDING_NAME}>
                {b.BUILDING_NAME}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Room Name *</label>
            <input
              required
              value={form.roomName}
              onChange={(e) => setForm({ ...form, roomName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Room Type *</label>
            <select
              required
              value={form.roomType}
              onChange={(e) => setForm({ ...form, roomType: e.target.value })}
            >
              <option value="">Select</option>
              <option value="Classroom">Classroom</option>
              <option value="Lab">Lab</option>
              <option value="Conference">Conference Room</option>
              <option value="Breakout">Breakout Room</option>
              <option value="Auditorium">Auditorium</option>
              <option value="Study Room">Study Room</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        <button className="maroon-btn">Add Room</button>
      </form>
    </div>
  );
};

export default AddRoom;
