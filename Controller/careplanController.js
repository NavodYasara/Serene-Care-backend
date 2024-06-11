import { db } from "../server.js";

export const getCareplans = async (req, res) => {
  try {
    const careplans = await new Promise((resolve, reject) => {
      db.query(
        `SELECT cp.careplanId, cp.category, cp.instruction, cp.status, r.startDate, r.endDate, 
                ct.firstName AS caretakerFirstName, ct.lastName AS caretakerLastName,
                cg.firstName AS caregiverFirstName, cg.lastName AS caregiverLastName
         FROM careplan cp
         LEFT JOIN requirement r ON cp.requirementId = r.requirementId
         LEFT JOIN caretakernew ct ON cp.caretakerId = ct.caretakerId
         LEFT JOIN caregiver c ON cp.caregiverId = c.caregiverId
         LEFT JOIN usernew cg ON c.userId = cg.userId`,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
    res.json(careplans);
  } catch (err) {
    console.error("Failed to retrieve careplans:", err);
    res.status(500).json({ error: "Failed to retrieve careplans" });
  }
};

// import { db } from "../server.js";

// export const getCareplans = async (req, res) => {
//   try {
//     const careplans = await new Promise((resolve, reject) => {
//       db.query(
//         `SELECT cp.careplanId, cp.category, cp.instruction, cp.status, r.startDate, r.endDate,
//         ct.firstName AS caretakerFirstName, ct.lastName AS caretakerLastName,
//         cg.firstName AS caregiverFirstName, cg.lastName AS caregiverLastName
//          FROM careplan cp
//          LEFT JOIN requirement r ON cp.requirementId = r.requirementId
//          LEFT JOIN caretakernew ct ON cp.caretakerId = ct.caretakerId
//          LEFT JOIN caregiver c ON cp.caregiverId = c.caregiverId
//          LEFT JOIN usernew cg ON c.userId = cg.userId`,
//         (err, results) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(results);
//           }
//         }
//       );
//     });
//     res.json(careplans);
//   } catch (err) {
//     console.error("Failed to retrieve careplans:", err);
//     res.status(500).json({ error: "Failed to retrieve careplans" });
//   }
// };
