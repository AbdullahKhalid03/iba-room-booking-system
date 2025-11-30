import React, { useState, useEffect } from "react";

const AddBooking_BI = () => {
  const [step, setStep] = useState(1);
  const [buildings, setBuildings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [form, setForm] = useState({
    slot: "",
    date: "",
    buildingId: "",
    roomId: "",
    purpose: ""
  });

  // Predefined slots
  const timeSlots = [
    "08:30-09:45",
    "10:00-11:15",
    "11:30-12:45",
    "13:00-14:15",
    "14:30-15:45",
    "16:00-17:15",
    "17:30-18:45"
  ];

  // Load buildings from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/buildings")
      .then((res) => res.json())
      .then((data) => setBuildings(data))
      .catch((err) => console.log("Buildings Error:", err));
  }, []);

  // STEP 1 — Search Available Rooms
  const handleSearchRooms = async () => {
    if (!form.slot || !form.date || !form.buildingId) {
      alert("Please fill all fields");
      return;
    }

    const [start, end] = form.slot.split("-");

    try {
      const response = await fetch(
        `http://localhost:5000/api/booking/available-rooms?date=${form.date}&startTime=${start}&endTime=${end}&buildingId=${form.buildingId}&roomType=Classroom`
      );

      const result = await response.json();

      if (result.success && result.data.length > 0) {
        setAvailableRooms(result.data);
        setStep(2);
      } else {
        alert("No rooms available");
      }
    } catch (error) {
      console.log(error);
      alert("Error fetching available rooms");
    }
  };

  // STEP 3 — Add Booking (BI Creates)
  const handleAddBooking = async () => {
    const [start, end] = form.slot.split("-");

    try {
      const response = await fetch("http://localhost:5000/api/booking/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          erp: 8888, // Building Incharge default ERP
          roomId: form.roomId,
          date: form.date,
          startTime: start,
          endTime: end,
          purpose: form.purpose
        })
      });

      const result = await response.json();

      if (result.success) {
        alert("Booking Successfully Created!");
      } else {
        alert(result.error || "Failed to create booking");
      }
    } catch (error) {
      console.log(error);
      alert("Error creating booking");
    }
  };

  // ---------------- UI ---------------- //

  // STEP 1 — Filters
  if (step === 1) {
    return (
      <div>
        <h2>Add Booking (Building Incharge)</h2>

        {/* SLOT DROPDOWN */}
        <div className="form-group">
          <label>Slot</label>
          <select
            value={form.slot}
            onChange={(e) => setForm({ ...form, slot: e.target.value })}
            className="filter-select"
          >
            <option value="">Select Slot</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        {/* BUILDING */}
        <div className="form-group">
          <label>Building</label>
          <select
            onChange={(e) =>
              setForm({ ...form, buildingId: e.target.value })
            }
          >
            <option value="">Select Building</option>
            {buildings.map((b) => (
              <option key={b.BUILDING_ID} value={b.BUILDING_ID}>
                {b.BUILDING_NAME}
              </option>
            ))}
          </select>
        </div>

        <button className="maroon-btn" onClick={handleSearchRooms}>
          Search Available Rooms
        </button>
      </div>
    );
  }
// STEP 2 — Available Rooms (Updated with UI cards + BACK button + BOOK NOW)
if (step === 2) {
  return (
    <div>

      {/* BACK BUTTON */}
      <button
        onClick={() => setStep(1)}
        style={{
          padding: "8px 16px",
          background: "#550707",
          color: "white",
          border: "none",
          borderRadius: "6px",
          margin: "10px 0 20px 0",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h2>Available Rooms</h2>

      {/* ROOMS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {availableRooms.map((room) => (
          <div
            key={room.ROOM_ID}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              border: "2px solid #e0e0e0",
              transition: "0.25s",
              boxShadow: "0px 3px 10px rgba(0,0,0,0.08)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#550707")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#e0e0e0")
            }
          >
            <h3
              style={{
                margin: "0 0 10px",
                fontSize: "18px",
                fontWeight: "600",
                color: "#550707",
              }}
            >
              {room.ROOM_NAME}
            </h3>

            <p style={{ margin: "5px 0", color: "#333" }}>
              <b>Type:</b> {room.ROOM_TYPE}
            </p>

            <p style={{ margin: "5px 0", color: "#333" }}>
              <b>Building:</b> {room.BUILDING_NAME}
            </p>

            <p style={{ margin: "5px 0", color: "#333" }}>
              <b>Room ID:</b> {room.ROOM_ID}
            </p>

            {/* BOOK NOW BUTTON */}
            <button
              onClick={() => {
                setForm({ ...form, roomId: room.ROOM_ID });
                setStep(3);
              }}
              style={{
                marginTop: "12px",
                padding: "8px 16px",
                background: "#550707",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

 // STEP 3 — Confirm Booking (Upgraded UI)
if (step === 3) {
  // Find selected room details
  const selectedRoom = availableRooms.find(
    (r) => r.ROOM_ID === form.roomId
  );

  return (
    <div>
      {/* BACK BUTTON */}
      <button
        onClick={() => setStep(2)}
        style={{
          padding: "8px 16px",
          background: "#550707",
          color: "white",
          border: "none",
          borderRadius: "6px",
          margin: "10px 0 20px 0",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <h2>Confirm Booking</h2>

      {/* CARD */}
      <div
        style={{
          background: "white",
          padding: "25px",
          borderRadius: "10px",
          border: "2px solid #e0e0e0",
          boxShadow: "0px 3px 10px rgba(0,0,0,0.08)",
          maxWidth: "450px",
          marginTop: "20px",
        }}
      >
        <h3 style={{ marginBottom: "15px", color: "#550707" }}>
          Booking Details
        </h3>

        <p><b>Room:</b> {selectedRoom?.ROOM_NAME}</p>
        <p><b>Room ID:</b> {form.roomId}</p>
        <p><b>Building:</b> {selectedRoom?.BUILDING_NAME}</p>
        <p><b>Date:</b> {form.date}</p>
        <p><b>Slot:</b> {form.slot}</p>

        <div className="form-group" style={{ marginTop: "15px" }}>
          <label><b>Purpose</b></label>
          <textarea
            placeholder="Enter purpose..."
            style={{
              width: "100%",
              height: "80px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
            onChange={(e) =>
              setForm({ ...form, purpose: e.target.value })
            }
          />
        </div>

        {/* FINAL BOOK BUTTON */}
        <button
          className="maroon-btn"
          style={{
            marginTop: "15px",
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            fontWeight: "600",
            background: "#550707",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={handleAddBooking}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}

};

export default AddBooking_BI;
