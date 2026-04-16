// utils/response.js

/* =========================================
   SUCCESS RESPONSE
========================================= */
const successResponse = (
  res,
  data = {},
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/* =========================================
   ERROR RESPONSE
========================================= */
const errorResponse = (
  res,
  message = "Something went wrong",
  statusCode = 500
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/* =========================================
   PAGINATED RESPONSE (ADVANCED 🔥)
========================================= */
const paginatedResponse = (
  res,
  data,
  page,
  limit,
  total,
  message = "Data fetched successfully"
) => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};