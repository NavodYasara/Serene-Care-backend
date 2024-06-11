// reportController.js

import { db } from "../server.js";

// Endpoint to fetch overall system performance data
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
          throw new Error('Internal Server Error');
        }

        const systemPerformanceData = {
          totalServiceRequests: results[0].totalServiceRequests,
          completedServices: results[0].completedServices,
          pendingServices: results[0].pendingServices,
          rejectedServices: results[0].rejectedServices,
          avgCompletionTime: results[0].avgCompletionTime.toFixed(2) + " days", // Example formatting
        };

        res.status(200).json(systemPerformanceData);
      }
    );
  } catch (error) {
    console.error("Error in fetchSystemPerformanceData:", error);
    res.status(500).json({ error: error.message });
  }
};
