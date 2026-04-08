const express = require("express");
const router = express.Router();

const {
  getWallet,
  addMoney,
  withdrawMoney,
  transferMoney,
} = require("../controllers/walletController");

router.get("/", getWallet);
router.post("/add", addMoney);
router.post("/withdraw", withdrawMoney);
router.post("/transfer", transferMoney);

module.exports = router;