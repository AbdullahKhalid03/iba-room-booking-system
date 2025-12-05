// routes/manageBookings.js
const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const { getConnection } = require("../config/database");

// ================================
// FETCH ALL BOOKINGS (Admin + BI)
// ================================
router.get("/all", async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT
          b.booking_id AS "BOOKING_ID",
          u.name AS "STUDENT_NAME",
          u.erp AS "STUDENT_ERP",
          r.room_name AS "ROOM_NAME",
          b.date_of_booking AS "DATE_OF_BOOKING",
          TO_CHAR(b.start_time, 'HH24:MI') AS "START_TIME",
          TO_CHAR(b.end_time, 'HH24:MI') AS "END_TIME",
          b.purpose AS "PURPOSE",
          b.status AS "STATUS",
          build.building_name AS "BUILDING_NAME"
      FROM Booking b
      JOIN User_Table u ON b.ERP = u.ERP
      JOIN Room r ON b.room_id = r.room_id
      JOIN Building build ON r.building_id = build.building_id
      ORDER BY b.booking_id DESC
      `
    );

    res.json({ success: true, data: result.rows });

  } catch (error) {
    console.error("Error loading bookings:", error);
    res.status(500).json({ success: false, error: "Failed to load bookings" });
  } finally {
    if (connection) await connection.close();
  }
});

// ================================
// UPDATE BOOKING STATUS
// ================================
router.post("/update-status", async (req, res) => {
  let connection;

  try {
    const { bookingId, status } = req.body;

    connection = await getConnection();

    await connection.execute(
      `
      UPDATE Booking
      SET status = :status
      WHERE booking_id = :bookingId
      `,
      { status, bookingId },
      { autoCommit: true }
    );

    res.json({ success: true, message: "Status updated" });

  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ success: false, error: "Failed to update status" });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
