import axios from "axios";

/* =========================================
   API BASE URL
========================================= */

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

/* =========================================
   GET ALL STOCKS
========================================= */

const getStocks = async ({ search = "", filter = "All", page = 1 }) => {

  try {

    const response = await axios.get(
      `${API_BASE}/stock`,
      {
        params: {
          search,
          filter,
          page
        }
      }
    );

    return response.data;

  } catch (error) {

    console.error("Stock list fetch error:", error);

    return {
      stocks: [],
      totalPages: 1
    };

  }

};

/* =========================================
   GET SINGLE STOCK
========================================= */

const getStock = async (symbol) => {

  try {

    const response = await axios.get(
      `${API_BASE}/stock/${symbol}`
    );

    return response.data;

  } catch (error) {

    console.error("Stock detail fetch error:", error);

    throw error;

  }

};

/* =========================================
   EXPORT
========================================= */

const stockService = {
  getStocks,
  getStock
};

export default stockService;