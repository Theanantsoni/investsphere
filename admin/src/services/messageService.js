// admin/src/services/messageService.js

import API from "./api";

/* ======================================================
   COMMON ERROR HANDLER
====================================================== */
const handleError = (error) => {
  console.error("API ERROR:", error?.response || error);
  return {
    success: false,
    message:
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong",
  };
};

/* ======================================================
   EMAILS
====================================================== */
export const getAllEmails = async () => {
  try {
    const res = await API.get("/messages/emails");
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

/* ======================================================
   SEND MESSAGE
====================================================== */
export const sendMessage = async (data) => {
  try {
    const res = await API.post("/messages/send", data);
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

/* ======================================================
   GET ALL MESSAGES
====================================================== */
export const getAllMessages = async () => {
  try {
    const res = await API.get("/messages/all");
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

/* ======================================================
   FILTER BY EMAIL
====================================================== */
export const getMessagesByEmail = async (email) => {
  try {
    const res = await API.get(
      `/messages/by-email?email=${encodeURIComponent(email)}`
    );
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};

/* ======================================================
   SUGGESTIONS
====================================================== */
export const getSuggestions = async () => {
  try {
    const res = await API.get("/messages/suggestions");
    return res.data;
  } catch (error) {
    return handleError(error);
  }
};