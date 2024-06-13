// // reportController.js

import { db } from "../server.js";

// // Endpoint to fetch overall system performance data
export const fetchSystemPerformanceData = (req, res) => {
  try {
    db.query(
      `SELECT 
         COUNT(*) AS totalServiceRequests,
         SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completedServices,
         SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pendingServices,
         SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejectedServices,
         AVG(DATEDIFF(endDate, startDate)) AS avgCompletionTime
       FROM requirement
      `,
      (err, results) => {
        if (err) {
          console.error("Error fetching system performance data:", err);
          throw new Error("Internal Server Error");
        }

        const systemPerformanceData = {
          totalServiceRequests: results[0].totalServiceRequests,
          completedServices: results[0].completedServices,
          pendingServices: results[0].pendingServices,
          rejectedServices: results[0].rejectedServices,
          avgCompletionTime: results[0].avgCompletionTime.toFixed(2) + " days",
        };

        res.status(200).json(systemPerformanceData);
      }
    );
  } catch (error) {
    console.error("Error in fetchSystemPerformanceData:", error);
    res.status(500).json({ error: error.message });
  }
};

// Requirements Due This Month
export const requirementsDueThisMonth = (req, res) => {
  try {
    const query = `
            SELECT COUNT(*) AS due_this_month
            FROM requirement
            WHERE MONTH(endDate) = MONTH(CURRENT_DATE) AND YEAR(endDate) = YEAR(CURRENT_DATE);
        `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Database query failed" });
      }

      res.json(results[0]);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Recurring Requirements for the Same Caretaker
export const recurringRequirements = (req, res) => {
  try {
    const query = `
        SELECT 
        r.caretakerId, 
        COUNT(*) AS recurring_requirements,
        CONCAT(ct.firstName, ' ', ct.lastName) AS ctName
        FROM 
        requirement r
        JOIN 
        caretakernew ct ON r.caretakerId = ct.caretakerId
        GROUP BY 
        r.caretakerId
        HAVING 
        recurring_requirements > 1;
        `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Database query failed" });
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -- Requirements Started This Month
export const requirementsStartedThisMonth = (req, res) => {
  try {
    const query = `
            SELECT COUNT(*) AS started_this_month
            FROM requirement
            WHERE MONTH(startDate) = MONTH(CURRENT_DATE) AND YEAR(startDate) = YEAR(CURRENT_DATE);
        `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Database query failed" });
      }

      res.json(results[0]);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -- Number of Requirements Assigned to Each Caregiver
export const requirementsAssignedToEachCaretaker = (req, res) => {
  try {
    const query = `
    SELECT 
        r.caretakerId, 
        COUNT(*) AS requirements_assigned,
        CONCAT(ct.firstName, ' ', ct.lastName) AS ctName
        FROM 
        requirement r
        JOIN 
        caretakernew ct ON r.caretakerId = ct.caretakerId
        GROUP BY 
        r.caretakerId;

        `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Database query failed" });
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -- Number of Requirements Completed by Each Caregiver
export const requirementsCompletedByEachCaretaker = (req, res) => {
  try {
    const query = `
            SELECT caregiverId, COUNT(*) AS completed_requirements
            FROM requirement
            WHERE status = 'finished'
            GROUP BY caregiverId;
        `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Database query failed" });
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -- Total Number of Caretakers Served
export const totalCaretakersServed = (req, res) => {
  try {
    const query = `
            SELECT COUNT(DISTINCT caretakerId) AS total_caretakers_served
            FROM requirement;
        `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Database query failed" });
      }

      res.json(results[0]);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -- Number of Feedback Entries Received This Month
export const feedbackThisMonth = (req, res) => {
  try {
    const query = `
            SELECT COUNT(*) AS feedback_this_month
            FROM feedback
            WHERE MONTH(Date) = MONTH(CURRENT_DATE) AND YEAR(Date) = YEAR(CURRENT_DATE);
        `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ error: "Database query failed" });
      }

      res.json(results[0]);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
