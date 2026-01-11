## IBA Room Booking System

This project was developed as a team-based full-stack semester project.

Contributors:
- Abdullah Khalid
- Kashish Anil Kumar
- Muskan Pawan
Original repository: https://github.com/Musknn/iba-room-booking-system.git


The **IBA Room Booking System (IBMS)** is a full-stack web application designed to digitize and streamline the room reservation process at the Institute of Business Administration, Karachi. It replaces manual, email-based workflows with a centralized, role-based, and conflict-free platform.

---

## Project Motivation

The current manual booking process at IBA often results in double bookings, last-minute cancellations, and a lack of transparency. Following an interview with **Sir Shahmuneer Khan (Program Office Head)**, we developed this system to enforce automated business rules and real-time availability checking.

---

## Key Features

* **Role-Based Access Control (RBAC):** Tailored interfaces for Students, Program Office (PO), and Building Incharges (BI).
* **Real-Time Availability:** Integrated checks against both existing reservations and the official academic class schedule.
* **Conflict Detection:** Automated database-level prevention of overlapping bookings.
* **Status Management:** Tracking of bookings through *Approved*, *Cancelled*, and *Rejected* states.
* **Announcement Portal:** Building Incharges can post real-time updates for their specific buildings.

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | React.js, HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | Oracle Database |
| **Logic** | PL/SQL (Stored Procedures & Triggers) |

---

## Database Design & Business Rules

The system is built on a robust relational schema normalized to **3NF** to ensure data integrity.

### Core Business Logic:

1. **Strict Validation:** Bookings are prevented if a room has an overlapping class schedule or an existing approved reservation.
2. **Role Restrictions:** Students can request classrooms and breakouts; BI manages specific building breakouts; PO oversees campus-wide classroom allocation.
3. **Integrity Constraints:** Triggers ensure that booking dates are never in the past and that phone/email formats follow IBA standards.

---

## User Flow

1. **Authentication:** Users log in via IBA email verification.
2. **Search:** Users filter rooms by building, type, and time slot.
3. **Booking:** System runs a PL/SQL check for conflicts.
4. **Confirmation:** Instant approval if the slot is clear; notifications sent for status changes.

