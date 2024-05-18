import { db } from "../server.js";

//##############  Controller function to insert details into the requirement table of the database ###############################

// export const insertRequirement = (req, res) => {
//   const { requirement, startDate, endDate, mediCondition, prefGender } = req.body;

//   db.query(
//     "INSERT INTO requirement (requirement, startDate, endDate, mediCondition,prefGender) VALUES (?, ?, ?, ?, ?)",
//     [requirement, startDate, endDate, prefGender],
//     (err, results) => {
//       if (err) {
//         console.error("Error during requirement insertion:", err);
//         return res
//           .status(500)
//           .json({ error: "Internal Server Error", details: err.message });
//       }

//       res.status(201).json({ message: "Requirement inserted successfully" });
//     }
//   );
// };


export const insertRequirement = (req, res) => {
  console.log(req.body);
  const { requirements, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // First, get the caretakerId from the caretakernew table using userId
  db.query(
    "SELECT caretakerId FROM caretakernew WHERE userId = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error fetching caretaker ID:", err);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Caretaker not found" });
      }

      const caretakerId = results[0].caretakerId;

      // Now, insert the requirements into the caretakerrequirement table with the obtained caretakerId
      db.query(
        "INSERT INTO requirement (requirement, caretakerId) VALUES (?, ?)",
        [requirements, caretakerId],
        (err, results) => {
          if (err) {
            console.error("Error during requirement insertion:", err);
            return res
              .status(500)
              .json({ error: "Internal Server Error", details: err.message });
          }

          res.status(201).json({ message: "Requirement inserted successfully" });
        }
      );
    }
  );
};




//##############  Controller function to insert require data to the database  ###############################


export const insertRequest = async (req, res) => {
  const { startDate, endDate, preferredGender, userId } = req.body;

  try {
    // Start a transaction
    await db.beginTransaction();

    // Insert startDate and endDate into the requirement table
    const insertRequirementQuery = `
      INSERT INTO requirement (caretakerId, startDate, endDate)
      VALUES (?, ?, ?)
    `;
    const requirementResult = await db.query(insertRequirementQuery, [userId, startDate, endDate]);

    // Get the inserted requirement's ID
    const requirementId = requirementResult.insertId;

    // Update preferredGender in the caretakernew table
    const updateCaretakerQuery = `
      UPDATE caretakernew
      SET prefGender = ?
      WHERE caretakerId = ?
    `;
    await db.query(updateCaretakerQuery, [preferredGender, userId]);

    // Commit the transaction
    await db.commit();

    res.json({ success: true, message: 'Request has been successfully inserted' });
  } catch (err) {
    // Rollback the transaction in case of error
    await db.rollback();

    console.error("Error inserting request:", err.message);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

//##############  Controller function to fetch all requirements from the database ###############################
export const getAllRequirements = (req, res) => {
    db.query("SELECT * FROM requirement", (err, results) => {
        if (err) {
            console.error("Error fetching requirements:", err.message);
            return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }
        res.json(results);
    });
};
