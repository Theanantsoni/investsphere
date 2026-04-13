const express = require("express");
const router = express.Router();

const controller = require("../controllers/portfolioOrderController");

/* ======================================================
 ROUTES
====================================================== */

// CREATE
router.post("/", controller.createOrder);

// GET ALL + FILTER
router.get("/", controller.getOrders);

// ANALYTICS
router.get("/analytics", controller.analytics);

// UPDATE STATUS
router.patch("/:id/status", controller.updateStatus);

// CANCEL
router.patch("/:id/cancel", controller.cancelOrder);

// MODIFY
router.patch("/:id", controller.modifyOrder);

module.exports = router;    