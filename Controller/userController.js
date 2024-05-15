import bcrypt from 'bcrypt';
import { db } from "../server.js";

export const registerCaretaker = (req, res) => {
  const {
    firstName,
    lastName,
    password,
    mobileNo,
    dob,
    gender,
    address,
    category,
  } = req.body;
  const usertype = "caretaker";
  const username = firstName + lastName;

  if (!firstName || !lastName || !password) {
    return res
      .status(400)
      .json({ error: "Name and password are required" });
  }

  // Hash the password before storing it in the database
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error during registration:", err);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    }

    db.query(
      "SELECT * FROM usernew WHERE firstName = ? AND lastName = ? AND usertype = ?",
      [firstName, lastName, usertype],
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
          "INSERT INTO usernew SET ?",
          {
            firstName,
            lastName,
            password: hash,
            usertype,
            gender,
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

            db.query(
              "INSERT INTO caretakernew (category, userId) VALUES (?, ?)",
              [category, userId],
              (err, results) => {
                if (err) {
                  console.error("Error during caretaker data insertion:", err);
                  return res.status(500).json({
                    error: "Internal Server Error",
                    details: err.message,
                  });
                }

                db.query(
                  "INSERT INTO useraddress (address, userId) VALUES (?, ?)",
                  [address, userId],
                  (err, results) => {
                    if (err) {
                      console.error("Error during address data insertion:", err);
                      return res.status(500).json({
                        error: "Internal Server Error",
                        details: err.message,
                      });
                    }

                    res.status(201).json({
                      message: "User and caretaker data registered successfully",
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};



// import { db } from "../server.js";


// export const registerCaretaker = (req, res) => {
//   const {
//     firstName,
//     lastName,
//     password,
//     mobileNo,
//     dob,
//     gender,
//     address,
//     category,
//   } = req.body;
//   const usertype = "caretaker";
//   const username = firstName + lastName;

//   if (!firstName || !lastName || !password) {
//     return res
//       .status(400)
//       .json({ error: "Name and password are required" });
//   }

//   db.query(
//     "SELECT * FROM usernew WHERE firstName = ? AND lastName = ? AND usertype = ?",
//     [firstName, lastName, usertype],
//     (err, results) => {
//       if (err) {
//         console.error("Error during registration:", err);
//         return res
//           .status(500)
//           .json({ error: "Internal Server Error", details: err.message });
//       }

//       if (results.length > 0) {
//         return res.status(409).json({ error: "Username already exists" });
//       }

//       db.query(
//         "INSERT INTO usernew SET ?",
//         { firstName, lastName, usertype, gender, mobileNo, dob },
//         (err, results) => {
//           if (err) {
//             console.error("Error during registration:", err);
//             return res
//               .status(500)
//               .json({ error: "Internal Server Error", details: err.message });
//           }

//           const userId = results.insertId;

//           db.query(
//             "INSERT INTO caretakernew (category, userId) VALUES (?, ?)",
//             [category, userId],
//             (err, results) => {
//               if (err) {
//                 console.error("Error during caretaker data insertion:", err);
//                 return res.status(500).json({
//                   error: "Internal Server Error",
//                   details: err.message,
//                 });
//               }

//               db.query(
//                 "INSERT INTO useraddress (address, userId) VALUES (?, ?)",
//                 [address, userId],
//                 (err, results) => {
//                   if (err) {
//                     console.error("Error during address data insertion:", err);
//                     return res.status(500).json({
//                       error: "Internal Server Error",
//                       details: err.message,
//                     });
//                   }

//                   res.status(201).json({
//                     message: "User and caretaker data registered successfully",
//                   });
//                 }
//               );
//             }
//           );
//         }
//       );
//     }
//   );
// };




// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const login = (req, res) => {
  const { username, password, usertype } = req.body;
  if (!username || !password || !usertype) {
    return res
      .status(400)
      .json({ error: "Username, password, and usertype are required" });
  }

  // Check if user exists in the database
  db.query(
    "SELECT * FROM usernew WHERE username = ? AND usertype = ?",
    [username, usertype],
    (err, results) => {
      if (err) {
        console.error("Error during login:", err);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      if (password !== results[0].password) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      // Login successful
      res.status(200).json({ message: "Login successful" });
    }
  );
};

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const userDetails = (req, res) => {
  const query = "SELECT * FROM usernew";

  db.query(query, (err, results) => {
    if (err) {
      console.error(err.message);
      res.status(500).json(err.message);
    } else {
      res.json(results);
    }
  });
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Controller function to retrieve all caretaker details from the database
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
