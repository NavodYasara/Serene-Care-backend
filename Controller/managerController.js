import { db } from "../server.js";

// Get all caretakers from caretakrenew the table
export const getCaretakers = async (req, res) => {
  try {
    const query = `
  SELECT *
  FROM caretakernew
  WHERE caretakerId = ${caretaker.caretakerId}
`;

    
    db.query(query, (err, results) => {

      console.log(results);

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

// Get detailed caretaker information from both ct & ctAddress & ctMediCondition tables
export const getCaretakerInformation = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM caretakernew ct
      LEFT JOIN caretakerAddress cta ON ct.caretakerId = cta.caretakerId
      LEFT JOIN caretakerMediCondition ctm ON ct.caretakerId = ctm.caretakerId
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


// Get caregivers from usernew and caregiver tables
export const getCaregivers = async (req, res) => {
  try {
    const query = `
      SELECT *
      FROM usernew u
      JOIN caregiver cg ON u.userId = cg.userId
      WHERE u.userType = 'Caregiver'
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
    const caretakerId = req.params.id;
    const query = `
      SELECT *
      FROM caretakernew ct
      LEFT JOIN caretakerAddress cta ON ct.caretakerId = cta.caretakerId
      LEFT JOIN caretakerMediCondition ctm ON ct.caretakerId = ctm.caretakerId
      WHERE ct.caretakerId = ?
    `;

    db.query(query, [caretakerId], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json(results[0]);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get caregiver details by ID (you'll need a caregiverId from the dropdown)
export const getCaregiverById = async (req, res) => {
  try {
    const caregiverId = req.params.id;
    const query = `
      SELECT *
      FROM usernew u
      JOIN caregiver cg ON u.userId = cg.userId
      WHERE u.userId = ? AND u.userType = 'Caregiver'
    `;

    db.query(query, [caregiverId], (err, results) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json(results[0]);
      }
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};