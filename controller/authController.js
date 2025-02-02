import bcrypt from "bcrypt";
import db from "../config/db.js";

// Register a new user
export const registerController = async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, userName, email, password, role } = req.body;

  if (!firstName || !lastName || !userName || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(query,[firstName, lastName, userName, email, password, role],(err, results) => {
      if (err) {
        console.error(err.message);
        res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      } else {
        res.status(201).json({ message: "User registered successfully" });
      } 
    }
  );
};
