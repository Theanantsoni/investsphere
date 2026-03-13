const API_BASE = "http://localhost:5000/api/reports";

/* ======================================================
   CREATE REPORT
====================================================== */

export const createReport = async ({
  title,
  description,
  userEmail,
  userName
}) => {
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        userEmail,
        userName
      })
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Create Report Error:", error);

    return {
      success: false,
      message: "Failed to submit report"
    };
  }
};

/* ======================================================
   GET USER REPORTS
====================================================== */

export const getReportsByEmail = async (email) => {
  try {
    const res = await fetch(`${API_BASE}/${email}`);

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Fetch Reports Error:", error);

    return {
      success: false,
      reports: []
    };
  }
};