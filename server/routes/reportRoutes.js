const express = require("express");
const router = express.Router();

const {
  createReport,
  getReportsByEmail
} = require("../controllers/reportController");

/* ======================================================
   CREATE REPORT
====================================================== */

router.post("/", createReport);

/* ======================================================
   GET USER REPORTS
====================================================== */

router.get("/:email", getReportsByEmail);

module.exports = router;