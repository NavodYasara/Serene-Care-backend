import { db } from "../server.js";

// export const addfeedback = (req, res) => {
//   const feedbackData = req.body;
//   const { userId, feedback } = feedbackData;
//   let currentDate = new Date();

//   // Query the requirement table to get requirementId
//   db.query(
//     "SELECT requirementId FROM requirement WHERE userId = ?",
//     [userId],
//     (err, requirement) => {
//       if (err) {
//         console.error("Error querying database:", err);
//         return res.status(500).send("Error querying database.");
//       }

//       const requirementId = requirement[0].requirementId;

//       // Query the careplan table to get careplanId
//       db.query(
//         "INSERT INTO feedback (Date, description, userId, requirementId) VALUES (?, ?, ?, ?)",
//         [currentDate, feedback, userId, requirementId],
//         (err, results) => {
//           if (err) {
//             console.error("Error updating database:", err);
//             return res.status(500).send("Error updating database.");
//           }
//           res.status(200).send("Feedback added successfully");
//         }
//       );
//     }
//   );
// };


// get patient's names for each caretaker(user) by userId



export const getcaretakers = async (req, res) => {
  try {
    const { userId } = req.params;

    // Query the users table to get the caretakerIds
    const query = `
      SELECT caretakerId, CONCAT(firstName, ' ', lastName) AS ctName, category
      FROM caretakernew
      WHERE userId = ?
    `;

    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).send("Error querying database.");
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred.");
  }
};


export const getcaregiver = (req, res) => {
  const { userId } = req.params;

  // Query the feedback, careplan, and caregiver tables to get the feedback data
  db.query(
    `SELECT
        CONCAT(u.firstName, ' ', u.lastName) AS fullName,
        cg.gender,
        u.mobileNo
    FROM
        requirement r
    JOIN
        caregiver cg ON r.caregiverId = cg.caregiverId
    JOIN
        usernew u ON cg.userId = u.userId
    WHERE
        r.caretakerId = (
            SELECT caretakerId
            FROM caretakernew
            WHERE userId = ?
        );
`,

    [userId],
    (err, feedbacks) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).send("Error querying database.");
      }

      res.status(200).json(feedbacks);
    }
  );
};


export const getCaregiversByCaretaker = async (req, res) => {
  try {
    const { caretakerId } = req.params;

    // Query the requirement and caregiver tables to get the caregiver data for the selected caretaker
    const query = `
      SELECT
          CONCAT(u.firstName, ' ', u.lastName) AS fullName,
          cg.gender,
          u.mobileNo
      FROM
          requirement r
      JOIN
          caregiver cg ON r.caregiverId = cg.caregiverId
      JOIN
          usernew u ON cg.userId = u.userId
      WHERE
          r.caretakerId = ?
    `;

    db.query(query, [caretakerId], (err, caregivers) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).send("Error querying database.");
      }

      res.status(200).json(caregivers);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred.");
  }
};


export const addfeedback = (req, res) => {
  try {
    const feedbackData = req.body;
    const { userId, feedback } = feedbackData;
    let currentDate = new Date();

    // Query the requirement table to get requirementId and caretakerId
    db.query(
      "SELECT r.requirementId, r.caretakerId FROM requirement r WHERE r.userId = ?",
      [userId],
      (err, results) => {
        if (err) {
          console.error("Error querying database:", err);
          return res.status(500).send("Error querying database.");
        }

        if (results.length === 0) {
          return res.status(404).send("Requirement not found for the user.");
        }

        const { requirementId, caretakerId } = results[0];

        // Insert the feedback into the feedback table
        db.query(
          "INSERT INTO feedback (Date, description, userId, requirementId) VALUES (?, ?, ?, ?)",
          [currentDate, feedback, userId, requirementId],
          (err, results) => {
            if (err) {
              console.error("Error updating database:", err);
              return res.status(500).send("Error updating database.");
            }
            res.status(200).send("Feedback added successfully");
          }
        );
      }
    );
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).send("An error occurred.");
  }
};


// export const getFeedbackHistory = (req, res) => {
//   const { userId } = req.params;

//   try {
//     // Query the feedback table to get the feedback data
//     db.query(
//       `SELECT 
//           f.Date, 
//           f.description
//       FROM 
//           feedback f
//       WHERE 
//           f.userId = ?;`,

//       [userId],
//       (err, feedbacks) => {
//         if (err) {
//           console.error("Error querying database:", err);
//           return res.status(500).send("Error querying database.");
//         }

//         res.status(200).json(feedbacks);
//       }
//     );
//   } catch (error) {
//     console.error("Error querying database:", error);
//     return res.status(500).send("Error querying database.");
//   }
// };


export const getFeedbackHistory = (req, res) => {
  const requirementId  = req.params.requirmentId;
  console.log(requirementId);

  try {
    // Query the feedback table to get the feedback data
    db.query(
      `SELECT 
          f.Date, 
          f.description
      FROM 
          feedback f
      WHERE 
          f.requirementId = ?;`,

      [requirementId],
      (err, feedbacks) => {
        if (err) {
          console.error("Error querying database:", err);
          return res.status(500).send("Error querying database.");
        }

        res.status(200).json(feedbacks);
      }
    );
  } catch (error) {
    console.error("Error querying database:", error);
    return res.status(500).send("Error querying database.");
  }
};

