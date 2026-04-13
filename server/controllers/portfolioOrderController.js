const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const service = require("../services/portfolioOrderService");

/* ======================================================
 CREATE ORDER
====================================================== */

const createOrder = asyncHandler(async (req, res) => {
  const order = await service.createOrder(req.body);

  res.status(201).json({
    success: true,
    data: order,
  });
});

/* ======================================================
 GET ORDERS
====================================================== */

const getOrders = asyncHandler(async (req, res) => {
  const orders = await service.getOrders(req.query);

  res.json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/* ======================================================
 UPDATE STATUS
====================================================== */

const updateStatus = asyncHandler(async (req, res) => {
  const order = await service.updateOrderStatus(
    req.params.id,
    req.body.status
  );

  res.json({ success: true, data: order });
});

/* ======================================================
 CANCEL
====================================================== */

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await service.cancelOrder(req.params.id);

  res.json({ success: true, data: order });
});

/* ======================================================
 MODIFY
====================================================== */

const modifyOrder = asyncHandler(async (req, res) => {
  const order = await service.modifyOrder(
    req.params.id,
    req.body
  );

  res.json({ success: true, data: order });
});

/* ======================================================
 ANALYTICS
====================================================== */

const analytics = asyncHandler(async (req, res) => {
  const data = await service.getOrderAnalytics(req.query.userEmail);

  res.json({ success: true, data });
});

module.exports = {
  createOrder,
  getOrders,
  updateStatus,
  cancelOrder,
  modifyOrder,
  analytics,
};