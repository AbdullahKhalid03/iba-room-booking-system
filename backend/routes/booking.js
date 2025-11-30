const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");
const { getConnection } = require("../config/database");

/* ============================================================
   1. GET AVAILABLE ROOMS  
   ============================================================ */
router.get("/available-rooms", async (req, res) => {
  let connection;

  try {
    const { date, startTime, endTime, buildingId } = req.query;

    if (!date || !startTime || !endTime || !buildingId) {
      return res.json({ success: false, error: "Missing parameters" });
    }

    connection = await getConnection();

    const sql = `
      SELECT 
        r.room_id,
        r.room_name,
        r.room_type,
        b.building_name
      FROM ROOM r
      JOIN BUILDING b ON r.building_id = b.building_id
      WHERE r.building_id = :buildingId
      AND r.room_id NOT IN (
        SELECT room_id 
        FROM BOOKING
        WHERE date_of_booking = TO_DATE(:date, 'YYYY-MM-DD')
        AND start_time < TO_DATE(:endTime,'HH24:MI')
        AND end_time   > TO_DATE(:startTime,'HH24:MI')
      )
    `;

    const result = await connection.execute(sql, {
      buildingId,
      date,
      startTime,
      endTime,
    });

    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("AVAILABLE ROOMS ERROR:", err);
    res.json({ success: false, error: "Failed to fetch available rooms" });
  } finally {
    if (connection) await connection.close();
  }
});

/* ============================================================
   2. CREATE BOOKING  
   ============================================================ */
router.post("/create-booking", async (req, res) => {
  let connection;

  try {
    const { erp, roomId, date, startTime, endTime, purpose } = req.body;

    if (!erp || !roomId || !date || !startTime || !endTime || !purpose) {
      return res.json({ success: false, error: "All fields required" });
    }

    connection = await getConnection();

    const sql = `
      INSERT INTO BOOKING (
        booking_id, erp, room_id, date_of_booking, 
        start_time, end_time, purpose, status
      ) VALUES (
        BOOKING_ID_SEQ.NEXTVAL,
        :erp,
        :roomId,
        TO_DATE(:date, 'YYYY-MM-DD'),
        TO_DATE(:startTime, 'HH24:MI'),
        TO_DATE(:endTime, 'HH24:MI'),
        :purpose,
        'PENDING'
      )
      RETURNING booking_id INTO :bookingId
    `;

    const result = await connection.execute(
      sql,
      {
        erp,
        roomId,
        date,
        startTime,
        endTime,
        purpose,
        bookingId: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: true }
    );

    res.json({
      success: true,
      message: "Booking created successfully!",
      bookingId: result.outBinds.bookingId[0],
    });

  } catch (err) {
    console.error("CREATE BOOKING ERROR:", err);
    res.json({ success: false, error: err.message });
  } finally {
    if (connection) await connection.close();
  }
});

/* ============================================================
   3. VIEW ALL BOOKINGS
   ============================================================ */
router.get("/all", async (req, res) => {
  let connection;

  try {
    connection = await getConnection();

    const sql = `
      SELECT 
        b.booking_id,
        s.name AS student_name,
        s.erp AS student_erp,
        r.room_name,
        bd.building_name,
        TO_CHAR(b.date_of_booking, 'YYYY-MM-DD') AS date_of_booking,
        TO_CHAR(b.start_time, 'HH24:MI') AS start_time,
        TO_CHAR(b.end_time, 'HH24:MI') AS end_time,
        b.purpose,
        b.status
      FROM BOOKING b
      JOIN STUDENT s ON b.erp = s.erp
      JOIN ROOM r ON b.room_id = r.room_id
      JOIN BUILDING bd ON r.building_id = bd.building_id
      ORDER BY b.booking_id DESC
    `;

    const result = await connection.execute(sql);
    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("LOAD BOOKINGS ERROR:", err);
    res.json({ success: false, error: "Failed to load bookings" });
  } finally {
    if (connection) await connection.close();
  }
});

/* ============================================================
   4. APPROVE / REJECT BOOKING
   ============================================================ */
router.post("/update-status", async (req, res) => {
  let connection;

  try {
    const { bookingId, status } = req.body;

    connection = await getConnection();

    await connection.execute(
      `UPDATE BOOKING SET status = :status WHERE booking_id = :id`,
      { status, id: bookingId },
      { autoCommit: true }
    );

    res.json({ success: true, message: "Status updated!" });

  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.json({ success: false, error: "Failed to update booking status" });
  } finally {
    if (connection) await connection.close();
  }
});

module.exports = router;
