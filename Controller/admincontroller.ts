import { Request, Response } from "express";
import { db } from "../db.js";

//##############  Controller function to insert details into the requirement table of the database ###############################

export const insertRequest = (req: Request, res: Response): void => {
  console.log(req.body);
  const { startDate, endDate, requirement, userId, preffGender } = req.body;

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  // Get the caretakerId from the caretaker table using userId
  db.query(
    "SELECT caretakerId FROM caretaker WHERE userId = ?",
    [userId],
    (err, results: any) => {
      if (err) {
        console.error("Error fetching caretaker ID:", err);
        res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
        return;
      }

      if (!results || results.length === 0) {
        res.status(404).json({ error: "Caretaker not found" });
        return;
      }

      const caretakerId = results[0].caretakerId;

      // Now, insert the requirements into the caretakerrequirement table with the obtained caretakerId
      db.query(
        "INSERT INTO requirement (startDate, endDate, requirement, caretakerId, preffGender) VALUES (?,?,?,?,?)",
        [startDate, endDate, requirement, caretakerId, preffGender],
        (err) => {
          if (err) {
            console.error("Error during requirement insertion:", err);
            res
              .status(500)
              .json({ error: "Internal Server Error", details: err.message });
            return;
          }

          res
            .status(201)
            .json({ message: "Requirement inserted successfully" });
        },
      );
    },
  );
};

export const getAllcaretakers = (req: Request, res: Response): void => {
  db.query("SELECT * FROM caretaker", (err, results) => {
    if (err) {
      console.error("Error fetching caretakers:", err.message);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
      return;
    }
    res.json(results);
  });
};

export const getAllRequest = (req: Request, res: Response): void => {
  db.query("SELECT * FROM requirement", (err, results) => {
    if (err) {
      console.error("Error fetching requests", err.message);
      res
        .status(500)
        .json({ error: "Server Error", details: err.message });
      return;
    }
    res.json(results);
  });
};
