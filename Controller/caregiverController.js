import { db } from "../server.js";

export const getrequestedcaretakers = (req, res) => {
  try {
    db.query(
      `SELECT r.requirementId, r.requirement, r.startDate, r.endDate, r.status, r.caretakerId, r.preffGender, r.userId, un.userId, ct.category, cp.caretakerId, cp.caregiverId
      FROM requirement r
      JOIN caretakernew ct ON r.caretakerId = ct.caretakerId
      JOIN careplan cp ON r.requirementId = cp.requirementId
      JOIN user un ON r.userId = un.userId
      WHERE r.status = 'Pending'`,
      (err, results) => {
        if (err) {
          console.error("Error connecting to MySQL:", err);
          res.status(500).send("Error fetching data from database.");
          return;
        } else {
          res.json(results);
        }
      },
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
};

export const acceptrequest = (req, res) => {
  const statusData = req.body;
  console.log("status data ", statusData);
  const { requirmentID, status } = statusData;

  console.log("requirment id ", requirmentID);
  if (!requirmentID) {
    return res.status(400).send("Missing caretakerId parameter.");
  }
  try {
    db.query(
      "UPDATE requirement SET status = ? WHERE requirementId = ?",
      [status, requirmentID],
      (err, results) => {
        if (err) {
          console.error("Error updating database:", err);
          return res.status(500).send("Error updating database.");
        }

        db.query(
          "UPDATE careplan SET status = ? WHERE requirementId = ?",
          [status, requirmentID],
          (err, results) => {
            if (err) {
              console.error("Error updating careplan table:", err);
              return res.status(500).send("Error updating careplan table.");
            }
            res.status(200).send("Request accepted");
          },
        );
      },
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
          },
        );
      }
    },
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
      "UPDATE careplan SET status = 'Rejected' WHERE caretakerId = ? AND status = 'Rejected'",
      [caretakerId],
      (err, results) => {
        if (err) {
          console.error("Error updating status in MySQL:", err);
          res.status(500).send("Error updating status in database.");
          return;
        } else {
          res.json({ message: "Request rejected successfully." });
        }
      },
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
    ct.nationalId,
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
    },
  );
};
