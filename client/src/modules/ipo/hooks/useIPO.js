import { useEffect, useState } from "react";
import axios from "axios";

const useIPO = (type) => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!type) return;

   const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);

    const url = `http://localhost:5000/api/ipo/${type}`;

    const response = await axios.get(url);

    setIpos(response.data || []);

  } catch (err) {
    console.error("IPO Fetch Error:", err.message);
    setError("Failed to load IPO data");
    setIpos([]);
  } finally {
    setLoading(false);
  }
};


    fetchData();
  }, [type]);

  return { ipos, loading, error };
};

export default useIPO;
