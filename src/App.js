import React, { useState } from 'react';
import './App.css';

function App() {
  // State for rooms and bookings
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Room 101', type: 'Classroom', capacity: 30, available: true },
    { id: 2, name: 'Room 102', type: 'Classroom', capacity: 25, available: true },
    { id: 3, name: 'Breakout Room A', type: 'Breakout', capacity: 10, available: false },
    { id: 4, name: 'Room 201', type: 'Classroom', capacity: 40, available: true },
  ]);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  // Function to handle room booking
  const handleBookRoom = (room) => {
    if (!room.available) {
      alert('Sorry, this room is not available!');
      return;
    }
    setSelectedRoom(room);
  };

  // Function to submit booking
  const handleSubmitBooking = () => {
    if (!bookingDate || !bookingTime) {
      alert('Please select date and time!');
      return;
    }

    alert(`Booking confirmed!\nRoom: ${selectedRoom.name}\nDate: ${bookingDate}\nTime: ${bookingTime}`);
    
    // Reset form
    setSelectedRoom(null);
    setBookingDate('');
    setBookingTime('');
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <h1>🏛️ IBA Room Booking System</h1>
        <p>Book classrooms and breakout rooms easily</p>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Room Listing Section */}
        <section className="room-section">
          <h2>Available Rooms</h2>
          <div className="room-grid">
            {rooms.map(room => (
              <div 
                key={room.id} 
                className={`room-card ${room.available ? 'available' : 'unavailable'}`}
                onClick={() => handleBookRoom(room)}
              >
                <h3>{room.name}</h3>
                <p>Type: {room.type}</p>
                <p>Capacity: {room.capacity} students</p>
                <div className="status">
                  {room.available ? '✅ Available' : '❌ Booked'}
                </div>
                <button 
                  className="book-btn"
                  disabled={!room.available}
                >
                  {room.available ? 'Book Now' : 'Unavailable'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Booking Form Section */}
        {selectedRoom && (
          <section className="booking-section">
            <h2>Book {selectedRoom.name}</h2>
            <div className="booking-form">
              <div className="form-group">
                <label>Date:</label>
                <input 
                  type="date" 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Time:</label>
                <select 
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select Time</option>
                  <option value="09:00-10:00">9:00 AM - 10:00 AM</option>
                  <option value="10:00-11:00">10:00 AM - 11:00 AM</option>
                  <option value="11:00-12:00">11:00 AM - 12:00 PM</option>
                  <option value="14:00-15:00">2:00 PM - 3:00 PM</option>
                  <option value="15:00-16:00">3:00 PM - 4:00 PM</option>
                </select>
              </div>

              <div className="form-actions">
                <button 
                  onClick={handleSubmitBooking}
                  className="submit-btn"
                >
                  Confirm Booking
                </button>
                <button 
                  onClick={() => setSelectedRoom(null)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Statistics Section */}
        <section className="stats-section">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Rooms</h3>
              <p>{rooms.length}</p>
            </div>
            <div className="stat-card">
              <h3>Available Now</h3>
              <p>{rooms.filter(room => room.available).length}</p>
            </div>
            <div className="stat-card">
              <h3>Classrooms</h3>
              <p>{rooms.filter(room => room.type === 'Classroom').length}</p>
            </div>
            <div className="stat-card">
              <h3>Breakout Rooms</h3>
              <p>{rooms.filter(room => room.type === 'Breakout').length}</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>IBA University - Room Booking System &copy; 2024</p>
      </footer>
    </div>
  );
}

export default App;