import bcrypt from "bcrypt";
import { db } from "../server.js";

export const registerCaretaker = async (req, res) => {
  const { userName, password } = req.body;
  const USER_TYPE = "caretaker";

  if (!userName || !password) {
    return res
      .status(400)
      .json({ error: "User Name and password are required" });
  }

  try {
    const [existing] = await db
      .promise()
      .query("SELECT * FROM user WHERE userName = ? AND userType = ?", [
        userName,
        USER_TYPE,
      ]);

    if (existing.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.promise().query("INSERT INTO user SET ?", {
      userName,
      password: hash,
      userType: USER_TYPE,
    });

    const userId = result.insertId;

    try {
      // Create a placeholder record in caretaker table
      const [caretakerResult] = await db
        .promise()
        .query("INSERT INTO caretaker (userId) VALUES (?)", [userId]);

      const caretakerId = caretakerResult.insertId;

      // Create placeholder records in dependent tables
      await db
        .promise()
        .query("INSERT INTO caretakeraddress (caretakerId) VALUES (?)", [
          caretakerId,
        ]);

      await db
        .promise()
        .query("INSERT INTO caretakermedicondition (caretakerId) VALUES (?)", [
          caretakerId,
        ]);
    } catch (placeholderErr) {
      console.warn(
        "Could not insert placeholder records:",
        placeholderErr.message,
      );
    }

    return res.status(201).json({
      message: "Caretaker registered successfully",
      userId,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

export const registerAdmin = async (req, res) => {
  const { firstName, lastName, userName, password } = req.body;
  const USER_TYPE = "admin";

  if (!userName || !password) {
    return res
      .status(400)
      .json({ error: "User Name and password are required" });
  }

  try {
    const [existing] = await db
      .promise()
      .query("SELECT * FROM user WHERE userName = ? AND userType = ?", [
        userName,
        USER_TYPE,
      ]);

    if (existing.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await db.promise().query("INSERT INTO user SET ?", {
      firstName,
      lastName,
      userName,
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

export const registerCaregiver = (req, res) => {
  const {
    firstName,
    lastName,
    userName,
    password,
    mobileNo,
    dob,
    address,
    specialization,
  } = req.body;
  const userType = "caregiver";

  if (!userName || !password) {
    return res
      .status(400)
      .json({ error: "User Name and password are required" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error during registration:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    db.query(
      "SELECT * FROM user WHERE userName = ? AND userType = ?",
      [userName, userType],
      (err, results) => {
        if (err) {
          console.error("Error during registration:", err);
          return res
            .status(500)
            .json({ error: "Internal Server Error", details: err.message });
        }

        if (results.length > 0) {
          return res.status(409).json({ error: "Username already exists" });
        }

        db.query(
          "INSERT INTO user SET ?",
          {
            firstName,
            lastName,
            userName,
            password: hash,
            userType,
            mobileNo,
            dob,
          },
          (err, results) => {
            if (err) {
              console.error("Error during registration:", err);
              return res
                .status(500)
                .json({ error: "Internal Server Error", details: err.message });
            }

            const userId = results.insertId;

            // Insert into caregiver table
            db.query(
              "INSERT INTO caregiver (userId, specialization, availability) VALUES (?, ?, 'AVAILABLE')",
              [userId, specialization || "General"],
              (err, results) => {
                if (err) {
                  console.error("Error during caregiver data insertion:", err);
                  return res.status(500).json({
                    error: "Internal Server Error",
                    details: err.message,
                  });
                }

                // Insert into useraddress
                db.query(
                  "INSERT INTO useraddress (address, userId) VALUES (?, ?)",
                  [address, userId],
                  (err, results) => {
                    if (err) {
                      console.error(
                        "Error during address data insertion:",
                        err,
                      );
                      return res.status(500).json({
                        error: "Internal Server Error",
                        details: err.message,
                      });
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

export const login = (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  db.query(
    "SELECT * FROM user WHERE userName = ?",
    [userName],
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
    },
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

export const updateCaretakerProfile = (req, res) => {
  const {
    userId,
    firstName,
    lastName,
    nationalId,
    mobileNo,
    dob,
    address,
    mediCondition,
    emergCont,
    category,
  } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  db.query(
    "SELECT * FROM caretaker WHERE userId = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("User cannot find:", err);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }

      if (results.length > 0) {
        const caretakerId = results[0].caretakerId;
        db.query(
          "UPDATE caretaker SET firstName = ?, lastName = ?, dob = ?, mobileNo = ?, emergCont = ?, category = ? WHERE userId = ?",
          [firstName, lastName, dob, mobileNo, emergCont, category, userId],
          (err) => {
            if (err) {
              console.error("Error during update:", err);
              return res
                .status(500)
                .json({ error: "Internal Server Error", details: err.message });
            }

            db.query(
              "UPDATE caretakeraddress SET address = ? WHERE caretakerId = ?",
              [address, caretakerId],
              (err) => {
                if (err) {
                  console.error("Error during address update:", err);
                  return res.status(500).json({
                    error: "Internal Server Error",
                    details: err.message,
                  });
                }

                db.query(
                  "UPDATE caretakermedicondition SET mediCondition = ? WHERE caretakerId = ?",
                  [mediCondition, caretakerId],
                  (err) => {
                    if (err) {
                      console.error("Error during mediCondition update:", err);
                      return res.status(500).json({
                        error: "Internal Server Error",
                        details: err.message,
                      });
                    }
                    return res
                      .status(200)
                      .json({ message: "Data updated successfully" });
                  },
                );
              },
            );
          },
        );
      } else {
        db.query(
          "INSERT INTO caretaker (firstName, lastName, nationalId, dob, mobileNo, emergCont, category, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            firstName,
            lastName,
            nationalId,
            dob,
            mobileNo,
            emergCont,
            category,
            userId,
          ],
          (err, results) => {
            if (err) {
              console.error("Error during registration:", err);
              return res
                .status(500)
                .json({ error: "Internal Server Error", details: err.message });
            }

            const caretakerId = results.insertId;

            db.query(
              "INSERT INTO caretakeraddress (address, caretakerId) VALUES (?, ?)",
              [address, caretakerId],
              (err) => {
                if (err) {
                  console.error("Error during address data insertion:", err);
                  return res.status(500).json({
                    error: "Internal Server Error",
                    details: err.message,
                  });
                }

                db.query(
                  "INSERT INTO caretakermedicondition (mediCondition, caretakerId) VALUES (?, ?)",
                  [mediCondition, caretakerId],
                  (err) => {
                    if (err) {
                      console.error(
                        "Error during mediCondition data insertion:",
                        err,
                      );
                      return res.status(500).json({
                        error: "Internal Server Error",
                        details: err.message,
                      });
                    }
                    return res.status(201).json({
                      message: "Caretaker data registered successfully",
                    });
                  },
                );
              },
            );
          },
        );
      }
    },
  );
};

export const getCaretakerProfile = (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const query = `    
    SELECT 
      ct.*, 
      cta.address
    FROM caretaker ct
    LEFT JOIN caretakeraddress cta ON ct.caretakerId = cta.caretakerId
    WHERE ct.userId = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching caretaker data:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Caretaker data not found" });
    }
    res.json(results[0]);
  });
};

export const logout = (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
