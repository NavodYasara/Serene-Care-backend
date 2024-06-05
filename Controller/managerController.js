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
  try {
    const query = `
      SELECT *
      FROM usernew u
      JOIN caregiver cg ON u.userId = cg.userId
      JOIN caregiveraddress cga ON cg.caregiverId = cga.caregiverId
      WHERE cg.caregiverId = ?
    `;

    db.query(query, [caregiverId], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'Caregiver not found' });
      } else {
        res.json(results[0]);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};


// export const allocateCaregiver = async (req, res) => {
//   try {
//     const { caretakerId, caregiverId, requirementId, status, instruction } = req.body;

//     const query = `
//       INSERT INTO careplan (caretakerId, caregiverId, requirementId, status, instruction)
//       VALUES (?, ?, ?, 'Accepted', ?)
//       ON DUPLICATE KEY UPDATE caretakerId = VALUES(caretakerId), caregiverId = VALUES(caregiverId), instruction = VALUES(instruction)
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
// } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: error.message });
// }
// };


// export const allocateCaregiver = async (req, res) => {
//   try {
//     const { caretakerId, caregiverId, requirementId, status, instruction } = req.body;

//     // Fetch the category for the given caretakerId
//     const categoryQuery = `SELECT category FROM caretakernew WHERE caretakerId = ?`;
//     db.query(categoryQuery, [caretakerId], (err, results) => {
//       if (err) {
//         console.error(err.message);
//         res.status(500).json({ error: err.message });
//         return;
//       }

//       const category = results[0].category;

//       // Check if a row with the relevant requirementId exists in the careplan table
//       const checkQuery = `SELECT * FROM careplan WHERE requirementId = ?`;
//       db.query(checkQuery, [requirementId], (err, results) => {
//         if (err) {
//           console.error(err.message);
//           res.status(500).json({ error: err.message });
//           return;
//         }

//         // If a row with the relevant requirementId exists, update it. Otherwise, insert a new row.
//         const isUpdate = results.length > 0;
//         const query = isUpdate
//           ? `
//             UPDATE careplan
//             SET caretakerId = ?, caregiverId = ?, status = 'PENDING', instruction = ?, category = ?
//             WHERE requirementId = ?
//           ` 
//           : `
//             INSERT INTO careplan (caretakerId, caregiverId, requirementId, status, instruction, category)
//             VALUES (?, ?, ?, 'PENDING', ?, ?)
//           `;

//         db.query(
//           query,
//           [caretakerId, caregiverId, requirementId, status, instruction, category],
//           (err, results) => {
//             if (err) {
//               console.error(err.message);
//               res.status(500).json({ error: err.message });
//             } else {
//               const message = isUpdate ? "Careplan updated successfully!" : "Caregiver allocated successfully!";
//               res.json({ message });
//             }
//           }
//         );
//       });
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: error.message });
//   }
// };


export const allocateCaregiver = async (req, res) => {
  try {
    const { caretakerId, caregiverId, requirementId, status, instruction } = req.body;

    // Check if the requirement status is 'Accepted'
    const requirementStatusQuery = `SELECT status FROM requirement WHERE requirementId = ?`;
    db.query(requirementStatusQuery, [requirementId], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
        return;
      }

      const requirementStatus = results[0].status;

      // Update or insert into careplan table
      const isUpdate = results.length > 0;
      const query = isUpdate
        ? `
          UPDATE careplan
          SET caretakerId = ?, caregiverId = ?, status = ?, instruction = ?
          WHERE requirementId = ?
        `
        : `
          INSERT INTO careplan (caretakerId, caregiverId, requirementId, status, instruction)
          VALUES (?, ?, ?, ?, ?)
        `;

      const statusToUpdate = requirementStatus === 'Accepted' ? 'assigned' : status;

      db.query(
        query,
        [caretakerId, caregiverId, requirementId, statusToUpdate, instruction],
        (err, results) => {
          if (err) {
            console.error(err.message);
            res.status(500).json({ error: err.message });
          } else {
            const message = isUpdate ? "Careplan updated successfully!" : "Caregiver allocated successfully!";
            res.json({ message });
          }
        }
      );
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};





