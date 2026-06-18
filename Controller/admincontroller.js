import { db } from "../db.js";

//##############  Controller function to insert details into the requirement table of the database ###############################

export const insertRequest = (req, res) => {
  console.log(req.body);
  const { startDate, endDate, requirement, userId, preffGender } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Get the caretakerId from the caretaker table using userId
  db.query(
    "SELECT caretakerId FROM caretaker WHERE userId = ?",
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
        "INSERT INTO requirement (startDate, endDate, requirement, caretakerId, preffGender) VALUES (?,?,?,?,?)",
        [startDate, endDate, requirement, caretakerId, preffGender],
        (err, results) => {
          if (err) {
            console.error("Error during requirement insertion:", err);
            return res
              .status(500)
              .json({ error: "Internal Server Error", details: err.message });
          }

          res
            .status(201)
            .json({ message: "Requirement inserted successfully" });
        },
      );
    },
  );
};

export const getAllcaretakers = (req, res) => {
  db.query("SELECT * FROM caretaker", (err, results) => {
    if (err) {
      console.error("Error fetching caretakers:", err.message);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
    res.json(results);
  });
};

export const getAllRequest = (req, res) => {
  db.query("SELECT * FROM requirement", (err, results) => {
    if (err) {
      console.error("Error fetching requests", err.message);
      return res
        .status(500)
        .json({ error: "Server Error", details: err.message });
    }
    res.json(results)
  });
};


