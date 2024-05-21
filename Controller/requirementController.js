import { db } from "../server.js";

//##############  Controller function to insert details into the requirement table of the database ###############################

export const insertRequirement = (req, res) => {
  const { requirement, startDate, endDate, mediCondition, prefGender, caretakerId } = req.body;

  db.query(
    "INSERT INTO requirement (requirement, startDate, endDate, mediCondition, prefGender, caretakerId) VALUES (?, ?, ?, ?, ?, ?)",
    [requirement, startDate, endDate, mediCondition, prefGender, caretakerId],
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
