const express = require("express");
const router = express.Router();

const { getSIPList, getSIPDetail } = require("../controllers/sipController");

router.get("/", getSIPList);
router.get("/:id", getSIPDetail);

module.exports = router;