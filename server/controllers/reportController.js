const Report = require("../models/reportModel");

/* ======================================================
   CREATE REPORT
====================================================== */

exports.createReport = async (req, res) => {
  try {
    const { title, description, userEmail, userName } = req.body;

    /* ===== VALIDATION ===== */

    if (!title || !description || !userEmail || !userName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    /* ===== CREATE REPORT ===== */

    const report = new Report({
      title,
      description,
      userEmail,
      userName
    });

    await report.save();

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report
    });
  } catch (error) {
    console.error("Create Report Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while submitting report"
    });
  }
};

/* ======================================================
   GET REPORTS BY USER EMAIL
====================================================== */

exports.getReportsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const reports = await Report.find({ userEmail: email })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    console.error("Fetch Reports Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching reports"
    });
  }
};