import bcrypt from "bcrypt";
import db from "../db/db.js";

// export const userRegister = async (req, res) => {
//   const {
//     firstName,
//     lastName,
//     email,
//     password,
//     confirmPassword,
//     mobileNo,
//     userType,
//   } = req.body;

//   try {
//     // Validate required fields
//     if (
//       !firstName ||
//       !lastName ||
//       !email ||
//       !password ||
//       !confirmPassword ||
//       !userType
//     ) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     // Check if passwords match
//     if (password !== confirmPassword) {
//       return res.status(400).json({ error: "Passwords do not match" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//      // Create username by combining firstName and lastName
//     //  const username = `${firstName }.${lastName}`;

//     // Insert the user into the database
//     const query =
//       "INSERT INTO user (firstName, lastName, email, password, userType, mobileNo) VALUES (?, ?, ?, ?, ?, ?, ?)";
//     db.query(
//       query,
//       [firstName, lastName, email, hashedPassword, mobileNo, userType],
//       (err, results) => {
//         if (err) {
//           console.error(err.message);
//           res
//             .status(500)
//             .json({ error: "Internal Server Error", details: err.message });
//         } else {
//           res.status(201).json({ message: "User registered successfully" });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({ error: "Internal Server Error", details: error });
//   }
  
// };

export const userRegister = async (req, res) => {
  console.log(req.body); // Log the request body for debugging

  const { firstName, lastName, email, password, mobileNo, role } = req.body;

  if (!firstName || !lastName || !email || !password || !mobileNo || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Hash the password
  //const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the user into the database
  const query = "INSERT INTO user (firstName, lastName, email, password, mobileNo, role) VALUES (?, ?, ?, ?, ?, ?)";
  
  db.query(query,[firstName, lastName, password, email, mobileNo, role],(err, results) => {
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

export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  db.query("SELECT * FROM user WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err) {
        console.error("Error during login:", err);
        return res;
        console
          .log("####1")
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
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
  });
};
