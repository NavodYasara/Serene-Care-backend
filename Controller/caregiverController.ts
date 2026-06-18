import { Request, Response } from "express";
import { db } from "../db.js";

export const getrequestedcaretakers = (req: Request, res: Response): void => {
  try {
    db.query(
      `SELECT r.requirementId, r.requirement, r.startDate, r.endDate, r.status, r.caretakerId, r.preffGender, r.userId, un.userId, ct.category, cp.caretakerId, cp.caregiverId
      FROM requirement r
      JOIN caretaker ct ON r.caretakerId = ct.caretakerId
      JOIN appoinment cp ON r.requirementId = cp.requirementId
      JOIN user un ON r.userId = un.userId
      WHERE r.status = 'Pending'`,
      (err, results) => {
        if (err) {
          console.error("Error connecting to MySQL:", err);
          res.status(500).send("Error fetching data from database.");
          return;
        }
        res.json(results);
      },
    );
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
};

export const acceptrequest = (req: Request, res: Response): void => {
  const statusData = req.body;
  console.log("status data ", statusData);
  const { requirmentID, status } = statusData;

  console.log("requirment id ", requirmentID);
  if (!requirmentID) {
    res.status(400).send("Missing caretakerId parameter.");
    return;
  }
  try {
    db.query(
      "UPDATE requirement SET status = ? WHERE requirementId = ?",
      [status, requirmentID],
      (err) => {
        if (err) {
          console.error("Error updating database:", err);
          res.status(500).send("Error updating database.");
          return;
        }

        db.query(
          "UPDATE appoinment SET status = ? WHERE requirementId = ?",
          [status, requirmentID],
          (err) => {
            if (err) {
              console.error("Error updating appoinment table:", err);
              res.status(500).send("Error updating appoinment table.");
              return;
            }
            res.status(200).send("Request accepted");
          },
        );
      },
    );
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
};

export const assignedcaretakers = (req: Request, res: Response): void => {
  const { caregiverId } = req.query;
  console.log("incoming params ", caregiverId);

  let caregiver: any;

  db.query(
    `SELECT caregiverId FROM caregiver WHERE userId = ?`,
    [caregiverId],
    (err, results: any) => {
      if (err) {
        console.error("Error connecting to MySQL:", err);
        res.status(500).send("Error fetching data from database.");
        return;
      }

      if (!results || results.length === 0) {
        res.status(404).send("Caregiver not found.");
        return;
      }

      console.log("care giver result ", results);
      caregiver = results[0].caregiverId;

      db.query(
        `SELECT requirement.*, appoinment.*, caretaker.*, caretakeraddress.address, caretaker.mediCon
        FROM requirement
        LEFT JOIN appoinment ON appoinment.requirementId = requirement.requirementId
        LEFT JOIN caretaker ON requirement.caretakerId = caretaker.caretakerId
        LEFT JOIN caretakeraddress ON caretaker.caretakerId = caretakeraddress.caretakerId
        WHERE appoinment.caregiverId = ?
        `,
        [caregiver],
        (err, queryResults) => {
          if (err) {
            console.error("Error connecting to MySQL:", err);
            res.status(500).send("Error fetching data from database.");
            return;
          }
          console.log("care giver result ", queryResults);
          res.status(200).json(queryResults);
        },
      );
    },
  );
};

export const rejectRequest = (req: Request, res: Response): void => {
  const { caretakerId } = req.params;
  try {
    db.query(
      "UPDATE appoinment SET status = 'Rejected' WHERE caretakerId = ? AND status = 'Rejected'",
      [caretakerId],
      (err) => {
        if (err) {
          console.error("Error updating status in MySQL:", err);
          res.status(500).send("Error updating status in database.");
          return;
        }
        res.json({ message: "Request rejected successfully." });
      },
    );
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
};

export const getAllRequirements = (req: Request, res: Response): void => {
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
    ct.mediCon,
    ct.emergCont,
    cta.address
    FROM
    requirement r
    JOIN caretaker ct ON r.caretakerId = ct.caretakerId
    JOIN caretakeraddress cta ON ct.caretakerId = cta.caretakerId`,
    (err, results) => {
      if (err) {
        console.error("Error fetching requirements:", err.message);
        res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
        return;
      }
      res.json(results);
    },
  );
};
