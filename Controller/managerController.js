import { db } from "../server.js";


// Get detailed caretaker information from both ct & ctAddress & ctMediCondition tables
export const getCaretakerInformation = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM requirement r
      LEFT JOIN caretakernew ct 
      ON r.caretakerId = ct.caretakerId
      LEFT JOIN caretakermedicondition ctm
      ON ct.caretakerId = ctm.caretakerId
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get caregivers from usernew and caregiver tables
export const getCaregivers = async (req, res) => {
  try {
    
    const query = `
      SELECT *
      FROM usernew u
      JOIN caregiver cg ON u.userId = cg.userId
      WHERE u.userType = 'Caregiver' AND cg.availability = 'AVAILABLE'
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get caretaker details by ID
export const getCaretakerById = async (req, res) => {
  try {

    const caretakerId = req.params.caretakerId;
    
    const query = `
      SELECT 
          ct.*, 
        r.requirement, 
        cta.address, 
        ctm.mediCondition, 
        DATE_FORMAT(ct.dob, '%Y-%m-%d') AS formattedDob,
        ct.firstName,
        ct.lastName
        FROM caretakernew ct
        LEFT JOIN requirement r ON ct.caretakerId = r.caretakerId 
        LEFT JOIN caretakeraddress cta ON ct.caretakerId = cta.caretakerId
        LEFT JOIN caretakermedicondition ctm ON ct.caretakerId = ctm.caretakerId
        WHERE ct.caretakerId = ?; 
    `;

    db.query(query, [caretakerId], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else if (results.length === 0) {
        res.status(404).json({ error: "Not Found" });
      } else {
        res.json(results[0]);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get caregiver details by ID (you'll need a caregiverId from the dropdown)
// export const getCaregiverById = async (req, res) => {
//   try {
//     const caregiverId = req.params.id;
//     const query = `
//       SELECT *
//       FROM usernew u
//       JOIN caregiver cg ON u.userId = cg.userId
//       WHERE u.userId = ? AND u.userType = 'Caregiver'
//     `;

//     db.query(query, [caregiverId], (err, results) => {
//       if (err) {
//         console.error(err.message);
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json(results[0]);
//       }
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: error.message });
//   }
// };
