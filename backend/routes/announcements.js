const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const { getConnection } = require('../config/database');

// Get all announcements
// Get all announcements - FIXED VERSION
router.get('/all', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `BEGIN
         ShowAllAnnouncements(:result);
       END;`,
      {
        result: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.result;
    
    if (!resultSet) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // FIX: Use getRows() with a parameter to limit rows
    let announcements = [];
    let row;
    
    // Method 1: Get all rows at once (simpler)
    announcements = await resultSet.getRows(); // This should work
    
    // If above returns empty, try method 2:
    if (!announcements || announcements.length === 0) {
      console.log('⚠️ getRows() returned empty, trying fetch...');
      
      // Reset cursor
      resultSet = result.outBinds.result;
      
      // Fetch rows manually
      while ((row = await resultSet.getRow())) {
        announcements.push(row);
      }
    }
    
    await resultSet.close();
    
    console.log(`✅ Backend got ${announcements.length} announcements from cursor`);
    
    // Debug: Log what we actually received
    if (announcements.length > 0) {
      console.log('🔍 First row from Oracle cursor:', announcements[0]);
      console.log('🔍 Type of row:', typeof announcements[0]);
      console.log('🔍 Is array?', Array.isArray(announcements[0]));
    }
    
    // FIX: Handle the data correctly - Oracle returns arrays
    const formattedAnnouncements = announcements.map(row => {
      // row is an array: [id, title, description, date, posted_by, building_name]
      if (Array.isArray(row) && row.length >= 6) {
        return {
          announcement_id: row[0],
          title: row[1] || '',
          description: row[2] || '',
          date_posted: row[3] ? row[3] : new Date().toISOString(),
          posted_by: row[4] || '',
          building_name: row[5] || ''
        };
      }
      // If it's already an object (shouldn't happen)
      else if (typeof row === 'object' && row !== null) {
        return row;
      }
      // Empty/default
      else {
        return {
          announcement_id: 0,
          title: 'Error loading',
          description: 'Could not load announcement',
          date_posted: new Date().toISOString(),
          posted_by: 'System',
          building_name: 'Unknown'
        };
      }
    });
    
    res.json({
      success: true,
      data: formattedAnnouncements
    });
    
  } catch (error) {
    console.error('❌ Error fetching announcements:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

// Get announcements by building
router.get('/building/:buildingName', async (req, res) => {  // Changed parameter
  let connection;
  try {
    const { buildingName } = req.params;
    
    if (!buildingName || buildingName.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Building name is required'
      });
    }

    connection = await getConnection();
    
    const result = await connection.execute(
      `BEGIN
         FilterAnnouncementsByBuilding(:building_name, :result);
       END;`,
      {
        building_name: buildingName,  // Changed parameter name
        result: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.result;
    if (!resultSet) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const announcements = await resultSet.getRows();
    await resultSet.close();
    
    res.json({
      success: true,
      data: announcements.map(announcement => ({
        announcement_id: announcement[0],
        title: announcement[1],
        description: announcement[2],
        date_posted: announcement[3],
        posted_by: announcement[4],
        building_name: announcement[5]
      }))
    });
  } catch (error) {
    console.error('Error filtering announcements by building:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

// Get all buildings for filter dropdown
router.get('/buildings', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    
    const result = await connection.execute(
      `SELECT building_id, building_name FROM Building ORDER BY building_name`
    );

    res.json({
      success: true,
      data: result.rows.map(row => ({
        building_id: row[0],
        building_name: row[1]
      }))
    });
  } catch (error) {
    console.error('Error fetching buildings:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

router.get('/incharge/:erp', async (req, res) => {
  let connection;
  try {
    const { erp } = req.params;
    
    if (!erp) {
      return res.status(400).json({
        success: false,
        error: 'ERP is required'
      });
    }

    connection = await getConnection();
    
    const result = await connection.execute(
      `BEGIN
         ShowAnnouncementsByUser(:erp, :result);
       END;`,
      {
        erp: parseInt(erp),
        result: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
      }
    );

    const resultSet = result.outBinds.result;
    if (!resultSet) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const announcements = await resultSet.getRows();
    await resultSet.close();
    
    // DEBUG: Log raw data
    console.log('🔍 Raw announcements from Oracle:', announcements);
    
    // FIX: Handle dates properly - Oracle returns dates as special objects
    const formattedAnnouncements = announcements.map((row, index) => {
      console.log(`🔍 Row ${index}:`, row);
      
      // row is an array: [id, title, description, date_posted, created_date]
      if (Array.isArray(row) && row.length >= 5) {
        let date_posted = null;
        let created_date = null;
        
        // Check if date is Oracle Date object
        if (row[3] && typeof row[3] === 'object' && row[3].getMonth) {
          // It's already a Date object
          date_posted = row[3];
        } else if (row[3]) {
          // Try to parse as string
          try {
            date_posted = new Date(row[3]);
          } catch (err) {
            console.log('❌ Could not parse date_posted:', row[3]);
            date_posted = new Date(); // Fallback
          }
        }
        
        // Same for created_date
        if (row[4] && typeof row[4] === 'object' && row[4].getMonth) {
          created_date = row[4];
        } else if (row[4]) {
          try {
            created_date = new Date(row[4]);
          } catch (err) {
            created_date = null;
          }
        }
        
        return {
          announcement_id: row[0] || 0,
          title: row[1] || 'No Title',
          description: row[2] || 'No Description',
          date_posted: date_posted ? date_posted.toISOString() : new Date().toISOString(),
          created_date: created_date ? created_date.toISOString() : null
        };
      }
      
      // Fallback for unexpected format
      return {
        announcement_id: 0,
        title: 'Error loading',
        description: 'Could not parse announcement data',
        date_posted: new Date().toISOString(),
        created_date: null
      };
    });
    
    console.log('✅ Formatted announcements:', formattedAnnouncements);
    
    res.json({
      success: true,
      data: formattedAnnouncements
    });
  } catch (error) {
    console.error('Error fetching incharge announcements:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});
// Post new announcement (Building Incharge only)
router.post('/post', async (req, res) => {
  let connection;
  try {
    const { erp, title, description } = req.body;
    
    if (!erp || !title || !description) {
      return res.status(400).json({
        success: false,
        error: 'ERP, title and description are required'
      });
    }

    connection = await getConnection();
    
    const result = await connection.execute(
      `BEGIN
         PostAnnouncement(:erp, :title, :description, :success, :message);
       END;`,
      {
        erp: parseInt(erp),
        title,
        description,
        success: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        message: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }
      }
    );

    const { success, message } = result.outBinds;
    
    if (success === 1) {
      res.json({
        success: true,
        message
      });
    } else {
      res.status(400).json({
        success: false,
        error: message
      });
    }
  } catch (error) {
    console.error('Error posting announcement:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});

// Delete announcement
router.post('/delete', async (req, res) => {
  let connection;
  try {
    const { announcement_id, erp } = req.body;
    
    if (!announcement_id || !erp) {
      return res.status(400).json({
        success: false,
        error: 'Announcement ID and ERP are required'
      });
    }

    connection = await getConnection();
    
    const result = await connection.execute(
      `BEGIN
         DeleteAnnouncement(:announcement_id, :erp, :success, :message);
       END;`,
      {
        announcement_id: parseInt(announcement_id),
        erp: parseInt(erp),
        success: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        message: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 500 }
      }
    );

    const { success, message } = result.outBinds;
    
    if (success === 1) {
      res.json({
        success: true,
        message
      });
    } else {
      res.status(400).json({
        success: false,
        error: message
      });
    }
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error(error);
      }
    }
  }
});



module.exports = router;