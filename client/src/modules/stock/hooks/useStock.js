import { useEffect, useState } from "react";
import axios from "axios";

import API from "../../../config/api";

const API_URL = `${API}/stocks`;

const useStock = () => {

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = async () => {

    try {

      const res = await axios.get(API);

      setStocks(res.data.stocks || []);

    } catch (err) {

      console.log("Stock Fetch Error:", err.message);

      setStocks([]);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchStocks();

    const interval = setInterval(fetchStocks, 20000);

    return () => clearInterval(interval);

  }, []);

  return {
    stocks,
    loading,
    totalPages: 1,
  };

};

export default useStock;