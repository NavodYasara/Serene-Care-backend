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

// Get caregivers from usernew and caregiver tables to the caregier information section
export const getCaregivers = async (req, res) => {
   try {
    const query = `SELECT * FROM usernew u JOIN caregiver cg ON u.userId = cg.userId WHERE u.userType = 'Caregiver' AND cg.availability = 'AVAILABLE'`;
    db.query(query, (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message }); // Send an error response
      } else {
        res.status(200).json(results); // Ensure correct Content-Type and complete JSON
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message }); // Send an error response
  }
};

// Get caregiver details by ID
export const getCaregiverById = async (req, res) => {
  const caregiverId = req.params.caregiverId;
  console.log(req.params.caregiverId);
  try {
    
    const query = `
      SELECT *
      FROM usernew u
      JOIN caregiver cg ON u.userId = cg.userId
      WHERE u.userId = ? AND u.userType = 'Caregiver'
    `;


    db.query(query, [caregiverId], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json(results[0]);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Allocate a caregiver to a caretaker
// export const allocateCaregiver = async (req, res) => {
//   try {
//     const { caretakerId, caregiverId, requirementId, instruction } = req.body;

//     const query = `
//       INSERT INTO carePlan (caretakerId, caregiverId, requirementId, status, instruction)
//       VALUES (?, ?, ?, 'Assigned', ?)
//     `;

//     db.query(
//       query,
//       [caretakerId, caregiverId, requirementId, instruction],
//       (err, results) => {
//         if (err) {
//           console.error(err.message);
//           res.status(500).json({ error: err.message });
//         } else {
//           res.json({ message: "Caregiver allocated successfully!" });
//         }
//       }
//     );
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

// Allocate a caregiver to a caretaker

export const allocateCaregiver = async (req, res) => {
  try {
    const { caretakerId, caregiverId, requirementId, instruction } = req.body;

    const query = `
      INSERT INTO careplan (caretakerId, caregiverId, requirementId, status, instruction)
      VALUES (?, ?, ?, 'Accepted', ?)
      ON DUPLICATE KEY UPDATE caretakerId = VALUES(caretakerId), caregiverId = VALUES(caregiverId), instruction = VALUES(instruction)
    `;

    db.query(
      query,
      [caretakerId, caregiverId, requirementId, instruction],
      (err, results) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: err.message });
        } else {
          res.json({ message: "Caregiver allocated successfully!" });
        }
      }
    );
} catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
}
};
