import { db } from "../server.js";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween.js";
dayjs.extend(isBetween);

// Get detailed caretaker information from both ct & ctAddress & ctMediCondition tables
export const getCaretakerInformation = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM requirement r
      LEFT JOIN caretakernew ct 
      ON r.caretakerId = ct.caretakerId
      LEFT JOIN caretakermedicondition ctm
      ON ct.caretakerId = ctm.caretakerId
      WHERE r.status = 'pending'
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get caretaker details by ID
export const getCaretakerById = async (req, res) => {
  try {
    const caretakerId = req.params.caretakerId;

    const query = `
      SELECT 
        ct.*, 
        r.requirement, 
        cta.address, 
        ctm.mediCondition, 
        DATE_FORMAT(ct.dob, '%Y-%m-%d') AS formattedDob,
        ct.firstName,
        ct.lastName
        FROM caretakernew ct
        LEFT JOIN requirement r ON ct.caretakerId = r.caretakerId 
        LEFT JOIN caretakeraddress cta ON ct.caretakerId = cta.caretakerId
        LEFT JOIN caretakermedicondition ctm ON ct.caretakerId = ctm.caretakerId
        WHERE ct.caretakerId = ?; 
    `;

    db.query(query, [caretakerId], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else if (results.length === 0) {
        res.status(404).json({ error: "Not Found" });
      } else {
        res.json(results[0]);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get caregivers from usernew and caregiver tables to the caregier information section

// export const getCaregivers = async (req, res) => {
//   console.log(req.query);
//   const { startDate, endDate, preffGender } = req.query;

//   // const startDate1 = "2024-06-12";
//   // const endDate1 = "2024-10-27";

//   try {
//     const startDateObj = new Date(startDate);
//     const endDateObj = new Date(endDate);

//     const formattedStartDate = startDateObj.toISOString().split("T")[0];
//     const formattedEndDate = endDateObj.toISOString().split("T")[0];

//     const query = `
//     SELECT cg.caregiverId
//     FROM caregiver cg
//     LEFT JOIN careplan cp ON cg.caregiverId = cp.caregiverId
//     WHERE cp.caregiverId IS NULL`;
//     // const query = `
//     // SELECT cg.caregiverId
//     // FROM caregiver cg
//     // LEFT JOIN careplan cp ON cg.caregiverId = cp.caregiverId
//     // LEFT JOIN requirement r ON cp.requirementId = r.requirementId
//     // WHERE cp.caregiverId IS NULL `;

//     const query = `
//   SELECT cg.caregiverId
//   FROM caregiver cg
//   LEFT JOIN careplan cp ON cg.caregiverId = cp.caregiverId
//   LEFT JOIN requirement r ON cp.requirementId = r.requirementId
//   WHERE cp.caregiverId IS NULL
//   AND (r.startDate > ? OR r.endDate < ?)`;

//     db.query(
//       query,
//       [formattedEndDate, formattedStartDate],
//       (err, results) => {
//         console.log(results);
//         if (err) {
//           console.error(err.message);
//           res.status(500).json({ error: err.message }); // Send an error response
//         } else {
//           res.status(200).json(results); // Ensure correct Content-Type and complete JSON
//         }
//       }
//     );
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: error.message }); // Send an error response
//   }
// };

export const getCaregivers = async (req, res) => {
  try {
    const requirments = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM requirement", (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    const requirmentArray={}
    for (const requirment of requirments) {
        console.log("req ",requirment?.requirementId);
        const availableCaregivers=[];
      const startDate = dayjs(requirment?.startDate);
      const endDate = dayjs(requirment?.endDate);
      console.log(
        "requirment details ",
        requirment?.startDate,
        "   ",
        requirment?.endDate
      );
      const careGivers = await new Promise((resolve, reject) => {
        db.query("SELECT caregiver.*,usernew.* FROM caregiver INNER JOIN usernew ON usernew.userId=caregiver.userId", (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
      for (const careGiver of careGivers) {
        const careGiverID = careGiver?.caregiverId;
        const requirmentDates = await new Promise((resolve, reject) => {
          db.query("select requirement.startDate, requirement.endDate FROM requirement  WHERE requirement.caregiverId=? AND requirement.status != 'not assigned' ", [careGiverID], (err, rows) => {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        });
        console.log("Requirment Dates ", requirmentDates);
        const tempArray=[]
        for (const dates of requirmentDates) {
          const firstDate = dayjs(dates?.startDate);
          const secondDate = dayjs(dates?.endDate);
          if (!firstDate.isBetween(startDate, endDate, null, '[]') && !secondDate.isBetween(startDate,endDate,null,[])) {
            // console.log(Date ${firstDate.format()} is between ${startDate.format()} and ${endDate.format()});
            if (!availableCaregivers.includes(careGiver)) {
                availableCaregivers.push(careGiver)
            }
           
          }
        }
        if (requirmentDates.length==0) {
            if (!availableCaregivers.includes(careGiver)) {
                availableCaregivers.push(careGiver)
            }
        }
        requirmentArray[requirment?.requirementId]=availableCaregivers
      }
    }
    res.status(200).json(requirmentArray);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
};

// export const getCaregivers = async (req, res) => {

//   try {
//     const query = `SELECT * FROM usernew u JOIN caregiver cg ON u.userId = cg.userId WHERE u.userType = 'Caregiver' AND cg.availability = 'AVAILABLE'`;
//     db.query(query, (err, results) => {
//       if (err) {
//         console.error(err.message);
//         res.status(500).json({ error: err.message }); // Send an error response
//       } else {
//         res.status(200).json(results); // Ensure correct Content-Type and complete JSON
//       }
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: error.message }); // Send an error response
//   }
// };

// Get caregiver details by ID
export const getCaregiverById = async (req, res) => {
  const caregiverId = req.params.caregiverId;
  try {
    const query = `
      SELECT *
      FROM usernew u
      JOIN caregiver cg ON u.userId = cg.userId
      JOIN caregiveraddress cga ON cg.caregiverId = cga.caregiverId
      WHERE cg.caregiverId = ?
    `;

    db.query(query, [caregiverId], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else if (results.length === 0) {
        res.status(404).json({ error: "Caregiver not found" });
      } else {
        res.json(results[0]);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const allocateCaregiver = async (req, res) => {
  try {
    const { caretakerId, caregiverId, requirementId, status, instruction } =
      req.body;
    console.log(caregiverId);

    // Fetch the category for the given caretakerId
    const categoryQuery = `SELECT category FROM caretakernew WHERE caretakerId = ?`;
    db.query(categoryQuery, [caretakerId], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
        return;
      }

      const category = results[0].category;

      // Check if a row with the relevant requirementId exists in the careplan table
      const checkQuery = `SELECT * FROM careplan WHERE requirementId = ?`;
      db.query(checkQuery, [requirementId], (err, results) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: err.message });
          return;
        }

        // If a row with the relevant requirementId exists, update it. Otherwise, insert a new row.
        const isUpdate = results.length > 0;
        const query = isUpdate
          ? `
            UPDATE careplan
            SET caretakerId = ?, caregiverId = ?, status = 'not assigned', instruction = ?, category = ?
            WHERE requirementId = ?
          `
          : `
            INSERT INTO careplan (caretakerId, caregiverId, requirementId, status, instruction, category)
            VALUES (?, ?, ?, 'not assigned', ?, ?)
          `;

        db.query(
          query,
          isUpdate
            ? [caretakerId, caregiverId, instruction, category, requirementId]
            : [caretakerId, caregiverId, requirementId, instruction, category],
          (err, results) => {
            if (err) {
              console.error(err.message);
              res.status(500).json({ error: err.message });
            } else {
              const message = isUpdate
                ? "Careplan updated successfully!"
                : "Caregiver allocated successfully!";
              res.json({ message });
            }
          }
        );
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const handleinstruction = async (req, res) => {
  try {
    const { instruction, requirementId } = req.body;
    const query = `update careplan set instruction = ? where requirementId = ?`;
    db.query(query, [instruction, requirementId], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json({ message: "Instruction updated successfully!" });
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};


//#############################


export const getAllPendingTasks = async (req, res) => {
  try {
    const query =
      "SELECT requirement.* FROM requirement WHERE requirement.status='pending'";
    db.query(query, [], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateCaregiverAndInstructions = async (req, res) => {
  try {
    const caregiverData = req.body;
    const query =
      "UPDATE requirement SET caregiverId = ?, instruction = ?,status=? WHERE requirement.requirementId = ?;";
    db.query(
      query,
      [
        caregiverData?.caregiverId,
        caregiverData?.instructions,
        "assigned",
        caregiverData?.requirementId,
      ],
      (err, results) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: err.message });
        } else {
          res.json({ message: "updated Successfully!" });
        }
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getAllAssignedAndRejectedTasks = async (req, res) => {
  try {
    const query =
      "SELECT requirement.*,usernew.* FROM requirement INNER JOIN caregiver ON requirement.caregiverId=caregiver.caregiverId INNER JOIN usernew ON usernew.userId=caregiver.userId  WHERE requirement.status='assigned' OR requirement.status='rejected'";
    db.query(query, [], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getFinalizedPlans = async (req, res) => {
  try {
    const query =
      "SELECT requirement.*,usernew.* FROM requirement INNER JOIN caregiver ON requirement.caregiverId=caregiver.caregiverId INNER JOIN usernew ON usernew.userId=caregiver.userId  WHERE requirement.status!='assigned' AND requirement.status!='rejected' AND requirement.status!='pending'";
    db.query(query, [], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};