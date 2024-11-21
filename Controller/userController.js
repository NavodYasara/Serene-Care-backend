import bcrypt from "bcrypt";
import db from "../db/db.js";


export const userRegister = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, mobileNo, userType } = req.body;

  try {
    // Validate inputs
    if (!firstName || !lastName || !email || !password || !confirmPassword || !userType) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    db.query(
      'INSERT INTO user (firstName, lastName, email, password, mobileNo, userType) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, mobileNo, userType],
      (err, results) => {
        if (err) {
          console.error("Error during registration:", err);
          return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }

        // Send success response
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "email and password are required" });
  }

  db.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Error during login:", err);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid userName or password" });
      }

      bcrypt.compare(password, results[0].password, (err, isMatch) => {
        if (err) {
          console.error("Error during login:", err);
          return res
            .status(500)
            .json({ error: "Internal Server Error", details: err.message });
        }

        if (!isMatch) {
          return res
            .status(401)
            .json({ error: "Invalid username or password" });
        }

        // Login successful, include user type in the response
        console.log(results[0]);
        const userType = results[0].userType;

        res.status(200).json({
          message: "Login successful",
          userType,
          userDetails: results[0],
        });
      });
    }
  );
};

export const userDetails = (req, res) => {
  const query = "SELECT * FROM user";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).json(err.message);
    } else {
      res.json(results);
    }
  });
};

export const getCaretakerDetails = (req, res) => {
  const query = "SELECT * FROM caretaker";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err.message);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      res.json(results);
    }
  });
};

export const getCareTakerById = (req, res) => {
  const userId = req.params.id;
  const query = "SELECT * FROM caretaker WHERE userId = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err.message);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      res.json(results);
    }
  });
};

