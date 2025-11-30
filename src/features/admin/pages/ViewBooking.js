import React, { useEffect, useState } from "react";
import "./ViewBooking.css";

const ViewBooking = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/booking/all");
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        // real DB bookings
        setBookings(result.data);
      } else {
        // HARD-CODED DUMMY BOOKINGS
        setBookings([
          {
            BOOKING_ID: 9991,
            ROOM_NAME: "MTC-23",
            BUILDING_NAME: "Tabba Academic Building",
            STUDENT_NAME: "Ali Ahmed",
            STUDENT_ERP: 13456,
            DATE_OF_BOOKING: "2025-12-25",
            START_TIME: "11:30",
            END_TIME: "12:45",
            PURPOSE: "Practice Presentation",
            STATUS: "PENDING",
          },
          {
            BOOKING_ID: 9992,
            ROOM_NAME: "Lab-A3",
            BUILDING_NAME: "Faisal Building",
            STUDENT_NAME: "Hiba Khan",
            STUDENT_ERP: 14460,
            DATE_OF_BOOKING: "2025-12-26",
            START_TIME: "10:00",
            END_TIME: "11:15",
            PURPOSE: "Group Project Work",
            STATUS: "PENDING",
          },
          {
            BOOKING_ID: 9993,
            ROOM_NAME: "Breakout-12",
            BUILDING_NAME: "MTC",
            STUDENT_NAME: "Rafay",
            STUDENT_ERP: 15501,
            DATE_OF_BOOKING: "2025-12-27",
            START_TIME: "14:30",
            END_TIME: "15:45",
            PURPOSE: "Study Session",
            STATUS: "CONFIRMED",
          },
        ]);
      }
    } catch (err) {
      console.log("Backend error → showing dummy bookings");
      // Also fallback to hardcoded on backend error
      setBookings([
        {
          BOOKING_ID: 9991,
          ROOM_NAME: "MTC-23",
          BUILDING_NAME: "Tabba Academic Building",
          STUDENT_NAME: "Ali Ahmed",
          STUDENT_ERP: 13456,
          DATE_OF_BOOKING: "2025-12-25",
          START_TIME: "11:30",
          END_TIME: "12:45",
          PURPOSE: "Practice Presentation",
          STATUS: "PENDING",
        },
        {
          BOOKING_ID: 9992,
          ROOM_NAME: "Lab-A3",
          BUILDING_NAME: "Faisal Building",
          STUDENT_NAME: "Hiba Khan",
          STUDENT_ERP: 14460,
          DATE_OF_BOOKING: "2025-12-26",
          START_TIME: "10:00",
          END_TIME: "11:15",
          PURPOSE: "Group Project Work",
          STATUS: "PENDING",
        },
        {
          BOOKING_ID: 9993,
          ROOM_NAME: "Breakout-12",
          BUILDING_NAME: "MTC",
          STUDENT_NAME: "Rafay",
          STUDENT_ERP: 15501,
          DATE_OF_BOOKING: "2025-12-27",
          START_TIME: "14:30",
          END_TIME: "15:45",
          PURPOSE: "Study Session",
          STATUS: "CONFIRMED",
        },
      ]);
    }
  };

  const updateStatus = async (id, status) => {
    alert(`(HARD-CODED) Booking ${id} marked as ${status}`);
  };

  return (
    <div className="booking-admin-container">
      <h2 className="title">Booking Requests</h2>
      <p className="subtitle">Approve or reject room booking requests</p>

      <div className="booking-card-list">
        {bookings.map((b) => (
          <div key={b.BOOKING_ID} className="booking-card">
            <div className="card-header">
              <div>
                <h3 className="room-name">{b.ROOM_NAME}</h3>
                <p className="building-name">{b.BUILDING_NAME}</p>
              </div>

              <span
                className={`status-badge ${
                  b.STATUS === "CONFIRMED"
                    ? "confirmed"
                    : b.STATUS === "REJECTED"
                    ? "rejected"
                    : "pending"
                }`}
              >
                {b.STATUS}
              </span>
            </div>

            <div className="card-body">
              <p><strong>Student:</strong> {b.STUDENT_NAME}</p>
              <p><strong>ERP:</strong> {b.STUDENT_ERP}</p>
              <p><strong>Date:</strong> {b.DATE_OF_BOOKING}</p>
              <p><strong>Time:</strong> {b.START_TIME} - {b.END_TIME}</p>
              <p><strong>Purpose:</strong> {b.PURPOSE}</p>
            </div>

            {b.STATUS === "PENDING" && (
              <div className="card-actions">
                <button
                  className="approve-btn"
                  onClick={() => updateStatus(b.BOOKING_ID, "CONFIRMED")}
                >
                  Approve
                </button>

                <button
                  className="reject-btn"
                  onClick={() => updateStatus(b.BOOKING_ID, "REJECTED")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewBooking;
