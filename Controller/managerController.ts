import { Request, Response } from "express";
import { db } from "../db.js";

// Get detailed caretaker information from both ct & ctAddress
export const getCaretakerInformation = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `
      SELECT *
      FROM requirement r
      LEFT JOIN caretaker ct 
      ON r.caretakerId = ct.caretakerId
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json(results);
      }
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get caretaker details by ID
export const getCaretakerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const caretakerId = req.params.caretakerId;

    const query = `
      SELECT 
          ct.*, 
        r.requirement, 
        cta.address, 
        DATE_FORMAT(ct.dob, '%Y-%m-%d') AS formattedDob,
        ct.firstName,
        ct.lastName
        FROM caretaker ct
        LEFT JOIN requirement r ON ct.caretakerId = r.caretakerId 
        LEFT JOIN caretakeraddress cta ON ct.caretakerId = cta.caretakerId
        WHERE ct.caretakerId = ?; 
    `;

    db.query(query, [caretakerId], (err, results: any) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else if (!results || results.length === 0) {
        res.status(404).json({ error: "Not Found" });
      } else {
        res.json(results[0]);
      }
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get caregivers from user and caregiver tables to the caregier information section
export const getCaregivers = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = `SELECT * FROM user u JOIN caregiver cg ON u.userId = cg.userId WHERE u.userType = 'Caregiver' AND cg.availability = 'AVAILABLE'`;
    db.query(query, (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message }); // Send an error response
      } else {
        res.status(200).json(results); // Ensure correct Content-Type and complete JSON
      }
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message }); // Send an error response
  }
};

// Get caregiver details by ID
export const getCaregiverById = async (req: Request, res: Response): Promise<void> => {
  const caregiverId = req.params.caregiverId;
  try {
    const query = `
      SELECT *
      FROM user u
      JOIN caregiver cg ON u.userId = cg.userId
      JOIN caregiveraddress cga ON cg.caregiverId = cga.caregiverId
      WHERE cg.caregiverId = ?
    `;

    db.query(query, [caregiverId], (err, results: any) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else if (!results || results.length === 0) {
        res.status(404).json({ error: "Caregiver not found" });
      } else {
        res.json(results[0]);
      }
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const allocateCaregiver = async (req: Request, res: Response): Promise<void> => {
  try {
    const { caretakerId, caregiverId, requirementId, instruction } =
      req.body;
    console.log(caregiverId);

    // Fetch the category for the given caretakerId
    const categoryQuery = `SELECT category FROM caretaker WHERE caretakerId = ?`;
    db.query(categoryQuery, [caretakerId], (err, results: any) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
        return;
      }

      if (!results || results.length === 0) {
        res.status(404).json({ error: "Caretaker category not found" });
        return;
      }

      const category = results[0].category;

      // Check if a row with the relevant requirementId exists in the appoinment table
      const checkQuery = `SELECT * FROM appoinment WHERE requirementId = ?`;
      db.query(checkQuery, [requirementId], (err, checkResults: any) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: err.message });
          return;
        }

        // If a row with the relevant requirementId exists, update it. Otherwise, insert a new row.
        const isUpdate = checkResults && checkResults.length > 0;
        const query = isUpdate
          ? `
            UPDATE appoinment
            SET caretakerId = ?, caregiverId = ?, status = 'not assigned', instruction = ?, category = ?
            WHERE requirementId = ?
          `
          : `
            INSERT INTO appoinment (caretakerId, caregiverId, requirementId, status, instruction, category)
            VALUES (?, ?, ?, 'not assigned', ?, ?)
          `;

        db.query(
          query,
          isUpdate
            ? [caretakerId, caregiverId, instruction, category, requirementId]
            : [caretakerId, caregiverId, requirementId, instruction, category],
          (err) => {
            if (err) {
              console.error(err.message);
              res.status(500).json({ error: err.message });
            } else {
              const message = isUpdate
                ? "appoinment updated successfully!"
                : "Caregiver allocated successfully!";
              res.json({ message });
            }
          },
        );
      });
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const handleinstruction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { instruction, requirementId } = req.body;
    const query = `update appoinment set instruction = ? where requirementId = ?`;
    db.query(query, [instruction, requirementId], (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Instruction updated successfully!" });
      }
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
