import bcrypt from "bcrypt";
import db from "../config/db.js";

// Register a new user
export const registerController = async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    db.userRegister(query,[firstName, lastName, email, password, role],(err, results) => {
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
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};
