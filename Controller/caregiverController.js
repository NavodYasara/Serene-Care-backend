import { db } from "../server.js";

export const getrequestedcaretakers = (req, res) => {
  try {
    db.query(
      `SELECT r.requirementId, r.requirement, r.startDate, r.endDate, r.status, r.caretakerId, r.preffGender, r.userId, un.userId, ct.category, cp.caretakerId, cp.caregiverId
      FROM requirement r
      JOIN caretakernew ct ON r.caretakerId = ct.caretakerId
      JOIN careplan cp ON r.requirementId = cp.requirementId
      JOIN usernew un ON r.userId = un.userId
      WHERE r.status = 'Pending'`,
      (err, results) => {
        if (err) {
          console.error("Error connecting to MySQL:", err);
          res.status(500).send("Error fetching data from database.");
          return;
        } else {
          res.json(results);
        }
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
};


export const acceptrequest = (req, res) => {
  const caretakerId = req.params.caretakerId;
  if (!caretakerId) {
    return res.status(400).send("Missing caretakerId parameter.");
  }
  try {
    db.query(
      "SELECT * FROM requirement WHERE caretakerId = ?",
      [caretakerId],
      (err, results) => {
        if (err) {
          console.error("Error querying database:", err);
          return res.status(500).send("Error querying database.");
        }

        if (results.length === 0) {
          return res
            .status(404)
            .send("No requirement found with the provided caretakerId.");
        }

        db.query(
          "UPDATE requirement SET status = 'Accepted' WHERE caretakerId = ?",
          [caretakerId],
          (err, results) => {
            if (err) {
              console.error("Error updating database:", err);
              return res.status(500).send("Error updating database.");
            }

            db.query(
              "UPDATE careplan SET status = 'ACCEPTED' WHERE caretakerId = ?",
              [caretakerId],
              (err, results) => {
                if (err) {
                  console.error("Error updating careplan table:", err);
                  return res.status(500).send("Error updating careplan table.");
                }
                res.status(200).send("Request accepted");
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
};

export const assignedcaretakers = (req, res) => {
  const { caregiverId } = req.query;
  console.log("incoming params ", caregiverId);

  try {
    db.query(
      `SELECT requirement.*, careplan.*, caretakernew.category 
       FROM requirement 
       INNER JOIN careplan ON careplan.requirementId = requirement.requirementId 
       INNER JOIN caretakernew ON requirement.caretakerId = caretakernew.caretakerId
       WHERE careplan.caregiverId = (SELECT caregiver.caregiverId FROM caregiver WHERE caregiver.userId = ?)`,
      [caregiverId],
      (err, results) => {
        if (err) {
          console.error("Error connecting to MySQL:", err);
          res.status(500).send("Error fetching data from database.");
          return;
        } else {
          console.log("care giver result ", results);
          res.json(results);
        }
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error.");
  }
};

// import { db } from "../server.js";

// export const getrequestedcaretakers = (req, res) => {
//   try {
//     db.query(
//       "SELECT r.requirementId, r.requirement, r.startDate, r.endDate, r.status, r.caretakerId, r.preffGender, r.userId, ct.category FROM requirement r JOIN caretakernew ct ON r.caretakerId = ct.caretakerId WHERE r.status = 'Pending'",
//       // "SELECT r.requirementId, r.requirement, r.startDate, r.endDate, r.status, r.caretakerId, r.preffGender, r.userId, ct.category, cp.status FROM requirement r JOIN caretakernew ct ON r.caretakerId = ct.caretakerId JOIN careplan cp ON cp.requirementId = r.requirementWHERE cp.status = 'PENDING'",
//       (err, results) => {
//         if (err) {
//           console.error("Error connecting to MySQL:", err);
//           res.status(500).send("Error fetching data from database.");
//           return;
//         } else {
//           res.json(results);
//         }
//       }
//     );
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal server error.");
//   }
// };

// export const assignedcaretakers = (req, res) => {
//   const caregiverId = req.params.id;
//   try {
//     db.query(
//       `SELECT cp.careplanId, cp.category, cp.instruction, ct.firstName, r.startDate, r.endDate, r.requirement
//        FROM careplan cp 
//        LEFT JOIN requirement r ON cp.requirementId = r.requirementId 
//        LEFT JOIN caretakernew ct ON r.caretakerId = ct.caretakerId
//        WHERE cp.status = 'PENDING' AND cp.caregiverId = ?`,
//       [caregiverId],
//       (err, results) => {
//         if (err) {
//           console.error("Error connecting to MySQL:", err);
//           res.status(500).send("Error fetching data from database.");
//           return;
//         } else {
//           res.json(results);
//         }
//       }
//     );
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal server error.");
//   }
// };

// export const acceptrequest = (req, res) => {
//   const caretakerId = req.params.caretakerId;
//   if (!caretakerId) {
//     return res.status(400).send("Missing caretakerId parameter.");
//   }
//   try {
//     db.query(
//       "SELECT * FROM requirement WHERE caretakerId = ?",
//       [caretakerId],
//       (err, results) => {
//         if (err) {
//           console.error("Error querying database:", err);
//           return res.status(500).send("Error querying database.");
//         }

//         if (results.length === 0) {
//           return res
//             .status(404)
//             .send("No requirement found with the provided caretakerId.");
//         }

//         db.query(
//           "UPDATE requirement SET status = 'Accepted' WHERE caretakerId = ?",
//           [caretakerId],
//           (err, results) => {
//             if (err) {
//               console.error("Error updating database:", err);
//               return res.status(500).send("Error updating database.");
//             }

//             db.query(
//               "UPDATE careplan SET status = 'ACCEPTED' WHERE caretakerId = ?",
//               [caretakerId],
//               (err, results) => {
//                 if (err) {
//                   console.error("Error updating careplan table:", err);
//                   return res.status(500).send("Error updating careplan table.");
//                 }
//                 res.status(200).send("Request accepted");
//               }
//             );
//           }
//         );
//       }
//     );
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal server error.");
//   }
// };


// // export const rejectRequest = (req, res) => {
// //   const { caretakerId } = req.params;
// //   try {
// //     db.query(
// //       "UPDATE careplan SET status = 'Rejected' WHERE caretakerId = ? AND status = 'PENDING'",
// //       [caretakerId],
// //       (err, results) => {
// //         if (err) {
// //           console.error("Error updating status in MySQL:", err);
// //           res.status(500).send("Error updating status in database.");
// //           return;
// //         } else {
// //           res.json({ message: "Request rejected successfully." });
// //         }
// //       }
// //     );
// //   } catch (error) {
// //     console.error(error.message);
// //     res.status(500).send("Internal server error.");
// //   }
// // };



// // import { db } from "../server.js";

// // // export const getrequestedcaretakers = (req, res) => {
// // //   try {
// // //     db.query(
// // //       "SELECT r.requirementId r.requirement r.startDate r.endDate r.status r.caretakerId r.preffGender r.userId ct.category FROM requirement r JOIN caretakernew ct ON r.caretakerId = ct.caretakerId WHERE r.status = 'Pending'",
// // //       (err, results) => {
// // //         console.log(results);
// // //         if (err) {
// // //           console.error("Error connecting to MySQL:", err);
// // //           res.status(500).send("Error fetching data from database.");
// // //           return;
// // //         } else {
// // //           res.json(results);
// // //         }
// // //       }
// // //     );
// // //   } catch (error) {
// // //     console.error(error.message);
// // //     res.status(500).send("Internal server error.");
// // //   }
// // // };

// // // export const acceptrequest = (req, res) => {
// // //     const caretakerId = req.params.caretakerId;
// // //     try {
// // //         db.query("UPDATE requirement SET status = 'Accepted' WHERE caretakerId = ?", [caretakerId], (err, results) => {
// // //             if (err) {
// // //                 console.error('Error updating database:', err);
// // //                 res.status(500).send('Error updating database.');
// // //                 return;
// // //             } else {
// // //                 res.status(200).send('Request accepted');
// // //             }
// // //         });
// // //     } catch (error) {
// // //         console.error(error.message);
// // //         res.status(500).send('Internal server error.');
// // //     }
// // // };

// // export const getrequestedcaretakers = (req, res) => {
// //   try {
// //     db.query(
// //       "SELECT r.requirementId, r.requirement, r.startDate, r.endDate, r.status, r.caretakerId, r.preffGender, r.userId, ct.category FROM requirement r JOIN caretakernew ct ON r.caretakerId = ct.caretakerId WHERE r.status = 'Pending'",
// //       (err, results) => {
// //         if (err) {
// //           console.error("Error connecting to MySQL:", err);
// //           res.status(500).send("Error fetching data from database.");
// //           return;
// //         } else {
// //           res.json(results);
// //         }
// //       }
// //     );
// //   } catch (error) {
// //     console.error(error.message);
// //     res.status(500).send("Internal server error.");
// //   }
// // };

// // export const acceptrequest = (req, res) => {
// //   const caretakerId = req.params.caretakerId;
// //   if (!caretakerId) {
// //     return res.status(400).send("Missing caretakerId parameter.");
// //   }

// //   try {
// //     db.query(
// //       "SELECT * FROM requirement WHERE caretakerId = ?",
// //       [caretakerId],
// //       (err, results) => {
// //         if (err) {
// //           console.error("Error querying database:", err);
// //           return res.status(500).send("Error querying database.");
// //         }

// //         if (results.length === 0) {
// //           return res
// //             .status(404)
// //             .send("No requirement found with the provided caretakerId.");
// //         }

// //         db.query(
// //           "UPDATE requirement SET status = 'Accepted' WHERE caretakerId = ?",
// //           [caretakerId],
// //           (err, results) => {
// //             if (err) {
// //               console.error("Error updating database:", err);
// //               return res.status(500).send("Error updating database.");
// //             }

// //             res.status(200).send("Request accepted");
// //           }
// //         );
// //       }
// //     );
// //   } catch (error) {
// //     console.error(error.message);
// //     res.status(500).send("Internal server error.");
// //   }
// // };



