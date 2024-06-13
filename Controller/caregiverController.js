import { db } from "../server.js";

export const getrequestedcaretakers = (req, res) => {
  try {
    db.query(
      `SELECT r.requirementId, r.requirement, r.startDate, r.endDate, r.status, r.caretakerId, r.preffGender, r.userId, un.userId, ct.category, cp.caretakerId, cp.caregiverId
      FROM requirement r
      JOIN caretakernew ct ON r.caretakerId = ct.caretakerId
      JOIN careplan cp ON r.requirementId = cp.requirementId
      JOIN usernew un ON r.userId = un.userId
      WHERE r.status = 'Pending'`,
      (err, results) => {
        if (err) {
          console.error("Error connecting to MySQL:", err);
          res.status(500).send("Error fetching data from database.");
          return;
        } else {
          res.json(results);
        }
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
};

export const acceptrequest = (req, res) => {
  const statusData = req.body;
  console.log("status data ", statusData);
  const { requirementID, status } = statusData;

  console.log("requirment id ", requirementID);
  if (!requirementID) {
    return res.status(400).send("Missing caretakerId parameter.");
  }
  try {
    db.query(
      "UPDATE requirement SET status = ? WHERE requirementId = ?",
      [status, requirementID],
      (err, results) => {
        if (err) {
          console.error("Error updating database:", err);
          return res.status(500).send("Error updating database.");
        } else {
          return res.status(200).json({ message: "Updated" });
        }
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
};

export const assignedcaretakers = (req, res) => {
  const { caregiverId } = req.query;
  console.log("incoming params ", caregiverId);

  let caregiver;

  db.query(
    `SELECT caregiverId FROM caregiver WHERE userId = ?`,
    [caregiverId],
    (err, results) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        res.status(500).send("Error fetching data from database.");
        return;
      } else {
        console.log("care giver result ", results);
        caregiver = results[0].caregiverId;

        db.query(
          `SELECT requirement.*, careplan.*, caretakernew.*, caretakeraddress.address, caretakermedicondition.mediCondition
      FROM requirement
      LEFT JOIN careplan ON careplan.requirementId = requirement.requirementId
      LEFT JOIN caretakernew ON requirement.caretakerId = caretakernew.caretakerId
      LEFT JOIN caretakeraddress ON caretakernew.caretakerId = caretakeraddress.caretakerId
      LEFT JOIN caretakermedicondition ON caretakermedicondition.caretakerId = caretakernew.caretakerId
      WHERE careplan.caregiverId = ?`,
          [caregiver],
          (err, results) => {
            if (err) {
              console.error("Error connecting to MySQL:", err);
              res.status(500).send("Error fetching data from database.");
              return;
            } else {
              console.log("care giver result ", results);
              res.status(200).json(results);
            }
          }
        );
      }
    }
  );

  // console.log("caregiver 1234 ", caregiver);

  // try {
  //   db.query(
  //     `SELECT requirement.*, careplan.*, caretakernew.*, caretakeraddress.address, caretakermedicondition.mediCondition
  //     FROM requirement
  //     LEFT JOIN careplan ON careplan.requirementId = requirement.requirementId
  //     LEFT JOIN caretakernew ON requirement.caretakerId = caretakernew.caretakerId
  //     LEFT JOIN caretakeraddress ON caretakernew.caretakerId = caretakeraddress.caretakerId
  //     LEFT JOIN caretakermedicondition ON caretakermedicondition.caretakerId = caretakernew.caretakerId
  //     WHERE careplan.caregiverId = ?`,
  //     [caregiver],
  //     (err, results) => {
  //       if (err) {
  //         console.error("Error connecting to MySQL:", err);
  //         res.status(500).send("Error fetching data from database.");
  //         return;
  //       } else {
  //         console.log("care giver result ", results);
  //         res.json(results);
  //       }
  //     }
  //   );
  // } catch (error) {
  //   console.error(error.message);
  //   res.status(500).send("Internal server error.");
  // }
};

export const rejectRequest = (req, res) => {
  const { caretakerId } = req.params;
  try {
    db.query(
      "UPDATE requirement SET status = 'Rejected' WHERE caretakerId = ? AND status = 'Rejected'",
      [caretakerId],
      (err, results) => {
        if (err) {
          console.error("Error updating status in MySQL:", err);
          res.status(500).send("Error updating status in database.");
          return;
        } else {
          res.json({ message: "Request rejected successfully." });
        }
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
};

export const getAllRequirements = (req, res) => {
  db.query(
    `SELECT
    r.status,
    r.requirementId,
    r.requirement,
    r.startDate,
    r.endDate,
    r.caretakerId,
    r.preffGender,
    ct.category,
    ct.userId,
    ct.firstName,
    ct.lastName,
    ct.medicareNumber,
    ct.mobileNo,
    ct.dob,
    ct.emergCont,
    cta.address,
    ctm.mediCondition
    FROM
    requirement r
    JOIN caretakernew ct ON r.caretakerId = ct.caretakerId
    JOIN caretakeraddress cta ON ct.caretakerId = cta.caretakerId
    JOIN caretakermedicondition ctm ON ct.caretakerId = ctm.caretakerId;`,
    (err, results) => {
      if (err) {
        console.error("Error fetching requirements:", err.message);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }
      res.json(results);
    }
  );
};

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
//         "SELECT careplanId FROM careplan WHERE requirementId = ?",
//         [requirementId],
//         (err, careplan) => {
//           if (err) {
//             console.error("Error querying database:", err);
//             return res.status(500).send("Error querying database.");
//           }

//           const careplanId = careplan[0].careplanId;

//           // Now you have the careplanId, insert the feedback into the database
//           db.query(
//             "INSERT INTO feedback (Date, description, userId, careplanId) VALUES (?, ?, ?, ?)",
//             [currentDate, feedback, userId, careplanId],
//             (err, results) => {
//               if (err) {
//                 console.error("Error updating database:", err);
//                 return res.status(500).send("Error updating database.");
//               }
//               res.status(200).send("Feedback added successfully");
//             }
//           );
//         }
//       );
//     }
//   );
// };

export const getRequrimentRelatedToUserID = async (req, res) => {
  try {
    const {  userId } = req.query;

    // First query to get caregiverId
    const caregiverQuery =
      "SELECT caregiverId FROM caregiver WHERE userId=?";
    const [caregiverResults] = await new Promise((resolve, reject) => {
      db.query(caregiverQuery, [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (caregiverResults.length === 0) {
      return res.status(404).json({ error: "Caregiver not found" });
    }

    console.log("care giver results ",caregiverResults?.caregiverId);
    const caregiverIdFromDB = caregiverResults?.caregiverId;

    // Second query to get requirements
    const requirementQuery =
      "SELECT * FROM requirement WHERE caregiverId=? ORDER BY startDate DESC";
    const requirementResults = await new Promise((resolve, reject) => {
      db.query(requirementQuery, [caregiverIdFromDB], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    console.log("requirment resulrs ",requirementResults);

    // Fetch caretaker details for each requirement
    const requirementsWithCaretakerDetails = await Promise.all(
      requirementResults.map(async (requirement) => {
        const caretakerQuery =
          "SELECT caretakernew.*,caretakernew.firstName as caretakerFirstName, caretakernew.lastName as caretakerLastName, usernew.* FROM caretakernew INNER JOIN usernew ON usernew.userId=caretakernew.userId WHERE caretakernew.caretakerId=?";
        const [caretakerResults] = await new Promise((resolve, reject) => {
          db.query(caretakerQuery, [requirement.caretakerId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
          });
        });

        requirement.careTakerDetails = caretakerResults;
        return requirement;
      })
    );

    res.json(requirementsWithCaretakerDetails);
  } catch (error) {
    console.log("error ",error);
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
