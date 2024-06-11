import { db } from "../server.js";

export const addfeedback = (req, res) => {
  const feedbackData = req.body;
  const { userId, feedback } = feedbackData;
  let currentDate = new Date();

  // Query the requirement table to get requirementId
  db.query(
    "SELECT requirementId FROM requirement WHERE userId = ?",
    [userId],
    (err, requirement) => {
      if (err) {
        console.error("Error querying database:", err);
        return res.status(500).send("Error querying database.");
      }

      const requirementId = requirement[0].requirementId;

      // Query the careplan table to get careplanId
      db.query(
        "SELECT careplanId FROM careplan WHERE requirementId = ?",
        [requirementId],
        (err, careplan) => {
          if (err) {
            console.error("Error querying database:", err);
            return res.status(500).send("Error querying database.");
          }

          const careplanId = careplan[0].careplanId;

          // Now you have the careplanId, insert the feedback into the database
          db.query(
            "INSERT INTO feedback (Date, description, userId, careplanId) VALUES (?, ?, ?, ?)",
            [currentDate, feedback, userId, careplanId],
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
    }
  );
};

export const getcaregiver = (req, res) => {
  const { userId } = req.params;

  // Query the feedback, careplan, and caregiver tables to get the feedback data
  db.query(
    `SELECT 
        u.userName, 
        c.gender, 
        u.mobileNo
    FROM 
        careplan cp
    JOIN 
        caregiver c ON cp.caregiverId = c.caregiverId
    JOIN 
        usernew u ON c.userId = u.userId
    WHERE 
        cp.caretakerId = (
            SELECT caretakerId
            FROM caretakernew
            WHERE userId = ?
        );`,

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

export const getFeedbackHistory = (req, res) => {
  const { userId } = req.params;

  try {
    // Query the feedback table to get the feedback data
    db.query(
      `SELECT 
          f.Date, 
          f.description
      FROM 
          feedback f
      WHERE 
          f.userId = ?;`,
  
      [userId],
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
}