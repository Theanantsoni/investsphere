const express = require("express");

const {
  createReport,
  getReportsByEmail
} = require("../controllers/reportController");

const router = express.Router();

/* ================= CREATE REPORT ================= */

router.post("/", createReport);

/* ================= GET USER REPORTS ================= */

router.get("/:email", getReportsByEmail);

module.exports = router;