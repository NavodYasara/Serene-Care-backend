import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

export const registerCaretaker = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { email, password } = req.body;
  const USER_TYPE = "caretaker";

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "User Name and password are required" });
  }

  try {
    const [existing]: any = await db
      .promise()
      .query("SELECT * FROM user WHERE email = ? AND userType = ?", [
        email,
        USER_TYPE,
      ]);

    if (existing && existing.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result]: any = await db.promise().query("INSERT INTO user SET ?", {
      email,
      password: hash,
      userType: USER_TYPE,
    });

    const userId = result.insertId;

    try {
      // Create a placeholder record in caretaker table
      const [caretakerResult]: any = await db
        .promise()
        .query("INSERT INTO caretaker (userId) VALUES (?)", [userId]);

      const caretakerId = caretakerResult.insertId;

      // Create placeholder records in dependent tables
      await db
        .promise()
        .query("INSERT INTO caretakeraddress (caretakerId) VALUES (?)", [
          caretakerId,
        ]);
    } catch (placeholderErr: any) {
      console.warn(
        "Could not insert placeholder records:",
        placeholderErr.message,
      );
    }

    return res.status(201).json({
      message: "Caretaker registered successfully",
      userId,
    });
  } catch (err: any) {
    console.error("Error during registration:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

export const registerAdmin = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const { firstName, lastName, email, password } = req.body;
  const USER_TYPE = "admin";

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "User Name and password are required" });
  }

  try {
    const [existing]: any = await db
      .promise()
      .query("SELECT * FROM user WHERE email = ? AND userType = ?", [
        email,
        USER_TYPE,
      ]);

    if (existing && existing.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result]: any = await db.promise().query("INSERT INTO user SET ?", {
      firstName,
      lastName,
      email,
      password: hash,
      userType: USER_TYPE,
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      userId: result.insertId, // now actually used
    });
  } catch (err) {
    console.error("Error during registration:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const registerCaregiver = (req: Request, res: Response): void => {
  const {
    firstName,
    lastName,
    email,
    password,
    mobileNo,
    dob,
    address,
    specialization,
  } = req.body;
  const userType = "caregiver";

  if (!email || !password) {
    res.status(400).json({ error: "User Name and password are required" });
    return;
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error during registration:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
      return;
    }

    db.query(
      "SELECT * FROM user WHERE email = ? AND userType = ?",
      [email, userType],
      (err, results: any) => {
        if (err) {
          console.error("Error during registration:", err);
          res
            .status(500)
            .json({ error: "Internal Server Error", details: err.message });
          return;
        }

        if (results && results.length > 0) {
          res.status(409).json({ error: "email already exists" });
          return;
        }

        db.query(
          "INSERT INTO user SET ?",
          {
            firstName,
            lastName,
            email,
            password: hash,
            userType,
            mobileNo,
            dob,
          },
          (err, results: any) => {
            if (err) {
              console.error("Error during registration:", err);
              res
                .status(500)
                .json({ error: "Internal Server Error", details: err.message });
              return;
            }

            const userId = results.insertId;

            // Insert into caregiver table
            db.query(
              "INSERT INTO caregiver (userId, specialization, availability) VALUES (?, ?, 'AVAILABLE')",
              [userId, specialization || "General"],
              (err) => {
                if (err) {
                  console.error("Error during caregiver data insertion:", err);
                  res.status(500).json({
                    error: "Internal Server Error",
                    details: err.message,
                  });
                  return;
                }

                // Insert into useraddress
                db.query(
                  "INSERT INTO useraddress (address, userId) VALUES (?, ?)",
                  [address, userId],
                  (err) => {
                    if (err) {
                      console.error(
                        "Error during address data insertion:",
                        err,
                      );
                      res.status(500).json({
                        error: "Internal Server Error",
                        details: err.message,
                      });
                      return;
                    }

                    res.status(201).json({
                      message: "Caregiver registered successfully",
                    });
                  },
                );
              },
            );
          },
        );
      },
    );
  });
};

export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  db.query(
    "SELECT * FROM user WHERE email = ?",
    [email],
    (err, results: any) => {
      if (err) {
        console.error("Error during login:", err);
        res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
        return;
      }

      if (!results || results.length === 0) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      bcrypt.compare(password, results[0].password, (err, isMatch) => {
        if (err) {
          console.error("Error during login:", err);
          res
            .status(500)
            .json({ error: "Internal Server Error", details: err.message });
          return;
        }

        if (!isMatch) {
          res.status(401).json({ error: "Invalid email or password" });
          return;
        }

        // Login successful, include user type in the response
        console.log(results[0]);
        const userType = results[0].userType;

        const token = jwt.sign(
          { userId: results[0].userId, userType },
          process.env.JWT_SECRET || "serene_care_super_secret_key",
          { expiresIn: "10h" },
        );

        res.status(200).json({
          message: "Login successful",
          userType,
          userProfile: results[0],
          token,
        });
      });
    },
  );
};

export const userProfile = (req: Request, res: Response): void => {
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

export const getCaretakerDetails = (req: Request, res: Response): void => {
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

export const getCareTakerById = (req: Request, res: Response): void => {
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

export const updateCaretakerProfile = (req: Request, res: Response): void => {
  const {
    userId,
    firstName,
    lastName,
    email,
    nationalId,
    mobileNo,
    dob,
    address,
    mediCon,
    emergCont,
  } = req.body;

  if (!userId) {
    res.status(400).json({ error: "userId is required" });
    return;
  }

  db.query(
    "SELECT * FROM caretaker WHERE userId = ?",
    [userId],
    (err, results: any) => {
      if (err) {
        console.error("User cannot find:", err);
        res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
        return;
      }

      if (results && results.length > 0) {
        const caretakerId = results[0].caretakerId;
        db.query(
          "UPDATE caretaker SET firstName = ?, lastName = ?, email = ?, nationalId = ?, mobileNo = ?, dob = ?, emergCont = ?, mediCon = ? WHERE userId = ?",
          [
            firstName,
            lastName,
            email,
            nationalId,
            mobileNo,
            dob,
            emergCont,
            mediCon,
            userId,
          ],
          (err) => {
            if (err) {
              console.error("Error during update:", err);
              res
                .status(500)
                .json({ error: "Internal Server Error", details: err.message });
              return;
            }

            db.query(
              "UPDATE caretakeraddress SET address = ? WHERE caretakerId = ?",
              [address, caretakerId],
              (err) => {
                if (err) {
                  console.error("Error during address update:", err);
                  res.status(500).json({
                    error: "Internal Server Error",
                    details: err.message,
                  });
                  return;
                }
                res.status(200).json({ message: "Data updated successfully" });
              },
            );
          },
        );
      } else {
        res.status(404).json({ error: "Caretaker not found" });
      }
    },
  );
};

export const getCaretakerProfile = (req: Request, res: Response): void => {
  const userId = req.query.userId;
  if (!userId) {
    res.status(400).json({ error: "userId is required" });
    return;
  }

  const query = `    
    SELECT 
      ct.*, 
      DATE_FORMAT(ct.dob, '%Y-%m-%d') AS dob,
      cta.address
    FROM caretaker ct
    LEFT JOIN caretakeraddress cta ON ct.caretakerId = cta.caretakerId
    WHERE ct.userId = ?
  `;

  db.query(query, [userId], (err, results: any) => {
    if (err) {
      console.error("Error fetching caretaker data:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
      return;
    }
    if (!results || results.length === 0) {
      res.status(404).json({ error: "Caretaker data not found" });
      return;
    }
    res.json(results[0]);
  });
};

export const logout = (req: Request, res: Response): void => {
  res.status(200).json({ message: "Logout successful" });
};
